# Orbit Tower — k6 高併發壓力測試指南 v2.0

## 📋 目錄

- [概述](#概述)
- [前置需求](#前置需求)
- [快速開始](#快速開始)
- [測試場景說明](#測試場景說明)
- [SLO 目標](#slo-目標)
- [本機執行](#本機執行)
- [Docker 執行](#docker-執行)
- [CI/CD 整合](#cicd-整合)
- [報告分析](#報告分析)
- [疑難排解](#疑難排解)

---

## 概述

本壓力測試腳本使用 [k6](https://k6.io/) 模擬高併發場景，驗證 Orbit Tower 在極端負載下的效能與穩定性。

**測試目標：**
- 首頁 + 3D 場景載入效能
- `/api/stores` 樓層資料 API 響應時間
- `/api/drift/generate` 漂流瓶 API 極限處理能力
- `/api/checkout` 認領請求的併發寫入安全性
- Supabase RLS 與 Transaction Locks 的 Deadlock 檢測

---

## 前置需求

### 1. 安裝 k6

**macOS:**
```bash
brew install k6
```

**Linux (Ubuntu/Debian):**
```bash
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C7474E5F5E
echo "deb [signed-by=/usr/share/keyrings/k6-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**Windows:**
```powershell
choco install k6
```

**Docker (免安裝):**
```bash
docker pull grafana/k6
```

### 2. 啟動本地開發伺服器

```bash
npm run dev
# 或
npm run build && npm start
```

確保 `http://localhost:3000` 可正常訪問。

---

## 快速開始

### 冒煙測試 (Smoke Test) — 10 秒快速驗證

```bash
npm run stress:smoke
```

**用途：** 快速驗證腳本語法、API 端點是否可達、基本檢查是否通過。

### 標準負載測試 (Load Test) — 2 分鐘

```bash
npm run stress:load
```

**用途：** 模擬 50 個併發使用者持續 2 分鐘，驗證系統在正常負載下的表現。

### 完整壓力測試 (Stress Test) — 含 3 大場景

```bash
npm run stress
```

**用途：** 執行完整的 3 大測試場景（Spike + Drift + Claims），驗證系統極限。

### 對 Production 執行

```bash
npm run stress:prod
```

**⚠️ 警告：** 這會對 `https://orbit-tower.vercel.app` 發送大量請求，請確保已獲得授權。

---

## 測試場景說明

### 場景 1: 瞬時湧入階段 (Spike Test)

**模擬情境：** 30 秒內湧入 1,000 個虛擬使用者同時造訪網站。

**執行流程：**
1. 5 秒內從 10 req/s 飆升至 100 req/s
2. 10 秒內達到 500 req/s
3. 10 秒內達到 1,000 req/s（峰值）
4. 5 秒維持峰值
5. 5 秒降回 0

**測試端點：**
- `GET /` — 首頁載入（含 HTML + 內聯 JS/CSS）
- `GET /_next/data/` — Next.js 靜態資源
- `GET /api/stores` — 樓層資料 API
- `GET /og-image.svg` — OG 圖片
- `GET /robots.txt` — SEO 檔案

**SLO 目標：**
- 首頁 p95 < 2000ms（含 3D 資源）
- `/api/stores` p95 < 800ms
- HTTP 5xx = 0

**單獨執行：**
```bash
npm run stress:spike
```

---

### 場景 2: 漂流瓶 API 極限測試 (Drift API Stress)

**模擬情境：** 200 個 VUs 同時觸發 Groq API 生成漂流瓶 + IndexNow ping。

**執行流程：**
- 200 VUs 持續 30 秒（可調整）
- 每個 VU 隨機觸發 `throw` / `catch` / `generate` 動作
- 10% 機率觸發 IndexNow ping
- 20% 機率測試快取機制

**測試端點：**
- `POST /api/drift/generate` — 漂流瓶生成
- `POST /api/indexnow/submit` — IndexNow 推送

**重點驗證：**
- Rate Limit 機制是否正常觸發（HTTP 429）
- Redis/Supabase Edge Functions 快取是否生效
- Groq API 在高負載下的響應時間

**SLO 目標：**
- p95 < 1500ms（Groq API 較慢）
- 錯誤率 < 0.1%
- Rate Limit 觸發時回傳 429（非 5xx）

**單獨執行：**
```bash
npm run stress:drift
```

**自訂參數：**
```bash
# 100 VUs 持續 1 分鐘
k6 run --env K6_DURATION=1m --env K6_VUS=100 --scenario drift_api_stress tests/stress-test.js
```

---

### 場景 3: 併發審核與寫入測試 (Concurrent Claims)

**模擬情境：** 50 個品牌主同時提交認領請求 + 水單 + 審核。

**執行流程：**
- 50 VUs，每個執行 10 次迭代（共 500 次認領）
- 每個迭代：
  1. 提交認領請求 (`/api/checkout`)
  2. 上傳水單 (`/api/receipts`)
  3. 50% 機率觸發 KYC 驗證 (`/api/kyc/verify`)
  4. 10% 機率觸發管理者審核 (`/api/audit-release`)

**測試端點：**
- `POST /api/checkout` — 認領請求
- `POST /api/receipts` — 水單上傳
- `POST /api/kyc/verify` — KYC 實名驗證
- `POST /api/audit-release` — 管理者審核

**重點驗證：**
- Supabase PostgreSQL Row-Level Security (RLS) 是否正確
- Transaction Locks 是否發生 Deadlock
- 併發寫入時是否產生資料不一致

**SLO 目標：**
- p95 < 800ms
- Deadlock 次數 = 0
- HTTP 5xx = 0

**單獨執行：**
```bash
npm run stress:claims
```

**設定管理者密鑰：**
```bash
k6 run --env ADMIN_SECRET=your-secret --scenario concurrent_claims tests/stress-test.js
```

---

## SLO 目標

| 指標 | 目標 | 說明 |
|------|------|------|
| API p95 響應時間 | < 800ms | 全域 HTTP 請求 95 分位數 |
| 首頁 p95 | < 2000ms | 含 3D 資源載入 |
| Drift API p95 | < 1500ms | Groq API 較慢，放寬標準 |
| 錯誤率 | < 0.1% | API 錯誤比例 |
| HTTP 500 | = 0 | 伺服器內部錯誤 |
| HTTP 502 | = 0 | Bad Gateway |
| HTTP 503 | = 0 | Service Unavailable |
| Deadlock | = 0 | PostgreSQL 死鎖 |

**閾值設定位置：** `tests/stress-test.js` 第 112-148 行

---

## 本機執行

### 基本指令

```bash
# 冒煙測試
npm run stress:smoke

# 標準負載
npm run stress:load

# 完整壓力測試
npm run stress

# 對 Production
npm run stress:prod
```

### 單獨場景

```bash
# Spike Test
npm run stress:spike

# Drift API
npm run stress:drift

# Concurrent Claims
npm run stress:claims
```

### 自訂參數

```bash
# 指定目標網址
k6 run --env BASE_URL=https://your-site.com tests/stress-test.js

# 調整漂流瓶場景
k6 run --env K6_DURATION=2m --env K6_VUS=300 tests/stress-test.js

# 設定管理者密鑰
k6 run --env ADMIN_SECRET=your-secret tests/stress-test.js
```

### 產出報告

```bash
# JSON 報告
npm run stress:report

# 查看報告
cat tests/reports/result.json | jq .
```

---

## Docker 執行

如果不想安裝 k6，可以使用 Docker：

```bash
# 基本執行
npm run stress:docker

# 指定目標網址
docker run --rm -i grafana/k6 run \
  --env BASE_URL=https://orbit-tower.vercel.app \
  - < tests/stress-test.js

# 掛載報告目錄
docker run --rm -i \
  -v $(pwd)/tests/reports:/tests/reports \
  grafana/k6 run \
  --out json=/tests/reports/result.json \
  - < tests/stress-test.js
```

---

## CI/CD 整合

### GitHub Actions

本專案已設定 GitHub Actions 工作流 `.github/workflows/k6-stress-test.yml`。

**觸發條件：**
- 手動觸發（可選擇測試模式）
- 每週一凌晨 2 點 UTC 排程執行
- Push 到 `master` 時自動執行冒煙測試

**手動觸發：**
1. 前往 GitHub Actions → k6 Stress Test
2. 點擊 "Run workflow"
3. 選擇測試模式（smoke/load/stress/spike/drift/claims）
4. 輸入目標網址（預設為 Production）

**設定 Secrets：**
- `ADMIN_SECRET` — 管理者密鑰（用於場景 3 的審核 API）

**查看報告：**
- 每次執行會產出 Artifact（保留 30 天）
- 包含 JSON + CSV 報告

---

## 報告分析

### 終端機輸出

執行完畢後會顯示：

```
═══════════════════════════════════════════════════════════
  Orbit Tower — 壓力測試報告摘要
═══════════════════════════════════════════════════════════

  📊 請求統計
     總請求數  : 12,345
     成功      : 12,340
     失敗      : 5
     Rate Limit: 120
     Deadlocks : 0

  ⏱  響應時間 (全域)
     平均  : 245.3ms
     P95   : 678.2ms
     P99   : 1,234.5ms
     最大  : 3,456.7ms

  📡 各 API 端點 P95
     首頁          : 1,234.5ms (avg: 890.1ms)
     Stores API    : 456.7ms (avg: 312.4ms)
     Drift API     : 1,234.5ms (avg: 987.6ms)
     ...

  🎯 SLO 達成狀況
     ✅ API p95 < 800ms    : 678.2ms
     ✅ 錯誤率 < 0.1%     : 0.040%
     ✅ HTTP 500 = 0      : 0
     ✅ HTTP 502 = 0      : 0
     ✅ Deadlock = 0      : 0

  🎉 ALL SLOs PASSED
═══════════════════════════════════════════════════════════
```

### JSON 報告

```bash
# 查看完整報告
cat tests/reports/stress-test-report.json | jq .

# 提取關鍵指標
cat tests/reports/stress-test-report.json | jq '{
  p95: .metrics.http_req_duration.values["p(95)"],
  error_rate: .metrics.api_errors.values.rate,
  total_requests: .metrics.total_requests.values.count
}'
```

### CSV 報告

```bash
# 用 Excel 開啟
open tests/reports/stress-test-report.csv

# 或用 pandas 分析
python3 -c "import pandas as pd; df = pd.read_csv('tests/reports/stress-test-report.csv'); print(df)"
```

---

## 疑難排解

### 問題 1: k6 找不到指令

**解決：**
```bash
# macOS
brew install k6

# Linux
sudo apt-get install k6

# 驗證安裝
k6 version
```

### 問題 2: 無法連接 localhost:3000

**解決：**
```bash
# 確認開發伺服器已啟動
npm run dev

# 檢查 port 3000 是否被佔用
lsof -i :3000

# 或使用其他 port
npm run dev -- -p 3001
k6 run --env BASE_URL=http://localhost:3001 tests/stress-test.js
```

### 問題 3: 測試失敗 — HTTP 5xx 錯誤

**可能原因：**
- 資料庫連線失敗
- API 端點不存在
- 環境變數未設定

**解決：**
```bash
# 檢查 .env.local
cat .env.local

# 確認 Supabase 連線
npm run dev
curl http://localhost:3000/api/stores
```

### 問題 4: Deadlock 檢測失敗

**可能原因：**
- Supabase RLS 設定不正確
- 併發寫入時未使用 Transaction

**解決：**
1. 檢查 Supabase Dashboard → Authentication → Policies
2. 確認 `stores` 表的 RLS 規則
3. 在 API Route 中使用 `supabase.from('stores').upsert()` 而非 `insert()`

### 問題 5: 報告目錄不存在

**解決：**
```bash
mkdir -p tests/reports
```

---

## 進階設定

### 自訂測試資料

編輯 `tests/stress-test.js` 第 68-82 行：

```javascript
const TEST_BRANDS = [
  { name: 'Your Brand', slug: 'your-brand', category: '科技新創', email: 'test@yourbrand.com' },
  // ...
];
```

### 調整 SLO 閾值

編輯 `tests/stress-test.js` 第 112-148 行：

```javascript
thresholds: {
  'http_req_duration': ['p(95)<1000'],  // 放寬到 1000ms
  'api_errors': ['rate<0.01'],          // 放寬到 1%
  // ...
}
```

### 新增測試場景

參考 k6 文件：[Scenarios](https://k6.io/docs/using-k6/scenarios/)

---

## 參考資源

- [k6 官方文件](https://k6.io/docs/)
- [k6 測試類型](https://k6.io/docs/test-types/)
- [k6 Thresholds](https://k6.io/docs/using-k6/thresholds/)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)

---

## 貢獻

如有問題或建議，請提交 Issue 或 Pull Request。

---

**最後更新：** 2026-10-06  
**維護者：** SNT Nexus Team  
**版本：** v2.0.0
