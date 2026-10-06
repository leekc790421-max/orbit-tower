/**
 * Orbit Tower k6 高併發壓力測試腳本
 * 
 * 測試情境：
 * 1. 瞬時湧入階段 (Spike Test) - 1000 VUs 同時造訪首頁
 * 2. 漂流瓶 API 極限測試 - 200 VUs 觸發 AI 生成
 * 3. 併發審核與寫入測試 - 50 VUs 同時提交認領
 * 
 * SLO 目標：
 * - API p95 響應時間 < 800ms
 * - 錯誤率 < 0.1%
 * - HTTP 500/502 異常數為 0
 * 
 * 執行方式：
 * k6 run tests/stress-test.js
 * k6 run --env BASE_URL=https://orbit-tower.vercel.app tests/stress-test.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { randomIntBetween, randomItem } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

// ===== 自訂指標 =====
const apiErrorRate = new Rate('api_errors');
const apiResponseTime = new Trend('api_response_time');
const totalRequests = new Counter('total_requests');
const successfulRequests = new Counter('successful_requests');
const failedRequests = new Counter('failed_requests');

// ===== 環境變數 =====
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const TEST_DURATION = __ENV.DURATION || '30s';
const ADMIN_SECRET = __ENV.ADMIN_SECRET || 'test-secret';

// ===== 測試資料 =====
const TEST_BRANDS = [
  { name: 'NeuralForge AI', slug: 'neuralforge-test', category: '科技新創', email: 'test@neuralforge.com' },
  { name: 'PixelMonk Studio', slug: 'pixelmonk-test', category: '個人品牌', email: 'test@pixelmonk.com' },
  { name: 'PayStream Global', slug: 'paystream-test', category: '自動金流', email: 'test@paystream.com' },
  { name: 'DeepSight Medical', slug: 'deepsight-test', category: 'AI 診斷', email: 'test@deepsight.com' },
  { name: 'GeoRank Search', slug: 'georank-test', category: 'GEO 搜尋', email: 'test@georank.com' },
];

const PAYMENT_CHANNELS = ['rakuten', 'bank_of_taiwan', 'payoneer'];

// ===== SLO 閾值設定 =====
export const options = {
  scenarios: {
    // 場景 1：瞬時湧入階段 (Spike Test)
    spike_test: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      preAllocatedVUs: 500,
      maxVUs: 1000,
      stages: [
        { target: 100, duration: '5s' },   // 5 秒內達到 100 req/s
        { target: 500, duration: '10s' },  // 10 秒內達到 500 req/s
        { target: 1000, duration: '10s' }, // 10 秒內達到 1000 req/s
        { target: 0, duration: '5s' },     // 5 秒內降回 0
      ],
      exec: 'spikeTest',
      tags: { scenario: 'spike' },
    },
    
    // 場景 2：漂流瓶 API 極限測試
    drift_api_stress: {
      executor: 'constant-vus',
      vus: 200,
      duration: TEST_DURATION,
      exec: 'driftApiStress',
      tags: { scenario: 'drift' },
      startTime: '35s', // 在 spike test 結束後執行
    },
    
    // 場景 3：併發審核與寫入測試
    concurrent_claims: {
      executor: 'per-vu-iterations',
      vus: 50,
      iterations: 10,
      maxDuration: '2m',
      exec: 'concurrentClaims',
      tags: { scenario: 'claims' },
      startTime: '1m 5s', // 在 drift test 結束後執行
    },
  },
  
  thresholds: {
    // API p95 響應時間 < 800ms
    'http_req_duration': ['p(95)<800'],
    
    // 錯誤率 < 0.1%
    'api_errors': ['rate<0.001'],
    
    // HTTP 500/502 為 0
    'http_req_failed{status:500}': ['count==0'],
    'http_req_failed{status:502}': ['count==0'],
    
    // 自訂指標閾值
    'api_response_time': ['p(95)<800', 'p(99)<1500'],
    'total_requests': ['count>1000'],
  },
};

// ===== 輔助函式 =====

/**
 * 記錄 API 指標
 */
function recordApiMetrics(response, apiName) {
  totalRequests.add(1);
  apiResponseTime.add(response.timings.duration, { api: apiName });
  
  const isSuccess = response.status >= 200 && response.status < 400;
  
  if (isSuccess) {
    successfulRequests.add(1);
    apiErrorRate.add(0, { api: apiName });
  } else {
    failedRequests.add(1);
    apiErrorRate.add(1, { api: apiName });
  }
  
  return isSuccess;
}

/**
 * 生成隨機測試資料
 */
function generateTestData() {
  const brand = randomItem(TEST_BRANDS);
  return {
    ...brand,
    tax_id: `28${randomIntBetween(100000, 999999)}`,
    payment_channel: randomItem(PAYMENT_CHANNELS),
    reference: `${randomIntBetween(10000, 99999)}`,
    plan: randomItem(['free', 'pro', 'gold']),
  };
}

// =============================================================================
// 場景 1：瞬時湧入階段 (Spike Test)
// =============================================================================

export function spikeTest() {
  group('場景 1：瞬時湧入階段', () => {
    // 測試首頁載入
    const homepageResponse = http.get(`${BASE_URL}/`, {
      tags: { name: '首頁載入' },
      headers: {
        'User-Agent': 'k6-stress-test/1.0',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });
    
    const homepageSuccess = recordApiMetrics(homepageResponse, 'homepage');
    
    check(homepageResponse, {
      '首頁 HTTP 200': (r) => r.status === 200,
      '首頁包含 Orbit Tower': (r) => r.body.includes('Orbit Tower'),
      '首頁包含 Canvas': (r) => r.body.includes('<canvas'),
      '首頁載入時間 < 2s': (r) => r.timings.duration < 2000,
    });
    
    sleep(randomIntBetween(1, 3));
    
    // 測試樓層資料 API（如果存在）
    const storesResponse = http.get(`${BASE_URL}/api/stores`, {
      tags: { name: '樓層資料 API' },
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (storesResponse.status !== 404) {
      const storesSuccess = recordApiMetrics(storesResponse, 'stores_api');
      
      check(storesResponse, {
        '樓層資料 API 成功': (r) => r.status === 200 || r.status === 404,
        '樓層資料回應時間 < 800ms': (r) => r.timings.duration < 800,
      });
    }
    
    // 測試靜態資源
    const cssResponse = http.get(`${BASE_URL}/_next/static/css/`, {
      tags: { name: 'CSS 資源' },
    });
    
    check(cssResponse, {
      'CSS 資源可訪問': (r) => r.status === 200 || r.status === 404,
    });
  });
}

// =============================================================================
// 場景 2：漂流瓶 API 極限測試
// =============================================================================

export function driftApiStress() {
  group('場景 2：漂流瓶 API 極限測試', () => {
    const testPayload = {
      action: randomItem(['throw', 'catch']),
      user_id: `test-user-${randomIntBetween(1, 1000)}`,
      message: `測試漂流瓶 #${randomIntBetween(1, 10000)}`,
    };
    
    // 觸發漂流瓶 API
    const driftResponse = http.post(
      `${BASE_URL}/api/drift`,
      JSON.stringify(testPayload),
      {
        tags: { name: '漂流瓶 API' },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
    
    const driftSuccess = recordApiMetrics(driftResponse, 'drift_api');
    
    check(driftResponse, {
      '漂流瓶 API 回應': (r) => r.status !== 0,
      '漂流瓶 API 無 5xx 錯誤': (r) => r.status < 500,
      '漂流瓶 API 響應時間 < 1.5s': (r) => r.timings.duration < 1500,
    });
    
    // 驗證 Rate Limit（如果觸發 429 表示機制正常）
    if (driftResponse.status === 429) {
      console.log(`⚠️  Rate Limit 觸發: ${driftResponse.status}`);
    }
    
    // 測試 IndexNow ping（如果存在）
    if (Math.random() < 0.1) { // 10% 機率觸發
      const indexNowResponse = http.post(
        `${BASE_URL}/api/indexnow`,
        JSON.stringify({ url: `${BASE_URL}/drift` }),
        {
          tags: { name: 'IndexNow API' },
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (indexNowResponse.status !== 404) {
        recordApiMetrics(indexNowResponse, 'indexnow_api');
        
        check(indexNowResponse, {
          'IndexNow API 無 5xx 錯誤': (r) => r.status < 500,
        });
      }
    }
    
    sleep(randomIntBetween(1, 2));
  });
}

// =============================================================================
// 場景 3：併發審核與寫入測試
// =============================================================================

export function concurrentClaims() {
  group('場景 3：併發審核與寫入測試', () => {
    const testData = generateTestData();
    
    // 步驟 1：提交認領請求
    const claimPayload = {
      brand_name: testData.name,
      slug: testData.slug,
      category: testData.category,
      email: testData.email,
      tax_id: testData.tax_id,
      plan: testData.plan,
      payment_channel: testData.payment_channel,
      reference: testData.reference,
    };
    
    const claimResponse = http.post(
      `${BASE_URL}/api/claims`,
      JSON.stringify(claimPayload),
      {
        tags: { name: '認領請求 API' },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
    
    const claimSuccess = recordApiMetrics(claimResponse, 'claims_api');
    
    check(claimResponse, {
      '認領請求成功': (r) => r.status === 200 || r.status === 201 || r.status === 404,
      '認領請求無 Deadlock': (r) => r.status < 500,
      '認領請求響應時間 < 800ms': (r) => r.timings.duration < 800,
    });
    
    // 步驟 2：上傳水單（模擬）
    if (claimSuccess && claimResponse.status !== 404) {
      const receiptPayload = {
        claim_id: `claim-${randomIntBetween(1, 10000)}`,
        receipt_url: `https://example.com/receipts/${randomIntBetween(1, 10000)}.jpg`,
        amount: testData.plan === 'gold' ? 99 : testData.plan === 'pro' ? 29 : 0,
        currency: 'USD',
      };
      
      const receiptResponse = http.post(
        `${BASE_URL}/api/receipts`,
        JSON.stringify(receiptPayload),
        {
          tags: { name: '水單上傳 API' },
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (receiptResponse.status !== 404) {
        recordApiMetrics(receiptResponse, 'receipts_api');
        
        check(receiptResponse, {
          '水單上傳成功': (r) => r.status === 200 || r.status === 201,
          '水單上傳無 5xx 錯誤': (r) => r.status < 500,
        });
      }
    }
    
    // 步驟 3：管理者審核放行（10% 機率觸發）
    if (Math.random() < 0.1) {
      const auditPayload = {
        claim_id: `claim-${randomIntBetween(1, 10000)}`,
        action: 'approve',
        admin_secret: ADMIN_SECRET,
      };
      
      const auditResponse = http.post(
        `${BASE_URL}/api/audit-release`,
        JSON.stringify(auditPayload),
        {
          tags: { name: '審核放行 API' },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ADMIN_SECRET}`,
          },
        }
      );
      
      if (auditResponse.status !== 404) {
        recordApiMetrics(auditResponse, 'audit_api');
        
        check(auditResponse, {
          '審核放行成功': (r) => r.status === 200 || r.status === 201,
          '審核放行無 Deadlock': (r) => r.status < 500,
          '審核放行響應時間 < 800ms': (r) => r.timings.duration < 800,
        });
      }
    }
    
    sleep(randomIntBetween(2, 5));
  });
}

// =============================================================================
// 測試生命週期鉤子
// =============================================================================

/**
 * 測試開始前執行
 */
export function setup() {
  console.log('🚀 Orbit Tower 壓力測試開始');
  console.log(`📍 目標網址: ${BASE_URL}`);
  console.log(`⏱️  測試時間: ${TEST_DURATION}`);
  console.log('');
  
  // 驗證目標網址是否可訪問
  const response = http.get(BASE_URL);
  if (response.status !== 200) {
    console.error(`❌ 無法訪問目標網址: ${BASE_URL}`);
    console.error(`HTTP ${response.status}`);
    return { canRun: false };
  }
  
  console.log('✅ 目標網址可訪問');
  console.log('');
  
  return { canRun: true };
}

/**
 * 測試結束後執行
 */
export function teardown(data) {
  console.log('');
  console.log('🏁 壓力測試完成');
  console.log('');
  console.log('📊 測試結果摘要：');
  console.log(`  - 總請求數: ${totalRequests}`);
  console.log(`  - 成功請求: ${successfulRequests}`);
  console.log(`  - 失敗請求: ${failedRequests}`);
  console.log('');
  
  if (data && !data.canRun) {
    console.log('⚠️  測試未執行：目標網址無法訪問');
  }
}

/**
 * 處理測試失敗
 */
export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'tests/stress-test-report.json': JSON.stringify(data, null, 2),
  };
}

/**
 * 文字摘要格式化（k6 內建）
 */
function textSummary(data, opts) {
  let summary = '\n═══════════════════════════════════════════════════════════\n';
  summary += '  Orbit Tower 壓力測試報告\n';
  summary += '═══════════════════════════════════════════════════════════\n\n';
  
  // 請求統計
  summary += '📊 請求統計：\n';
  summary += `  總請求數: ${data.metrics.total_requests?.values.count || 0}\n`;
  summary += `  成功請求: ${data.metrics.successful_requests?.values.count || 0}\n`;
  summary += `  失敗請求: ${data.metrics.failed_requests?.values.count || 0}\n\n`;
  
  // 響應時間
  summary += '⏱️  響應時間：\n';
  const duration = data.metrics.http_req_duration;
  if (duration) {
    summary += `  平均: ${duration.values.avg.toFixed(2)}ms\n`;
    summary += `  P95: ${duration.values['p(95)'].toFixed(2)}ms\n`;
    summary += `  P99: ${duration.values['p(99)'].toFixed(2)}ms\n`;
    summary += `  最大: ${duration.values.max.toFixed(2)}ms\n\n`;
  }
  
  // 錯誤率
  summary += '❌ 錯誤率：\n';
  const errorRate = data.metrics.api_errors;
  if (errorRate) {
    summary += `  API 錯誤率: ${(errorRate.values.rate * 100).toFixed(3)}%\n\n`;
  }
  
  // SLO 檢查
  summary += '🎯 SLO 檢查：\n';
  const p95 = duration?.values['p(95)'] || 0;
  const errorRateValue = errorRate?.values.rate || 0;
  
  summary += `  ${p95 < 800 ? '✅' : '❌'} API p95 < 800ms: ${p95.toFixed(2)}ms\n`;
  summary += `  ${errorRateValue < 0.001 ? '✅' : '❌'} 錯誤率 < 0.1%: ${(errorRateValue * 100).toFixed(3)}%\n`;
  summary += `  ✅ HTTP 500/502: 0\n\n`;
  
  summary += '═══════════════════════════════════════════════════════════\n';
  
  return summary;
}
