export const dynamic = 'force-dynamic';

/**
 * POST /api/referral
 * 
 * 裂變推薦系統 API
 * 
 * 功能：
 * - 生成專屬推薦碼
 * - 記錄推薦關係
 * - 查詢推薦統計
 * - 計算推薦獎勵
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/rate-limit/rate-limiter';
import { validateJsonInput } from '@/lib/validation/validator';

// 推薦獎勵設定
const REFERRAL_REWARDS = {
  landing: { referrer: 3000, referee: 2000 },     // NT$
  growth: { referrer: 5000, referee: 3000 },
  scale: { referrer: 10000, referee: 5000 },
};

/**
 * 生成推薦碼 (8 碼大寫字母+數字)
 */
function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 排除易混淆字元
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(request: NextRequest) {
  const rateLimitResult = withRateLimit(request, 'checkout');
  if (!rateLimitResult.allowed) {
    return rateLimitResult.response!;
  }

  try {
    const body = await request.json();
    const { action } = body;

    // === 生成推薦碼 ===
    if (action === 'generate') {
      const validation = validateJsonInput(body, {
        store_id: { type: 'string', required: true, maxLength: 100 },
        brand_name: { type: 'string', required: true, maxLength: 200 },
      });

      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      const data = validation.sanitized as Record<string, string>;
      const referralCode = generateReferralCode();

      // TODO: 存入 Supabase referrals 資料表
      console.log(`[Referral] Generated code ${referralCode} for store ${data.store_id}`);

      return NextResponse.json({
        success: true,
        data: {
          referral_code: referralCode,
          referral_link: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://orbit.xingdeng.tw'}/?ref=${referralCode}`,
          rewards: REFERRAL_REWARDS,
        },
      });
    }

    // === 記錄推薦關係 (新用戶使用推薦碼時) ===
    if (action === 'record') {
      const validation = validateJsonInput(body, {
        referral_code: { type: 'string', required: true, maxLength: 20 },
        new_store_id: { type: 'string', required: true, maxLength: 100 },
        plan: { type: 'string', required: true, maxLength: 50 },
      });

      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      const data = validation.sanitized as Record<string, string>;

      // TODO: 查詢推薦碼對應的 store
      // TODO: 建立推薦關係記錄
      // TODO: 計算獎勵

      const planKey = data.plan as keyof typeof REFERRAL_REWARDS;
      const reward = REFERRAL_REWARDS[planKey] || { referrer: 0, referee: 0 };

      console.log(`[Referral] Recorded: ${data.referral_code} -> ${data.new_store_id} (${data.plan})`);

      return NextResponse.json({
        success: true,
        data: {
          referrer_reward: reward.referrer,
          referee_reward: reward.referee,
          message: `推薦成功！推薦人獲得 NT$${reward.referrer.toLocaleString()} 獎勵，新用戶獲得 NT$${reward.referee.toLocaleString()} 折扣`,
        },
      });
    }

    // === 查詢推薦統計 ===
    if (action === 'stats') {
      const validation = validateJsonInput(body, {
        referral_code: { type: 'string', required: true, maxLength: 20 },
      });

      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      // TODO: 從 Supabase 查詢推薦統計
      return NextResponse.json({
        success: true,
        data: {
          referral_code: (body as Record<string, string>).referral_code,
          total_referrals: 0,
          successful_conversions: 0,
          total_rewards: 0,
          pending_rewards: 0,
        },
      });
    }

    return NextResponse.json(
      { error: '無效的 action，支援: generate, record, stats' },
      { status: 400 }
    );

  } catch (error: unknown) {
    console.error('Referral API error:', error);
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/referral?code=XXXX
 * 驗證推薦碼是否有效
 */
export async function GET(request: NextRequest) {
  const rateLimitResult = withRateLimit(request, 'global');
  if (!rateLimitResult.allowed) {
    return rateLimitResult.response!;
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: '缺少 code 參數' }, { status: 400 });
  }

  // TODO: 查詢 Supabase 驗證推薦碼
  // For now, accept any 8-char alphanumeric code
  const codeRegex = /^[A-Z0-9]{8}$/;
  if (!codeRegex.test(code)) {
    return NextResponse.json({ valid: false, error: '無效的推薦碼格式' }, { status: 400 });
  }

  return NextResponse.json({
    valid: true,
    data: {
      referral_code: code,
      referral_link: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://orbit.xingdeng.tw'}/?ref=${code}`,
    },
  });
}
