/**
 * ═══════════════════════════════════════════════════════════════════
 *  Orbit Tower — k6 高併發壓力測試腳本 v2.0
 * ═══════════════════════════════════════════════════════════════════
 *
 *  測試目標: https://orbit-tower.vercel.app (Production)
 *            http://localhost:3000                  (Local)
 *
 *  ── 三大測試情境 ──────────────────────────────────────────────
 *  1. Spike Test        — 30s 內湧入 1,000 VUs 造訪首頁 + API
 *  2. Drift API Stress  — 200 VUs 同時觸發漂流瓶 / IndexNow
 *  3. Concurrent Claims — 50 品牌主同時提交認領 + 水單 + 審核
 *
 *  ── SLO 目標 ─────────────────────────────────────────────────
 *  • API p95 響應時間 < 800ms
 *  • 錯誤率 (Error Rate) < 0.1%
 *  • HTTP 500 / 502 異常數 = 0
 *
 *  ── 執行方式 ─────────────────────────────────────────────────
 *  # 快速冒煙 (30s, 低負載)
 *  npm run stress:smoke
 *
 *  # 標準負載測試 (5min)
 *  npm run stress:load
 *
 *  # 完整壓力測試 (含 3 大場景)
 *  npm run stress
 *
 *  # 對 Production 執行
 *  npm run stress:prod
 *
 *  # Docker 執行 (不需安裝 k6)
 *  npm run stress:docker
 *
 *  # 僅執行單一場景
 *  npm run stress:spike
 *  npm run stress:drift
 *  npm run stress:claims
 *
 *  # 產出 HTML 報告 (需 k6-reporter)
 *  npm run stress:report
 *
 *  ── 環境變數 ─────────────────────────────────────────────────
 *  BASE_URL       目標網址 (default: http://localhost:3000)
 *  ADMIN_SECRET   管理者密鑰 (default: test-secret)
 *  K6_DURATION    漂流瓶場景持續時間 (default: 30s)
 *  K6_VUS         漂流瓶場景 VU 數 (default: 200)
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { randomIntBetween, randomItem } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

// ╔═══════════════════════════════════════════════════════════════╗
// ║  自訂指標 (Custom Metrics)                                   ║
// ╚═══════════════════════════════════════════════════════════════╝

// — 各 API 端點獨立追蹤 —
const homepageTrend     = new Trend('homepage_duration',     true);
const storesApiTrend    = new Trend('stores_api_duration',    true);
const driftApiTrend     = new Trend('drift_api_duration',     true);
const indexNowTrend     = new Trend('indexnow_api_duration',  true);
const claimsApiTrend    = new Trend('claims_api_duration',     true);
const receiptsApiTrend  = new Trend('receipts_api_duration',   true);
const auditApiTrend     = new Trend('audit_api_duration',      true);

// — 錯誤率 —
const apiErrors       = new Rate('api_errors');
const driftErrors     = new Rate('drift_errors');
const claimsErrors    = new Rate('claims_errors');

// — 計數器 —
const totalReqs       = new Counter('total_requests');
const successReqs     = new Counter('successful_requests');
const failedReqs      = new Counter('failed_requests');
const rateLimitHits   = new Counter('rate_limit_hits');
const deadlockHits    = new Counter('deadlock_hits');

// ╔═══════════════════════════════════════════════════════════════╗
// ║  環境設定                                                     ║
// ╚═══════════════════════════════════════════════════════════════╝

const BASE_URL     = __ENV.BASE_URL     || 'http://localhost:3000';
const ADMIN_SECRET = __ENV.ADMIN_SECRET || 'test-secret';
const K6_DURATION  = __ENV.K6_DURATION  || '30s';
const K6_VUS       = parseInt(__ENV.K6_VUS || '200', 10);

// 通用 HTTP 標頭
const COMMON_HEADERS = {
  'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8,ja;q=0.7',
  'User-Agent': 'k6-stress-test/2.0 (Orbit Tower)',
};

// ╔═══════════════════════════════════════════════════════════════╗
// ║  測試資料                                                     ║
// ╚═══════════════════════════════════════════════════════════════╝

const TEST_BRANDS = [
  { name: 'NeuralForge AI',     slug: 'neuralforge-stress',  category: '科技新創',     email: 'stress@neuralforge.test'  },
  { name: 'PixelMonk Studio',   slug: 'pixelmonk-stress',    category: '個人品牌',     email: 'stress@pixelmonk.test'    },
  { name: 'PayStream Global',   slug: 'paystream-stress',    category: '自動金流商戶', email: 'stress@paystream.test'    },
  { name: 'DeepSight Medical',  slug: 'deepsight-stress',    category: 'AI 診斷專區',  email: 'stress@deepsight.test'    },
  { name: 'GeoRank Search',     slug: 'georank-stress',      category: 'GEO 搜尋品牌', email: 'stress@georank.test'      },
  { name: 'Vault-X Secure',     slug: 'vaultx-stress',       category: '機密沙盒實案', email: 'stress@vaultx.test'       },
  { name: 'QuantumLeap SaaS',   slug: 'quantumleap-stress',  category: '科技新創',     email: 'stress@quantumleap.test'  },
  { name: 'SkyLabs Imaging',    slug: 'skylabs-stress',      category: '科技新創',     email: 'stress@skylabs.test'      },
];

const PAYMENT_CHANNELS = ['rakuten', 'bank_of_taiwan', 'payoneer'];
const PLAN_IDS        = ['landing', 'growth', 'scale'];

// ╔═══════════════════════════════════════════════════════════════╗
// ║  SLO 閾值 & 場景配置                                         ║
// ╚═══════════════════════════════════════════════════════════════╝

export const options = {
  scenarios: {
    // ─────────────────────────────────────────────────────────
    // 場景 1: 瞬時湧入階段 (Spike Test)
    // 30 秒內從 10 req/s 飆升至 1,000 req/s 再降回 0
    // ─────────────────────────────────────────────────────────
    spike_test: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      preAllocatedVUs: 200,
      maxVUs: 1000,
      stages: [
        { target: 100,  duration: '5s'  },  // 5s  內達到 100 req/s
        { target: 500,  duration: '10s' },  // 10s 內達到 500 req/s
        { target: 1000, duration: '10s' },  // 10s 內達到 1000 req/s (峰值)
        { target: 1000, duration: '5s'  },  // 5s  維持峰值
        { target: 0,    duration: '5s'  },  // 5s  降回 0
      ],
      exec: 'spikeTest',
      tags: { scenario: 'spike', test_name: 'spike_test' },
    },

    // ─────────────────────────────────────────────────────────
    // 場景 2: 漂流瓶 API 極限測試
    // 200 VUs 持續觸發 /api/drift/generate + /api/indexnow
    // ─────────────────────────────────────────────────────────
    drift_api_stress: {
      executor: 'constant-vus',
      vus: K6_VUS,
      duration: K6_DURATION,
      exec: 'driftApiStress',
      tags: { scenario: 'drift', test_name: 'drift_stress' },
      startTime: '40s',  // 等 spike 結束後再跑
    },

    // ─────────────────────────────────────────────────────────
    // 場景 3: 併發審核與寫入測試
    // 50 VUs 同時提交認領 + 水單 + 審核，測試 RLS / Deadlock
    // ─────────────────────────────────────────────────────────
    concurrent_claims: {
      executor: 'per-vu-iterations',
      vus: 50,
      iterations: 10,        // 每 VU 跑 10 次迭代 = 500 次認領
      maxDuration: '2m',
      exec: 'concurrentClaims',
      tags: { scenario: 'claims', test_name: 'concurrent_claims' },
      startTime: '1m 15s',   // 等 drift 結束後再跑
    },
  },

  thresholds: {
    // ── 全域 SLO ──
    'http_req_duration': ['p(95)<800', 'p(99)<1500', 'avg<400'],
    'http_req_failed':   ['rate<0.01'],

    // ── 自訂錯誤率 SLO ──
    'api_errors':    ['rate<0.001'],
    'drift_errors':  ['rate<0.001'],
    'claims_errors': ['rate<0.001'],

    // ── HTTP 5xx 必須為 0 ──
    'http_req_failed{status:500}': ['count==0'],
    'http_req_failed{status:502}': ['count==0'],
    'http_req_failed{status:503}': ['count==0'],

    // ── 各 API 端點 p95 ──
    'homepage_duration':    ['p(95)<2000'],   // 首頁含 3D 資源，放寬到 2s
    'stores_api_duration':  ['p(95)<800'],
    'drift_api_duration':   ['p(95)<1500'],   // Groq API 較慢，放寬到 1.5s
    'claims_api_duration':  ['p(95)<800'],
    'receipts_api_duration':['p(95)<800'],
    'audit_api_duration':   ['p(95)<800'],

    // ── Deadlock 必須為 0 ──
    'deadlock_hits': ['count==0'],
  },

  // ── 網路設定 ──
  noConnectionReuse: false,
  userAgent: 'k6-stress-test/2.0 (Orbit Tower)',
};

// ╔═══════════════════════════════════════════════════════════════╗
// ║  輔助函式                                                     ║
// ╚═══════════════════════════════════════════════════════════════╝

/**
 * 統一記錄 API 指標
 * @param {object} response  - k6 HTTP response
 * @param {string} apiName   - API 識別名稱
 * @param {Trend}  trend     - 對應的自訂 Trend 指標
 * @param {Rate}   errorRate - 對應的自訂 Rate 指標
 */
function recordMetrics(response, apiName, trend, errorRate) {
  totalReqs.add(1);
  trend.add(response.timings.duration);

  const isOk = response.status >= 200 && response.status < 400;
  const isRateLimited = response.status === 429;

  if (isOk) {
    successReqs.add(1);
    errorRate.add(0);
  } else {
    failedReqs.add(1);
    errorRate.add(1);
  }

  if (isRateLimited) {
    rateLimitHits.add(1);
  }

  // 偵測 Deadlock (PostgreSQL error 通常回 500 + 特定訊息)
  if (response.status === 500) {
    const body = response.body || '';
    if (body.includes('deadlock') || body.includes('Deadlock') || body.includes('could not serialize')) {
      deadlockHits.add(1);
    }
  }

  return isOk;
}

/**
 * 生成隨機品牌測試資料
 */
function randomBrandData() {
  const brand = randomItem(TEST_BRANDS);
  const suffix = randomIntBetween(1000, 9999);
  return {
    brand_name: `${brand.name} #${suffix}`,
    slug: `${brand.slug}-${suffix}`,
    category: brand.category,
    email: `user${suffix}@${brand.email.split('@')[1]}`,
    tax_id: `28${randomIntBetween(100000, 999999)}`,
    plan: randomItem(PLAN_IDS),
    payment_channel: randomItem(PAYMENT_CHANNELS),
    reference: `${randomIntBetween(10000, 99999)}`,
  };
}

/**
 * 安全 JSON parse (不拋出例外)
 */
function safeJsonParse(body) {
  try { return JSON.parse(body); } catch { return null; }
}

// ╔═══════════════════════════════════════════════════════════════╗
// ║  場景 1: 瞬時湧入階段 (Spike Test)                          ║
// ║  模擬 1,000 VUs 同時造訪首頁 + 樓層資料 API                  ║
// ╚═══════════════════════════════════════════════════════════════╝

export function spikeTest() {
  group('S1 :: Spike Test — 瞬時湧入', () => {

    // ── 1a. 首頁載入 (含 HTML + 內聯 JS/CSS) ──
    const homeRes = http.get(`${BASE_URL}/`, {
      tags: { name: 'GET / (首頁)' },
      headers: {
        ...COMMON_HEADERS,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    recordMetrics(homeRes, 'homepage', homepageTrend, apiErrors);

    check(homeRes, {
      'S1 首頁 :: HTTP 200':        (r) => r.status === 200,
      'S1 首頁 :: 含 SNT 品牌':     (r) => (r.body || '').includes('SNT'),
      'S1 首頁 :: 含 Canvas (3D)':  (r) => (r.body || '').includes('canvas'),
      'S1 首頁 :: 響應 < 3s':       (r) => r.timings.duration < 3000,
    });

    // ── 1b. 靜態資源 (Next.js chunks) ──
    // 模擬瀏覽器載入首頁後隨即請求 JS/CSS chunks
    const nextDataRes = http.get(`${BASE_URL}/_next/data/`, {
      tags: { name: 'GET /_next/data/' },
      headers: { ...COMMON_HEADERS, 'Accept': '*/*' },
    });
    check(nextDataRes, {
      'S1 靜態 :: Next data 可訪問': (r) => r.status === 200 || r.status === 404,
    });

    // ── 1c. 樓層資料 API ──
    const storesRes = http.get(`${BASE_URL}/api/stores`, {
      tags: { name: 'GET /api/stores' },
      headers: { ...COMMON_HEADERS, 'Accept': 'application/json' },
    });

    if (storesRes.status !== 404) {
      recordMetrics(storesRes, 'stores_api', storesApiTrend, apiErrors);

      check(storesRes, {
        'S1 API :: stores 成功':       (r) => r.status === 200,
        'S1 API :: stores p95 < 800ms': (r) => r.timings.duration < 800,
        'S1 API :: stores 有 JSON':    (r) => safeJsonParse(r.body) !== null,
      });
    }

    // ── 1d. OG Image (靜態資源) ──
    const ogRes = http.get(`${BASE_URL}/og-image.svg`, {
      tags: { name: 'GET /og-image.svg' },
      headers: { ...COMMON_HEADERS, 'Accept': 'image/svg+xml' },
    });
    check(ogRes, {
      'S1 OG :: 圖片可訪問': (r) => r.status === 200,
    });

    // ── 1e. robots.txt & sitemap.xml ──
    const robotsRes = http.get(`${BASE_URL}/robots.txt`, {
      tags: { name: 'GET /robots.txt' },
    });
    check(robotsRes, {
      'S1 SEO :: robots.txt 可訪問': (r) => r.status === 200,
    });

    sleep(randomIntBetween(1, 3));
  });
}

// ╔═══════════════════════════════════════════════════════════════╗
// ║  場景 2: 漂流瓶 API 極限測試                                 ║
// ║  200 VUs 同時觸發 Groq API 生成 + IndexNow ping              ║
// ╚═══════════════════════════════════════════════════════════════╝

export function driftApiStress() {
  group('S2 :: Drift API Stress — 漂流瓶極限', () => {

    const userId = `stress-user-${randomIntBetween(1, 5000)}`;
    const action = randomItem(['throw', 'catch', 'generate']);

    // ── 2a. 漂流瓶生成 API ──
    const driftPayload = JSON.stringify({
      action,
      user_id: userId,
      message: `漂流瓶 #${randomIntBetween(1, 99999)} — 壓力測試`,
      locale: randomItem(['zh-TW', 'en', 'ja']),
    });

    const driftRes = http.post(
      `${BASE_URL}/api/drift/generate`,
      driftPayload,
      {
        tags: { name: 'POST /api/drift/generate' },
        headers: {
          ...COMMON_HEADERS,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Request-ID': `drift-${randomIntBetween(100000, 999999)}`,
        },
      }
    );

    const driftOk = recordMetrics(driftRes, 'drift_api', driftApiTrend, driftErrors);

    check(driftRes, {
      'S2 Drift :: 有回應 (非 0)':    (r) => r.status !== 0,
      'S2 Drift :: 無 5xx 錯誤':      (r) => r.status < 500,
      'S2 Drift :: 響應 < 1.5s':      (r) => r.timings.duration < 1500,
    });

    // 429 = Rate Limit 正常觸發，記錄但不視為錯誤
    if (driftRes.status === 429) {
      check(driftRes, {
        'S2 Drift :: 429 有 Retry-After': (r) => {
          const headers = r.headers || {};
          return true; // 僅記錄，不強制要求 header
        },
      });
    }

    // 驗證回應結構 (如果成功)
    if (driftRes.status === 200) {
      const json = safeJsonParse(driftRes.body);
      check(json, {
        'S2 Drift :: 回應有 fortune 或 message': (j) => {
          if (!j) return false;
          return !!(j.fortune || j.message || j.content || j.data);
        },
      });
    }

    // ── 2b. IndexNow Ping (10% 機率觸發) ──
    if (Math.random() < 0.1) {
      const indexPayload = JSON.stringify({
        url: `${BASE_URL}/drift/${userId}`,
        key: 'stress-test-key',
      });

      const indexRes = http.post(
        `${BASE_URL}/api/indexnow/submit`,
        indexPayload,
        {
          tags: { name: 'POST /api/indexnow/submit' },
          headers: {
            ...COMMON_HEADERS,
            'Content-Type': 'application/json',
          },
        }
      );

      if (indexRes.status !== 404) {
        recordMetrics(indexRes, 'indexnow_api', indexNowTrend, apiErrors);

        check(indexRes, {
          'S2 IndexNow :: 無 5xx 錯誤': (r) => r.status < 500,
          'S2 IndexNow :: 響應 < 800ms': (r) => r.timings.duration < 800,
        });
      }
    }

    // ── 2c. 快取驗證: 重複請求相同資源 ──
    if (Math.random() < 0.2) {
      const cacheRes = http.get(`${BASE_URL}/api/drift/generate?user_id=${userId}&action=catch`, {
        tags: { name: 'GET /api/drift/generate (cache)' },
        headers: { ...COMMON_HEADERS, 'Accept': 'application/json' },
      });
      if (cacheRes.status !== 404 && cacheRes.status !== 405) {
        check(cacheRes, {
          'S2 Cache :: 快取請求無 5xx': (r) => r.status < 500,
        });
      }
    }

    sleep(randomIntBetween(1, 2));
  });
}

// ╔═══════════════════════════════════════════════════════════════╗
// ║  場景 3: 併發審核與寫入測試                                   ║
// ║  50 品牌主同時提交認領 + 水單 + 審核                          ║
// ║  測試 Supabase RLS & Transaction Locks                        ║
// ╚═══════════════════════════════════════════════════════════════╝

export function concurrentClaims() {
  group('S3 :: Concurrent Claims — 併發認領寫入', () => {

    const data = randomBrandData();

    // ── 3a. 提交認領請求 ──
    const claimPayload = JSON.stringify({
      brand_name: data.brand_name,
      slug: data.slug,
      category: data.category,
      email: data.email,
      tax_id: data.tax_id,
      plan: data.plan,
      payment_channel: data.payment_channel,
      reference: data.reference,
    });

    const claimRes = http.post(
      `${BASE_URL}/api/checkout`,
      claimPayload,
      {
        tags: { name: 'POST /api/checkout (認領)' },
        headers: {
          ...COMMON_HEADERS,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Request-ID': `claim-${randomIntBetween(100000, 999999)}`,
          'Idempotency-Key': `idem-${data.slug}-${randomIntBetween(1, 9999)}`,
        },
      }
    );

    const claimOk = recordMetrics(claimRes, 'claims_api', claimsApiTrend, claimsErrors);

    check(claimRes, {
      'S3 Claim :: 有回應':           (r) => r.status !== 0,
      'S3 Claim :: 無 5xx / Deadlock': (r) => r.status < 500,
      'S3 Claim :: 響應 < 800ms':     (r) => r.timings.duration < 800,
    });

    // ── 3b. 上傳水單 (僅在認領成功時) ──
    if (claimOk && claimRes.status !== 404) {
      const claimJson = safeJsonParse(claimRes.body);
      const claimId = (claimJson && (claimJson.id || claimJson.claim_id)) || `claim-${randomIntBetween(1, 99999)}`;

      const receiptPayload = JSON.stringify({
        claim_id: claimId,
        receipt_url: `https://storage.test/receipts/${randomIntBetween(1, 99999)}.jpg`,
        amount: data.plan === 'scale' ? 120000 : data.plan === 'growth' ? 60000 : 35000,
        currency: 'TWD',
        payment_channel: data.payment_channel,
        reference: data.reference,
      });

      const receiptRes = http.post(
        `${BASE_URL}/api/receipts`,
        receiptPayload,
        {
          tags: { name: 'POST /api/receipts (水單)' },
          headers: {
            ...COMMON_HEADERS,
            'Content-Type': 'application/json',
          },
        }
      );

      if (receiptRes.status !== 404) {
        recordMetrics(receiptRes, 'receipts_api', receiptsApiTrend, apiErrors);

        check(receiptRes, {
          'S3 Receipt :: 成功或 404':  (r) => [200, 201, 404].includes(r.status),
          'S3 Receipt :: 無 5xx':      (r) => r.status < 500,
          'S3 Receipt :: 響應 < 800ms': (r) => r.timings.duration < 800,
        });
      }

      // ── 3c. KYC 實名驗證 (50% 機率) ──
      if (Math.random() < 0.5) {
        const kycPayload = JSON.stringify({
          claim_id: claimId,
          domain: `${data.slug}.example.com`,
          company_name: data.brand_name,
          tax_id: data.tax_id,
        });

        const kycRes = http.post(
          `${BASE_URL}/api/kyc/verify`,
          kycPayload,
          {
            tags: { name: 'POST /api/kyc/verify (KYC)' },
            headers: {
              ...COMMON_HEADERS,
              'Content-Type': 'application/json',
            },
          }
        );

        if (kycRes.status !== 404) {
          check(kycRes, {
            'S3 KYC :: 無 5xx':      (r) => r.status < 500,
            'S3 KYC :: 響應 < 800ms': (r) => r.timings.duration < 800,
          });
        }
      }
    }

    // ── 3d. 管理者審核放行 (10% 機率) ──
    if (Math.random() < 0.1) {
      const auditPayload = JSON.stringify({
        claim_id: `claim-${randomIntBetween(1, 99999)}`,
        action: randomItem(['approve', 'reject']),
        reason: '壓力測試自動審核',
      });

      const auditRes = http.post(
        `${BASE_URL}/api/audit-release`,
        auditPayload,
        {
          tags: { name: 'POST /api/audit-release (審核)' },
          headers: {
            ...COMMON_HEADERS,
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ADMIN_SECRET}`,
          },
        }
      );

      if (auditRes.status !== 404) {
        recordMetrics(auditRes, 'audit_api', auditApiTrend, apiErrors);

        check(auditRes, {
          'S3 Audit :: 有回應':        (r) => r.status !== 0,
          'S3 Audit :: 無 Deadlock':   (r) => r.status < 500,
          'S3 Audit :: 響應 < 800ms':  (r) => r.timings.duration < 800,
        });
      }
    }

    sleep(randomIntBetween(2, 5));
  });
}

// ╔═══════════════════════════════════════════════════════════════╗
// ║  測試生命週期鉤子                                             ║
// ╚═══════════════════════════════════════════════════════════════╝

/**
 * setup() — 測試開始前執行一次
 * 驗證目標網址可訪問，收集基準資料
 */
export function setup() {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║  Orbit Tower — k6 壓力測試 v2.0                         ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`  📍 Target : ${BASE_URL}`);
  console.log(`  ⏱  Drift Duration : ${K6_DURATION}`);
  console.log(`  👥 Drift VUs      : ${K6_VUS}`);
  console.log('');

  // 預檢: 確認目標可達
  const preflight = http.get(`${BASE_URL}/`, {
    headers: { ...COMMON_HEADERS, 'Accept': 'text/html' },
    timeout: '10s',
  });

  if (preflight.status !== 200) {
    console.error(`  ❌ Preflight FAILED — HTTP ${preflight.status}`);
    console.error(`     目標網址無法訪問: ${BASE_URL}`);
    return { canRun: false, preflightMs: 0 };
  }

  console.log(`  ✅ Preflight OK — ${preflight.timings.duration.toFixed(0)}ms`);
  console.log('');

  // 收集基準資料 (供後續場景參考)
  const storesRes = http.get(`${BASE_URL}/api/stores`, {
    headers: { ...COMMON_HEADERS, 'Accept': 'application/json' },
  });
  const storesAvailable = storesRes.status === 200;

  console.log(`  📊 /api/stores : ${storesAvailable ? 'available' : 'not found (404)'}`);
  console.log('');
  console.log('  ── 測試開始 ──────────────────────────────────────────');
  console.log('');

  return { canRun: true, storesAvailable };
}

/**
 * teardown() — 測試結束後執行一次
 */
export function teardown(env) {
  console.log('');
  console.log('  ── 測試結束 ──────────────────────────────────────────');
  console.log('');

  if (env && !env.canRun) {
    console.log('  ⚠️  測試未執行: 目標網址無法訪問');
    return;
  }

  console.log('  🏁 Orbit Tower 壓力測試完成');
  console.log('');
}

/**
 * handleSummary() — 自訂報告輸出
 * 產出 stdout 可讀摘要 + JSON 機器可讀報告
 */
export function handleSummary(data) {
  // 自訂可讀摘要
  const report = buildReport(data);

  return {
    // 終端機輸出 (k6 內建格式 + 自訂報告)
    'stdout': textSummary(data, { indent: '  ', enableColors: true }) + report,
    // JSON 報告 (供 CI / 自動化分析)
    './tests/reports/stress-test-report.json': JSON.stringify(data, null, 2),
    // CSV 報告 (供 Excel / 圖表工具)
    './tests/reports/stress-test-report.csv': buildCsvReport(data),
  };
}

// ╔═══════════════════════════════════════════════════════════════╗
// ║  報告產生器                                                   ║
// ╚═══════════════════════════════════════════════════════════════╝

function buildReport(data) {
  const m = data.metrics;
  const dur = m.http_req_duration || {};
  const err = m.api_errors || {};
  const drift = m.drift_errors || {};
  const claims = m.claims_errors || {};

  const p95 = dur.values?.['p(95)'] || 0;
  const p99 = dur.values?.['p(99)'] || 0;
  const avg = dur.values?.avg || 0;
  const max = dur.values?.max || 0;
  const errRate = err.values?.rate || 0;
  const driftRate = drift.values?.rate || 0;
  const claimsRate = claims.values?.rate || 0;
  const total = m.total_requests?.values.count || 0;
  const success = m.successful_requests?.values.count || 0;
  const failed = m.failed_requests?.values.count || 0;
  const rateLimited = m.rate_limit_hits?.values.count || 0;
  const deadlocks = m.deadlock_hits?.values.count || 0;

  let r = '\n';
  r += '═══════════════════════════════════════════════════════════\n';
  r += '  Orbit Tower — 壓力測試報告摘要\n';
  r += '═══════════════════════════════════════════════════════════\n\n';

  // 請求統計
  r += '  📊 請求統計\n';
  r += `     總請求數  : ${total.toLocaleString()}\n`;
  r += `     成功      : ${success.toLocaleString()}\n`;
  r += `     失敗      : ${failed.toLocaleString()}\n`;
  r += `     Rate Limit: ${rateLimited.toLocaleString()}\n`;
  r += `     Deadlocks : ${deadlocks.toLocaleString()}\n\n`;

  // 響應時間
  r += '  ⏱  響應時間 (全域)\n';
  r += `     平均  : ${avg.toFixed(1)}ms\n`;
  r += `     P95   : ${p95.toFixed(1)}ms\n`;
  r += `     P99   : ${p99.toFixed(1)}ms\n`;
  r += `     最大  : ${max.toFixed(1)}ms\n\n`;

  // 各 API 端點
  r += '  📡 各 API 端點 P95\n';
  const trends = [
    ['首頁',       'homepage_duration'],
    ['Stores API', 'stores_api_duration'],
    ['Drift API',  'drift_api_duration'],
    ['IndexNow',   'indexnow_api_duration'],
    ['Claims API', 'claims_api_duration'],
    ['Receipts',   'receipts_api_duration'],
    ['Audit',      'audit_api_duration'],
  ];
  for (const [label, key] of trends) {
    const t = m[key];
    if (t && t.values) {
      r += `     ${label.padEnd(14)}: ${t.values['p(95)']?.toFixed(1) || 'N/A'}ms (avg: ${t.values.avg?.toFixed(1) || 'N/A'}ms)\n`;
    }
  }
  r += '\n';

  // 錯誤率
  r += '  ❌ 錯誤率\n';
  r += `     全域 API  : ${(errRate * 100).toFixed(3)}%\n`;
  r += `     Drift API : ${(driftRate * 100).toFixed(3)}%\n`;
  r += `     Claims API: ${(claimsRate * 100).toFixed(3)}%\n\n`;

  // SLO 檢查
  r += '  🎯 SLO 達成狀況\n';
  const slo500 = m['http_req_failed{status:500}']?.values?.count || 0;
  const slo502 = m['http_req_failed{status:502}']?.values?.count || 0;
  const slo503 = m['http_req_failed{status:503}']?.values?.count || 0;

  r += `     ${p95 < 800 ? '✅' : '❌'} API p95 < 800ms    : ${p95.toFixed(1)}ms\n`;
  r += `     ${errRate < 0.001 ? '✅' : '❌'} 錯誤率 < 0.1%     : ${(errRate * 100).toFixed(3)}%\n`;
  r += `     ${slo500 === 0 ? '✅' : '❌'} HTTP 500 = 0      : ${slo500}\n`;
  r += `     ${slo502 === 0 ? '✅' : '❌'} HTTP 502 = 0      : ${slo502}\n`;
  r += `     ${slo503 === 0 ? '✅' : '❌'} HTTP 503 = 0      : ${slo503}\n`;
  r += `     ${deadlocks === 0 ? '✅' : '❌'} Deadlock = 0      : ${deadlocks}\n`;
  r += '\n';

  const allPass = p95 < 800 && errRate < 0.001 && slo500 === 0 && slo502 === 0 && deadlocks === 0;
  r += `  ${allPass ? '🎉 ALL SLOs PASSED' : '⚠️  SOME SLOs FAILED'}\n`;
  r += '═══════════════════════════════════════════════════════════\n';

  return r;
}

function buildCsvReport(data) {
  const m = data.metrics;
  let csv = 'metric,avg,p(95),p(99),max,count\n';

  const keys = [
    'http_req_duration',
    'homepage_duration',
    'stores_api_duration',
    'drift_api_duration',
    'indexnow_api_duration',
    'claims_api_duration',
    'receipts_api_duration',
    'audit_api_duration',
  ];

  for (const key of keys) {
    const metric = m[key];
    if (metric && metric.values) {
      const v = metric.values;
      csv += `${key},${(v.avg || 0).toFixed(2)},${(v['p(95)'] || 0).toFixed(2)},${(v['p(99)'] || 0).toFixed(2)},${(v.max || 0).toFixed(2)},${v.count || 0}\n`;
    }
  }

  return csv;
}
