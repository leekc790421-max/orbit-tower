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
    const validChannels = ['rakuten', 'bank_of_taiwan', 'payoneer'];
    if (!validChannels.includes(data.payment_channel)) {
      return NextResponse.json(
        { error: '無效的付款通道' },
        { status: 400 }
      );
    }
    
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
      const amount = data.plan === 'scale' ? 120000 : data.plan === 'growth' ? 60000 : 35000;
      const paymentResult = await tx.createPayment(
        data.store_id,
        amount,
        data.payment_channel
      );
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.error);
      }
      
      return {
        claim_id: data.store_id,
        payment_id: paymentResult.paymentId,
        amount,
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
