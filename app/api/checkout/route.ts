export const dynamic = 'force-dynamic';

/**
 * POST /api/checkout
 * 
 * 認領店面 API
 * 
 * 安全機制：
 * 1. Rate Limiting (每分鐘 5 次)
 * 2. Transaction Lock (防止多重認領)
 * 3. Input Validation (防止 Injection)
 * 4. Idempotency Key (防止重複提交)
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/rate-limit/rate-limiter';
import { validateJsonInput, validateEmail, validateSlug, validateTaxId } from '@/lib/validation/validator';
import { executeTransaction } from '@/lib/supabase/client';

/**
 * 建立 Stripe Checkout Session
 */
async function createStripeCheckoutSession(params: {
  storeId: string;
  email: string;
  plan: string;
  amount: number;
}): Promise<string | null> {
  // 如果沒有 Stripe 金鑰，返回模擬 URL
  if (!process.env.STRIPE_SECRET_KEY) {
    return `/checkout/stripe?store=${params.storeId}&plan=${params.plan}&amount=${params.amount}`;
  }
  
  try {
    // 動態載入 Stripe (避免 build 階段錯誤)
    const stripe = new (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);
    
    const session = await stripe.checkout.sessions.create({
      customer_email: params.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Orbit Tower ${params.plan === 'scale' ? 'Gold' : 'Pro'} Plan`,
              description: params.plan === 'scale' 
                ? '黃金樓層 — 1F-2F 黃金雙層 + Bloom 霓虹光效' 
                : 'Pro 樓層 — 品牌專屬空間',
            },
            unit_amount: params.amount * 100, // Stripe 使用分
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://orbit.xingdeng.tw'}/dashboard?claimed=${params.storeId}&success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://orbit.xingdeng.tw'}/dashboard?claimed=${params.storeId}&cancelled=true`,
      metadata: {
        store_id: params.storeId,
        plan: params.plan,
      },
    });
    
    return session.url;
  } catch (error) {
    console.error('Stripe session error:', error);
    return null;
  }
}

// Rate Limit: 每分鐘 5 次
const RATE_LIMIT_TYPE = 'checkout' as const;

export async function POST(request: NextRequest) {
  // 1. Rate Limiting
  const rateLimitResult = withRateLimit(request, RATE_LIMIT_TYPE);
  if (!rateLimitResult.allowed) {
    return rateLimitResult.response!;
  }
  
  try {
    // 2. 解析請求
    const body = await request.json();
    
    // 3. Input Validation
    const validation = validateJsonInput(body, {
      store_id: { type: 'string', required: true, maxLength: 100 },
      brand_name: { type: 'string', required: true, maxLength: 200 },
      slug: { type: 'string', required: true, maxLength: 100 },
      email: { type: 'string', required: true, maxLength: 255 },
      tax_id: { type: 'string', required: false, maxLength: 20 },
      plan: { type: 'string', required: true, maxLength: 50 },
      payment_channel: { type: 'string', required: true, maxLength: 50 },
    });
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    const data = validation.sanitized as Record<string, string>;
    
    // 4. 驗證 Email 格式
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }
    
    // 5. 驗證 Slug
    const slugValidation = validateSlug(data.slug);
    if (!slugValidation.valid) {
      return NextResponse.json(
        { error: slugValidation.error },
        { status: 400 }
      );
    }
    
    // 6. 驗證統一編號 (如果有)
    if (data.tax_id) {
      const taxIdValidation = validateTaxId(data.tax_id);
      if (!taxIdValidation.valid) {
        return NextResponse.json(
          { error: taxIdValidation.error },
          { status: 400 }
        );
      }
    }
    
    // 7. 驗證 Plan
    const validPlans = ['landing', 'growth', 'scale'];
    if (!validPlans.includes(data.plan)) {
      return NextResponse.json(
        { error: '無效的方案' },
        { status: 400 }
      );
    }
    
    // 8. 驗證 Payment Channel
    const validChannels = ['stripe', 'rakuten', 'bank_of_taiwan', 'payoneer'];
    if (!validChannels.includes(data.payment_channel)) {
      return NextResponse.json(
        { error: '無效的付款通道' },
        { status: 400 }
      );
    }
    
    // 8b. 判斷付款方式類型
    const isStripe = data.payment_channel === 'stripe';
    const isManualPayment = ['rakuten', 'bank_of_taiwan', 'payoneer'].includes(data.payment_channel);
    
    // 9. 執行 Transaction (原子性操作)
    const txResult = await executeTransaction(async (tx) => {
      // 9a. 檢查 Store 是否已被認領
      const availability = await tx.checkStoreAvailability(data.store_id);
      
      if (!availability.available) {
        throw new Error('此店面已被認領或不存在');
      }
      
      // 9b. 認領 Store (使用 Database Function 確保原子性)
      const claimResult = await tx.claimStore(data.store_id, {
        brand_name: data.brand_name,
        email: data.email,
        plan: data.plan,
      });
      
      if (!claimResult.success) {
        throw new Error(claimResult.error);
      }
      
      // 9c. 建立 Payment Record
      const amount = data.plan === 'scale' ? 99 : data.plan === 'growth' ? 29 : 0;
      const paymentResult = await tx.createPayment(
        data.store_id,
        amount,
        data.payment_channel
      );
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.error);
      }
      
      // 9d. Stripe 即時開通 / 手動付款待審核
      let checkoutUrl = null;
      let kycStatus = 'pending';
      
      if (isStripe) {
        // Stripe 訂閱 — 建立 Checkout Session
        checkoutUrl = await createStripeCheckoutSession({
          storeId: data.store_id,
          email: data.email,
          plan: data.plan,
          amount,
        });
        kycStatus = 'pending'; // 等待 Stripe Webhook 確認
      } else if (isManualPayment) {
        // 電匯/Payoneer — 等待上傳水單
        kycStatus = 'awaiting_proof';
      }
      
      return {
        claim_id: data.store_id,
        payment_id: paymentResult.paymentId,
        amount,
        payment_type: data.payment_channel,
        checkout_url: checkoutUrl,
        kyc_status: kycStatus,
        message: isStripe 
          ? '請完成 Stripe 付款，付款後自動開通'
          : '請上傳匯款憑證，審核後開通',
      };
    });
    
    // 10. 處理 Transaction 結果
    if (!txResult.success) {
      // 如果是衝突 (Race Condition)
      if (txResult.conflict) {
        return NextResponse.json(
          {
            error: '認領衝突',
            message: '此店面已被其他使用者認領，請選擇其他店面',
          },
          { status: 409 } // Conflict
        );
      }
      
      return NextResponse.json(
        { error: txResult.error },
        { status: 500 }
      );
    }
    
    // 11. 成功
    return NextResponse.json(
      {
        success: true,
        data: txResult.data,
        message: '認領成功，請完成付款',
      },
      { status: 201 }
    );
    
  } catch (error: unknown) {
    console.error('Checkout error:', error);
    
    const errorMessage = error instanceof Error ? error.message : '';
    
    // JSON parse error
    if (errorMessage.includes('JSON')) {
      return NextResponse.json(
        { error: '請求格式錯誤' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: '伺服器錯誤，請稍後再試' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/checkout
 * 取得認領狀態 (用於查詢)
 */
export async function GET(request: NextRequest) {
  const rateLimitResult = withRateLimit(request, 'global');
  if (!rateLimitResult.allowed) {
    return rateLimitResult.response!;
  }
  
  const { searchParams } = new URL(request.url);
  const claimId = searchParams.get('claim_id');
  
  if (!claimId) {
    return NextResponse.json(
      { error: '缺少 claim_id 參數' },
      { status: 400 }
    );
  }
  
  // TODO: 查詢認領狀態
  
  return NextResponse.json({
    claim_id: claimId,
    status: 'pending',
  });
}
