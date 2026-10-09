export const dynamic = 'force-dynamic';

/**
 * GET /api/stores
 * 
 * 取得所有店面資訊
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/rate-limit/rate-limiter';
import { getSupabase } from '@/lib/supabase/client';
import { FLOORS } from '@/data/units';

function staticStoreFallback(floor: string | null, face: string | null, status: string | null) {
  return FLOORS.flatMap((item) => item.units).filter((unit) => {
    const floorMatch = !floor || unit.floor === parseInt(floor, 10);
    const faceMatch = !face || unit.face === face.toUpperCase();
    const claimed = unit.status !== 'available';
    const statusMatch = !status || (status === 'claimed' ? claimed : status === 'available' ? !claimed : true);
    return floorMatch && faceMatch && statusMatch;
  }).map((unit) => ({
    id: unit.id,
    floor: unit.floor,
    face: unit.face,
    number: unit.number,
    is_claimed: unit.status !== 'available',
    brand_name: unit.brand ?? null,
    service: unit.service ?? null,
    status: unit.status,
  }));
}

export async function GET(request: NextRequest) {
  // Rate Limiting
  const rateLimitResult = withRateLimit(request, 'global');
  if (!rateLimitResult.allowed) {
    return rateLimitResult.response!;
  }

  try {
    const { searchParams } = new URL(request.url);
    const floor = searchParams.get('floor');
    const face = searchParams.get('face');
    const status = searchParams.get('status');

    // 使用 Lazy Initialization
    const supabase = getSupabase();
    let query = supabase
      .from('stores')
      .select('*')
      .order('floor', { ascending: true })
      .order('face', { ascending: true });

    if (floor) {
      query = query.eq('floor', parseInt(floor));
    }

    if (face) {
      query = query.eq('face', face.toUpperCase());
    }

    if (status === 'claimed') {
      query = query.eq('is_claimed', true);
    } else if (status === 'available') {
      query = query.eq('is_claimed', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Query stores error:', error);
      const fallback = staticStoreFallback(floor, face, status);
      return NextResponse.json({ success: true, data: fallback, count: fallback.length, source: 'catalog-fallback' });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
    });

  } catch (error: unknown) {
    console.error('Stores API error:', error);
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    );
  }
}
