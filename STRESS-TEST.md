# Orbit Tower k6 高併發壓力測試

## 📋 測試腳本說明

本壓力測試腳本使用 k6 模擬真實高負載場景，驗證 Orbit Tower 在極端條件下的穩定性與效能表現。

### 測試情境

#### 場景 1：瞬時湧入階段 (Spike Test)
- **目標**：模擬短時間內大量用戶湧入
- **設定**：30 秒內湧入 1,000 個虛擬使用者 (VUs)
- **測試項目**：
  - 首頁載入效能
  - 3D 樓層資料 API (`/api/stores`)
  - 靜態資源存取

#### 場景 2：漂流瓶 API 極限測試
- **目標**：驗證 AI 生成服務在高負載下的表現
- **設定**：200 個 VUs 同時觸發 `/api/drift`
- **測試項目**：
  - Groq API 生成漂流瓶
  - IndexNow ping 操作
  - Rate Limit 機制
  - 快取機制 (Redis/Supabase Edge Functions)

#### 場景 3：併發審核與寫入測試
- **目標**：驗證資料庫在高併發寫入下的穩定性
- **設定**：50 個品牌主同時提交認領請求
- **測試項目**：
  - Supabase PostgreSQL Row-Level Security (RLS)
  - 事務鎖 (Transaction Locks)
  - Deadlock 檢測
  - 水單上傳與審核放行

---

## 🎯 目標效能指標 (SLOs)

| 指標 | 目標值 | 說明 |
|------|--------|------|
| **API p95 響應時間** | < 800ms | 95% 的請求必須在 800ms 內完成 |
| **錯誤率** | < 0.1% | API 錯誤率必須低於 0.1% |
| **HTTP 500/502** | = 0 | 伺服器異常數必須為 0 |

---

## 🚀 快速開始

### 1. 安裝 k6

#### macOS
```bash
brew install k6
```

#### Linux (Ubuntu/Debian)
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

#### Windows
```bash
# 使用 Chocolatey
choco install k6

# 或使用 winget
winget install k6
```

#### Docker
```bash
docker pull grafana/k6
```

### 2. 設定環境變數

建立 `.env.test` 檔案（可選）：

```bash
# 測試環境網址
BASE_URL=http://localhost:3000

# 測試持續時間
DURATION=30s

# 管理者密鑰（用於審核測試）
ADMIN_SECRET=your-admin-secret
```

### 3. 啟動本地開發伺服器

```bash
# 在另一個終端機執行
npm run dev
```

### 4. 執行壓力測試

```bash
# 執行完整壓力測試
k6 run tests/stress-test.js

# 指定目標網址
k6 run --env BASE_URL=https://orbit-tower.vercel.app tests/stress-test.js

# 指定測試持續時間
k6 run --env DURATION=1m tests/stress-test.js

# 使用 Docker 執行
docker run --rm -i grafana/k6 run - < tests/stress-test.js

# 使用 Docker 並指定環境變數
docker run --rm -i \
  -e BASE_URL=https://orbit-tower.vercel.app \
  -e DURATION=30s \
  grafana/k6 run - < tests/stress-test.js
```

---

## 📊 測試報告

### 即時監控

k6 會在執行時即時顯示測試進度：

```
     ✓ homepage..................: 100%  ✓ 1000   ✗ 0
     ✓ drift_api.................: 99.9% ✓ 2000   ✗ 2
     ✓ claims_api................: 100%  ✓ 500    ✗ 0
     
     http_req_duration...........: avg=125.3ms  p(95)=450.2ms  p(99)=780.5ms
     http_req_failed.............: 0.01% ✗ 2      ✓ 3498
```

### 生成 HTML 報告

```bash
# 安裝 k6 HTML 報告工具
npm install -g k6-reporter

# 執行測試並生成報告
k6 run --out json=results.json tests/stress-test.js
k6-reporter < results.json -o report.html

# 或使用 k6 內建摘要
k6 run --summary-export=summary.json tests/stress-test.js
```

### 查看測試結果

測試完成後會生成：
- `tests/stress-test-report.json` - JSON 格式詳細報告
- 終機輸出文字摘要

---

## 🔧 進階配置

### 自訂測試場景

編輯 `tests/stress-test.js` 中的 `options` 物件：

```javascript
export const options = {
  scenarios: {
    // 自訂場景
    my_scenario: {
      executor: 'constant-vus',
      vus: 100,
      duration: '1m',
      exec: 'myTestFunction',
    },
  },
  
  thresholds: {
    'http_req_duration': ['p(95)<800'],
    'api_errors': ['rate<0.001'],
  },
};
```

### 執行器類型

k6 支援多種執行器：

| 執行器 | 用途 | 範例 |
|--------|------|------|
| `constant-vus` | 固定 VU 數量 | `vus: 100, duration: '1m'` |
| `ramping-vus` | 漸增 VU 數量 | `stages: [{ target: 100, duration: '30s' }]` |
| `constant-arrival-rate` | 固定請求率 | `rate: 100, timeUnit: '1s', duration: '1m'` |
| `ramping-arrival-rate` | 漸增請求率 | `stages: [{ target: 100, duration: '30s' }]` |
| `per-vu-iterations` | 每個 VU 執行 N 次 | `vus: 50, iterations: 10` |

### 標籤與分組

使用 `group` 和 `tags` 組織測試：

```javascript
import { group } from 'k6';

export default function () {
  group('首頁測試', () => {
    http.get(BASE_URL, { tags: { name: '首頁' } });
  });
  
  group('API 測試', () => {
    http.get(`${BASE_URL}/api/stores`, { tags: { name: 'Stores API' } });
  });
}
```

---

## 📈 CI/CD 整合

### GitHub Actions

```yaml
name: k6 Stress Test
on:
  push:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'  # 每週日執行

jobs:
  stress-test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 18
    
    - name: Install dependencies
      run: npm ci
    
    - name: Start dev server
      run: npm run dev &
    
    - name: Wait for server
      run: npx wait-on http://localhost:3000
    
    - name: Install k6
      run: |
        sudo gpg -k
        sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
        echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
        sudo apt-get update
        sudo apt-get install k6
    
    - name: Run stress test
      run: k6 run tests/stress-test.js
      env:
        BASE_URL: http://localhost:3000
    
    - name: Upload report
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: k6-report
        path: tests/stress-test-report.json
```

### Vercel Preview Deployments

```yaml
name: Vercel Preview Stress Test
on:
  deployment_status:

jobs:
  stress-test:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Install k6
      run: |
        sudo apt-get update
        sudo apt-get install k6
    
    - name: Run stress test against preview
      run: k6 run tests/stress-test.js
      env:
        BASE_URL: ${{ github.event.deployment_status.target_url }}
```

---

## 🐛 除錯技巧

### 1. 增加詳細日誌

```bash
k6 run --verbose tests/stress-test.js
```

### 2. 只執行單一場景

編輯腳本，只保留要測試的場景：

```javascript
export const options = {
  scenarios: {
    spike_test: { /* ... */ },
    // 註解掉其他場景
    // drift_api_stress: { /* ... */ },
    // concurrent_claims: { /* ... */ },
  },
};
```

### 3. 降低負載測試

```bash
# 使用較少的 VUs
k6 run --vus 10 --duration 10s tests/stress-test.js
```

### 4. 檢查網路問題

```bash
# 使用 k6 的網路診斷
k6 run --http-debug="full" tests/stress-test.js
```

---

## ⚠️ 注意事項

### 1. 生產環境測試

**切勿在生產環境執行高負載測試！**

- 使用預覽部署或測試環境
- 設定 Rate Limit 保護
- 監控伺服器資源

### 2. API 限制

- Groq API 有速率限制
- Supabase 有連線數限制
- Vercel Serverless Functions 有執行時間限制

### 3. 資料清理

測試後清理測試資料：

```sql
-- Supabase SQL
DELETE FROM claims WHERE email LIKE '%test@%';
DELETE FROM stores WHERE slug LIKE '%-test';
```

### 4. 成本考量

- k6 Cloud 按使用時間計費
- 生產環境測試可能產生額外費用
- API 調用可能超出免費額度

---

## 🔗 相關資源

- [k6 官方文件](https://k6.io/docs/)
- [k6 JavaScript API](https://k6.io/docs/javascript-api/)
- [k6 測試類型](https://k6.io/docs/test-types/)
- [k6 CI/CD 整合](https://k6.io/docs/integrations/)

---

## 📞 支援

如有測試相關問題，請：

1. 查看 `tests/stress-test-report.json` 詳細報告
2. 檢查 k6 終機輸出的錯誤訊息
3. 使用 `--verbose` 模式獲取更多資訊

---

**最後更新**: 2026-10-06

**測試版本**: v1.0.0

**k6 版本**: ^0.40.0
