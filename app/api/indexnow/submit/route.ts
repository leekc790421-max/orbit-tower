/**
 * POST /api/indexnow/submit
 * 
 * IndexNow 即時搜尋引擎報備 API
 * 
 * 功能：
 * - 向 Bing, Yandex, Seznam 等搜尋引擎即時推送 URL
 * - 支援批量提交
 * - 自動生成 IndexNow Key
 * 
 * 參考：https://www.indexnow.org/
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/rate-limit/rate-limiter';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://orbit-tower.vercel.app';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'orbit-tower-indexnow-key-2026';
const INDEXNOW_KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

// IndexNow API Endpoints
const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://search.seznam.cz/indexnow',
  'https://yandex.com/indexnow',
];

export async function POST(request: NextRequest) {
  // Rate Limiting
  const rateLimitResult = withRateLimit(request, 'global');
  if (!rateLimitResult.allowed) {
    return rateLimitResult.response!;
  }

  try {
    const body = await request.json();
    const { urls, type } = body;

    // 驗證輸入
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: '缺少 urls 陣列' },
        { status: 400 }
      );
    }

    if (urls.length > 100) {
      return NextResponse.json(
        { error: '單次提交最多 100 個 URL' },
        { status: 400 }
      );
    }

    // 驗證 URL 格式
    const validUrls = urls.filter((url: string) => {
      try {
        new URL(url);
        return url.startsWith(SITE_URL);
      } catch {
        return false;
      }
    });

    if (validUrls.length === 0) {
      return NextResponse.json(
        { error: '沒有有效的 URL' },
        { status: 400 }
      );
    }

    // 提交到 IndexNow
    const results = await submitToIndexNow(validUrls, type || 'URLUpdated');

    return NextResponse.json({
      success: true,
      data: {
        submitted: validUrls.length,
        endpoints: results,
        key_location: INDEXNOW_KEY_LOCATION,
      },
      message: `已提交 ${validUrls.length} 個 URL 到 IndexNow`,
    });

  } catch (error: unknown) {
    console.error('IndexNow submit error:', error);
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    );
  }
}

/**
 * 提交 URL 到 IndexNow API
 */
async function submitToIndexNow(
  urls: string[],
  type: 'URLUpdated' | 'URLDeleted' | 'URLAdded'
) {
  const results = [];

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host: new URL(SITE_URL).hostname,
          key: INDEXNOW_KEY,
          keyLocation: INDEXNOW_KEY_LOCATION,
          urlList: urls,
          type,
        }),
      });

      results.push({
        endpoint,
        status: response.status,
        success: response.ok,
      });
    } catch (error) {
      results.push({
        endpoint,
        status: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
}

/**
 * GET /api/indexnow/submit
 * 
 * 查詢 IndexNow 狀態
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      site_url: SITE_URL,
      key: INDEXNOW_KEY,
      key_location: INDEXNOW_KEY_LOCATION,
      endpoints: INDEXNOW_ENDPOINTS,
    },
  });
}
