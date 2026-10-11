import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },   // 30 秒內爬升至 50 人
    { duration: '1m',  target: 200 },  // 1 分鐘內維持 200 併發高壓
    { duration: '30s', target: 500 },  // 衝擊測試 500 併發 Peak
    { duration: '30s', target: 0 },    // 緩步降溫
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% 要求響應需在 500ms 內
    http_req_failed: ['rate<0.01'],   // 錯誤率需小於 1%
  },
};

export default function () {
  // 1. 壓測 3D 主站首頁
  const res1 = http.get('https://orbit-tower.vercel.app/');
  check(res1, { '主站 Status 200': (r) => r.status === 200 });

  // 2. 壓測 匯率對齊 API
  const res2 = http.get('https://orbit-tower.vercel.app/api/align');
  check(res2, { 'API 響應 200': (r) => r.status === 200 });

  sleep(1);
}
