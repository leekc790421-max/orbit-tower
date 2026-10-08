/**
 * Orbit Tower — 安全與邊界例外測試腳本
 * 
 * 測試項目：
 * 1. 多重認領衝突 (Race Condition)
 * 2. 惡意爬蟲與 API 濫用 (Rate Limiting)
 * 3. 無效水單與假圖片上傳 (File Validation)
 * 
 * 執行方式：
 * npm run test:security
 * k6 run tests/security-test.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Counter } from 'k6/metrics';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

// 自訂指標
const raceConditionDetected = new Counter('race_condition_detected');
const rateLimitTriggered = new Counter('rate_limit_triggered');
const fileValidationBlocked = new Counter('file_validation_blocked');
const securityErrors = new Rate('security_errors');

// 環境變數
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// 測試配置
export const options = {
  scenarios: {
    // 場景 1: Race Condition 測試
    race_condition: {
      executor: 'per-vu-iterations',
      vus: 10,           // 10 個虛擬使用者
      iterations: 5,     // 每個 VU 執行 5 次
      maxDuration: '1m',
      exec: 'raceConditionTest',
      startTime: '0s',
    },
    
    // 場景 2: Rate Limiting 測試
    rate_limiting: {
      executor: 'constant-arrival-rate',
      rate: 50,          // 每秒 50 個請求
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 50,
      maxVUs: 100,
      exec: 'rateLimitTest',
      startTime: '1m 10s',
    },
    
    // 場景 3: 檔案驗證測試
    file_validation: {
      executor: 'per-vu-iterations',
      vus: 5,
      iterations: 10,
      maxDuration: '1m',
      exec: 'fileValidationTest',
      startTime: '1m 50s',
    },
  },
  
  thresholds: {
    // Race Condition: 應該檢測到衝突
    'race_condition_detected': ['count>0'],
    
    // Rate Limit: 應該觸發 429
    'rate_limit_triggered': ['count>0'],
    
    // File Validation: 應該阻擋惡意檔案
    'file_validation_blocked': ['count>0'],
    
    // 安全錯誤率應該為 0 (除了預期的 429/400)
    'security_errors': ['rate<0.01'],
  },
};

// ============================================================================
// 場景 1: Race Condition 測試
// 模擬多個使用者同時認領同一個店面
// ============================================================================

export function raceConditionTest() {
  group('S1 :: Race Condition — 多重認領衝突', () => {
    const storeId = 'test-store-race-condition'; // 所有 VU 嘗試認領同一個店面
    
    const payload = JSON.stringify({
      store_id: storeId,
      brand_name: `Test Brand ${randomIntBetween(1, 1000)}`,
      slug: `test-brand-${randomIntBetween(1, 1000)}`,
      email: `test${randomIntBetween(1, 1000)}@example.com`,
      plan: 'landing',
      payment_channel: 'rakuten',
    });
    
    const res = http.post(`${BASE_URL}/api/checkout`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': `race-${randomIntBetween(100000, 999999)}`,
      },
    });
    
    // 檢查回應
    const isConflict = res.status === 409; // Conflict
    const isSuccess = res.status === 201;  // Created
    
    check(res, {
      'S1 Race :: 有回應': (r) => r.status !== 0,
      'S1 Race :: 成功或衝突': (r) => isSuccess || isConflict,
      'S1 Race :: 無 5xx 錯誤': (r) => r.status < 500,
    });
    
    // 如果檢測到衝突，記錄
    if (isConflict) {
      raceConditionDetected.add(1);
      
      // 驗證錯誤訊息
      const body = res.json();
      check(body, {
        'S1 Race :: 衝突訊息正確': (b) => {
          return b.error === '認領衝突' || b.message?.includes('已被');
        },
      });
    }
    
    // 如果成功，也記錄 (第一個認領的)
    if (isSuccess) {
      check(res, {
        'S1 Race :: 成功回應有 claim_id': (r) => {
          const body = r.json();
          return body.data?.claim_id !== undefined;
        },
      });
    }
    
    sleep(0.1); // 短暫延遲，增加衝突機率
  });
}

// ============================================================================
// 場景 2: Rate Limiting 測試
// 模擬惡意爬蟲快速請求 API
// ============================================================================

export function rateLimitTest() {
  group('S2 :: Rate Limiting — API 濫用防護', () => {
    
    // 2a. 漂流瓶 API 濫用
    const driftPayload = JSON.stringify({
      action: 'generate',
      user_id: `stress-user-${randomIntBetween(1, 100)}`,
      message: `測試訊息 #${randomIntBetween(1, 10000)}`,
    });
    
    const driftRes = http.post(`${BASE_URL}/api/drift/generate`, driftPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    check(driftRes, {
      'S2 Drift :: 有回應': (r) => r.status !== 0,
      'S2 Drift :: 無 5xx 錯誤': (r) => r.status < 500,
    });
    
    // 檢測 Rate Limit (429)
    if (driftRes.status === 429) {
      rateLimitTriggered.add(1);
      
      // 驗證 Rate Limit Headers
      check(driftRes, {
        'S2 Drift :: 429 有 Retry-After': (r) => {
          const headers = r.headers || {};
          return headers['Retry-After'] !== undefined;
        },
        'S2 Drift :: 429 有 X-RateLimit-Limit': (r) => {
          const headers = r.headers || {};
          return headers['X-RateLimit-Limit'] !== undefined;
        },
      });
      
      // 驗證錯誤訊息
      const body = driftRes.json();
      check(body, {
        'S2 Drift :: 429 有錯誤訊息': (b) => {
          return b.error !== undefined && b.error.length > 0;
        },
      });
    }
    
    // 2b. 認領 API 濫用
    const checkoutPayload = JSON.stringify({
      store_id: `store-${randomIntBetween(1, 1000)}`,
      brand_name: `Brand ${randomIntBetween(1, 1000)}`,
      slug: `brand-${randomIntBetween(1, 1000)}`,
      email: `test${randomIntBetween(1, 1000)}@example.com`,
      plan: 'landing',
      payment_channel: 'rakuten',
    });
    
    const checkoutRes = http.post(`${BASE_URL}/api/checkout`, checkoutPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    check(checkoutRes, {
      'S2 Checkout :: 有回應': (r) => r.status !== 0,
      'S2 Checkout :: 無 5xx 錯誤': (r) => r.status < 500,
    });
    
    if (checkoutRes.status === 429) {
      rateLimitTriggered.add(1);
    }
    
    // 2c. 水單上傳 API 濫用
    const receiptRes = http.post(`${BASE_URL}/api/receipts`, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    check(receiptRes, {
      'S2 Receipts :: 有回應': (r) => r.status !== 0,
      'S2 Receipts :: 無 5xx 錯誤': (r) => r.status < 500,
    });
    
    if (receiptRes.status === 429) {
      rateLimitTriggered.add(1);
    }
    
    sleep(0.05); // 極短延遲，模擬快速請求
  });
}

// ============================================================================
// 場景 3: 檔案驗證測試
// 測試上傳惡意檔案、超大檔案、無效類型
// ============================================================================

export function fileValidationTest() {
  group('S3 :: File Validation — 水單上傳防護', () => {
    
    // 3a. 測試超大檔案 (50MB)
    const largeFileContent = 'x'.repeat(50 * 1024 * 1024); // 50MB
    const largeFile = new File([largeFileContent], 'large.jpg', { type: 'image/jpeg' });
    
    const largeRes = http.post(
      `${BASE_URL}/api/receipts`,
      {
        file: http.file(largeFile),
        claim_id: 'test-claim-1',
        payment_channel: 'rakuten',
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    check(largeRes, {
      'S3 Large :: 有回應': (r) => r.status !== 0,
      'S3 Large :: 拒絕超大檔案': (r) => r.status === 413 || r.status === 400,
      'S3 Large :: 無 5xx 錯誤': (r) => r.status < 500,
    });
    
    if (largeRes.status === 413 || largeRes.status === 400) {
      fileValidationBlocked.add(1);
      
      const body = largeRes.json();
      check(body, {
        'S3 Large :: 有錯誤訊息': (b) => {
          return b.error !== undefined;
        },
      });
    }
    
    sleep(0.5);
    
    // 3b. 測試無效檔案類型 (PDF)
    const pdfContent = '%PDF-1.4\n%fake pdf content';
    const pdfFile = new File([pdfContent], 'document.pdf', { type: 'application/pdf' });
    
    const pdfRes = http.post(
      `${BASE_URL}/api/receipts`,
      {
        file: http.file(pdfFile),
        claim_id: 'test-claim-2',
        payment_channel: 'rakuten',
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    check(pdfRes, {
      'S3 PDF :: 有回應': (r) => r.status !== 0,
      'S3 PDF :: 拒絕 PDF': (r) => r.status === 415 || r.status === 400,
      'S3 PDF :: 無 5xx 錯誤': (r) => r.status < 500,
    });
    
    if (pdfRes.status === 415 || pdfRes.status === 400) {
      fileValidationBlocked.add(1);
    }
    
    sleep(0.5);
    
    // 3c. 測試偽裝副檔名 (實際是文字檔，但副檔名是 .jpg)
    const fakeJpgContent = 'This is not an image, just plain text';
    const fakeJpgFile = new File([fakeJpgContent], 'fake.jpg', { type: 'image/jpeg' });
    
    const fakeRes = http.post(
      `${BASE_URL}/api/receipts`,
      {
        file: http.file(fakeJpgFile),
        claim_id: 'test-claim-3',
        payment_channel: 'rakuten',
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    check(fakeRes, {
      'S3 Fake :: 有回應': (r) => r.status !== 0,
      'S3 Fake :: 拒絕偽裝檔案': (r) => r.status === 400,
      'S3 Fake :: 無 5xx 錯誤': (r) => r.status < 500,
    });
    
    if (fakeRes.status === 400) {
      fileValidationBlocked.add(1);
      
      const body = fakeRes.json();
      check(body, {
        'S3 Fake :: 錯誤訊息提到驗證失敗': (b) => {
          return b.error?.includes('驗證') || b.message?.includes('不符');
        },
      });
    }
    
    sleep(0.5);
    
    // 3d. 測試空檔案
    const emptyFile = new File([], 'empty.jpg', { type: 'image/jpeg' });
    
    const emptyRes = http.post(
      `${BASE_URL}/api/receipts`,
      {
        file: http.file(emptyFile),
        claim_id: 'test-claim-4',
        payment_channel: 'rakuten',
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    check(emptyRes, {
      'S3 Empty :: 有回應': (r) => r.status !== 0,
      'S3 Empty :: 拒絕空檔案': (r) => r.status === 400,
      'S3 Empty :: 無 5xx 錯誤': (r) => r.status < 500,
    });
    
    if (emptyRes.status === 400) {
      fileValidationBlocked.add(1);
    }
    
    sleep(0.5);
    
    // 3e. 測試缺少必要欄位
    const missingRes = http.post(
      `${BASE_URL}/api/receipts`,
      {
        // 缺少 file, claim_id, payment_channel
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    check(missingRes, {
      'S3 Missing :: 有回應': (r) => r.status !== 0,
      'S3 Missing :: 拒絕缺少欄位': (r) => r.status === 400,
      'S3 Missing :: 無 5xx 錯誤': (r) => r.status < 500,
    });
    
    if (missingRes.status === 400) {
      fileValidationBlocked.add(1);
    }
  });
}

// ============================================================================
// 測試生命週期
// ============================================================================

export function setup() {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║  Orbit Tower — 安全與邊界例外測試                        ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`  📍 Target: ${BASE_URL}`);
  console.log('');
  console.log('  測試項目：');
  console.log('  1. Race Condition — 多重認領衝突');
  console.log('  2. Rate Limiting — API 濫用防護');
  console.log('  3. File Validation — 水單上傳防護');
  console.log('');
  
  // 預檢
  const preflight = http.get(`${BASE_URL}/`);
  if (preflight.status !== 200) {
    console.error(`  ❌ Preflight FAILED — HTTP ${preflight.status}`);
    return { canRun: false };
  }
  
  console.log('  ✅ Preflight OK');
  console.log('');
  
  return { canRun: true };
}

export function teardown(data) {
  console.log('');
  console.log('  ── 測試結束 ──────────────────────────────────────────');
  console.log('');
  
  if (data && !data.canRun) {
    console.log('  ⚠️  測試未執行');
    return;
  }
  
  console.log('  🏁 安全測試完成');
  console.log('');
}

export function handleSummary(data) {
  const m = data.metrics;
  
  let report = '\n';
  report += '═══════════════════════════════════════════════════════════\n';
  report += '  Orbit Tower — 安全測試報告摘要\n';
  report += '═══════════════════════════════════════════════════════════\n\n';
  
  report += '  🛡️  安全防護檢測\n';
  report += `     Race Condition 檢測  : ${m.race_condition_detected?.values.count || 0} 次\n`;
  report += `     Rate Limit 觸發      : ${m.rate_limit_triggered?.values.count || 0} 次\n`;
  report += `     File Validation 阻擋 : ${m.file_validation_blocked?.values.count || 0} 次\n\n`;
  
  const raceOk = (m.race_condition_detected?.values.count || 0) > 0;
  const rateOk = (m.rate_limit_triggered?.values.count || 0) > 0;
  const fileOk = (m.file_validation_blocked?.values.count || 0) > 0;
  
  report += '  🎯 安全防護狀態\n';
  report += `     ${raceOk ? '✅' : '❌'} Race Condition 防護  : ${raceOk ? '正常' : '異常'}\n`;
  report += `     ${rateOk ? '✅' : '❌'} Rate Limiting 防護   : ${rateOk ? '正常' : '異常'}\n`;
  report += `     ${fileOk ? '✅' : '❌'} File Validation 防護 : ${fileOk ? '正常' : '異常'}\n\n`;
  
  const allPass = raceOk && rateOk && fileOk;
  report += `  ${allPass ? '🎉 ALL SECURITY CHECKS PASSED' : '⚠️  SOME SECURITY CHECKS FAILED'}\n`;
  report += '═══════════════════════════════════════════════════════════\n';
  
  return {
    'stdout': report,
    './tests/reports/security-test-report.json': JSON.stringify(data, null, 2),
  };
}
