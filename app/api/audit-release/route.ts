export const dynamic = 'force-dynamic';

/**
 * POST /api/audit-release
 * 
 * 管理員一鍵審核放行 API
 * 
 * 功能：
 * - 審核認領請求 (approve/reject)
 * - 自動開通黃金樓層
 * - 觸發 AI 廣告生成
 * 
 * 安全機制：
 * - 需要 ADMIN_SECRET 驗證
 * - Rate Limiting
 * - Audit Log 記錄
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/rate-limit/rate-limiter';
import { getSupabaseAdmin } from '@/lib/supabase/client';

const ADMIN_SECRET = process.env.ADMIN_SECRET || '';

export async function POST(request: NextRequest) {
  // 1. Rate Limiting
  const rateLimitResult = withRateLimit(request, 'global');
  if (!rateLimitResult.allowed) {
    return rateLimitResult.response!;
  }

  // 2. Admin Authentication
  const authHeader = request.headers.get('authorization');
  const providedSecret = authHeader?.replace('Bearer ', '');

  if (!ADMIN_SECRET || providedSecret !== ADMIN_SECRET) {
    return NextResponse.json(
      { error: '未授權：管理員密鑰錯誤' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { claim_id, action, reason } = body;

    if (!claim_id || !action) {
      return NextResponse.json(
        { error: '缺少必要參數: claim_id, action' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: '無效的 action，必須是 approve 或 reject' },
        { status: 400 }
      );
    }

    // 3. 查詢認領記錄 (使用 Lazy Initialization)
    const supabaseAdmin = getSupabaseAdmin();
    const { data: claim, error: claimError } = await supabaseAdmin
      .from('claims')
      .select('*')
      .eq('id', claim_id)
      .single();

    if (claimError || !claim) {
      return NextResponse.json(
        { error: '找不到認領記錄' },
        { status: 404 }
      );
    }

    // 4. 更新認領狀態
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const { error: updateError } = await supabaseAdmin
      .from('claims')
      .update({
        status: newStatus,
        reviewed_at: new Date().toISOString(),
        review_reason: reason || null,
      })
      .eq('id', claim_id);

    if (updateError) {
      console.error('Update claim error:', updateError);
      return NextResponse.json(
        { error: '更新認領狀態失敗' },
        { status: 500 }
      );
    }

    // 5. 如果核准，更新 Store 狀態
    if (action === 'approve') {
      const { error: storeError } = await supabaseAdmin
        .from('stores')
        .update({
          is_claimed: true,
          brand_name: claim.brand_name,
          owner_email: claim.email,
          plan: claim.plan,
          claimed_at: new Date().toISOString(),
        })
        .eq('id', claim.store_id);

      if (storeError) {
        console.error('Update store error:', storeError);
        return NextResponse.json(
          { error: '更新店面狀態失敗' },
          { status: 500 }
        );
      }

      // 6. 觸發 AI 廣告生成 (非阻塞)
      // TODO: 呼叫 AI 廣告生成服務
      console.log(`[Audit] Triggering AI ad generation for store ${claim.store_id}`);
    }

    // 7. 記錄 Audit Log
    await supabaseAdmin.from('audit_logs').insert({
      claim_id,
      action,
      admin_id: 'admin',
      reason: reason || null,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: action === 'approve' ? '已核准並開通樓層' : '已拒絕認領請求',
      data: {
        claim_id,
        status: newStatus,
        store_id: claim.store_id,
      },
    });

  } catch (error: unknown) {
    console.error('Audit release error:', error);
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/audit-release
 * 
 * 查詢待審核列表
 */
export async function GET(request: NextRequest) {
  // Admin Authentication
  const authHeader = request.headers.get('authorization');
  const providedSecret = authHeader?.replace('Bearer ', '');

  if (!ADMIN_SECRET || providedSecret !== ADMIN_SECRET) {
    return NextResponse.json(
      { error: '未授權' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'pending';

  // 使用 Lazy Initialization
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from('claims')
    .select(`
      *,
      stores (
        id,
        floor,
        face,
        brand_name
      )
    `)
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Query claims error:', error);
    return NextResponse.json(
      { error: '查詢失敗' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: data || [],
    count: data?.length || 0,
  });
}
