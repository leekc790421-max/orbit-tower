# Orbit Tower Playwright 自動化測試

## 📋 測試腳本說明

本測試腳本模擬真實使用者旅程，涵蓋 6 大測試場景：

### 場景 1：訪客 3D 互動體驗
- ✅ 首頁載入與 WebGL 渲染驗證
- ✅ FPS 效能監控（目標 ≥ 30 FPS）
- ✅ 場景氛圍切換（霓虹夜城/雲海日出/深海秘境）
- ✅ 光譜色調切換（琥珀金/翡翠綠/賽博藍/極光紫）
- ✅ 樓層指示器互動
- ✅ 3D 大樓戶別點擊
- ✅ 手機版控制面板展開

### 場景 2：AI 樓管互動
- ✅ 開啟聊天視窗
- ✅ 發送訊息並接收 AI 回覆
- ✅ 點擊建議問題快速詢問
- ✅ 關閉聊天視窗

### 場景 3：Modal 互動測試
- ✅ 方案價格 Modal
- ✅ 關於 Orbit Tower Modal
- ✅ 系統說明 Modal
- ✅ 登入 Modal
- ✅ 免責聲明 Modal
- ✅ Modal 關閉功能

### 場景 4：響應式與手機版測試
- ✅ 桌面版控制元件驗證
- ✅ 手機版漢堡選單
- ✅ 手機版控制面板
- ✅ 手機版 AI 樓管操作

### 場景 5：新手引導測試
- ✅ 首次訪問顯示引導
- ✅ 關閉引導功能
- ✅ 再次訪問不重複顯示

### 場景 6：效能與穩定性測試
- ✅ 頁面載入時間（< 10 秒）
- ✅ 連續切換場景穩定性
- ✅ 連續開啟關閉 Modal 穩定性

---

## 🚀 快速開始

### 1. 安裝依賴

```bash
# 安裝 Playwright 與瀏覽器
npm install
npx playwright install
```

### 2. 設定環境變數

建立 `.env.test` 檔案（可選）：

```bash
# 測試環境網址
TEST_BASE_URL=http://localhost:3000
```

### 3. 啟動本地開發伺服器

```bash
# 在另一個終端機執行
npm run dev
```

### 4. 執行測試

```bash
# 執行所有測試
npx playwright test

# 顯示瀏覽器視窗
npx playwright test --headed

# 除錯模式（逐步執行）
npx playwright test --debug

# UI 模式（互動式）
npx playwright test --ui

# 執行特定測試檔案
npx playwright test tests/user-simulation.spec.ts

# 執行包含關鍵字的測試
npx playwright test -g "3D 互動"
npx playwright test -g "AI 樓管"
npx playwright test -g "Modal"
npx playwright test -g "響應式"

# 執行特定瀏覽器
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project="Mobile Chrome"
```

---

## 📊 測試報告

```bash
# 查看 HTML 測試報告
npx playwright show-report

# 報告位置
# ./playwright-report/index.html
```

---

## 🔧 測試配置

### playwright.config.ts

主要配置項目：

```typescript
{
  // 測試目錄
  testDir: './tests',
  
  // 瀏覽器專案
  projects: [
    'chromium',      // Desktop Chrome
    'firefox',       // Desktop Firefox
    'webkit',        // Desktop Safari
    'Mobile Chrome', // Pixel 5
    'Mobile Safari', // iPhone 13
  ],
  
  // 全域設定
  use: {
    baseURL: 'http://localhost:3000',
    viewport: { width: 1920, height: 1080 },
    locale: 'zh-TW',
    timezoneId: 'Asia/Taipei',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  // 超時設定
  timeout: 60_000,        // 測試超時：60 秒
  expect: {
    timeout: 10_000,      // 斷言超時：10 秒
  },
}
```

---

## 📁 測試檔案結構

```
orbit-tower/
├── tests/
│   ├── user-simulation.spec.ts    # 主要測試腳本
│   └── global-setup.ts            # 全域設定
├── playwright.config.ts           # Playwright 配置
├── playwright-report/             # 測試報告（執行後生成）
└── test-results/                  # 測試結果（執行後生成）
```

---

## 🎯 測試場景詳細說明

### 場景 1：訪客 3D 互動體驗

```typescript
test('應該成功載入首頁並渲染 3D 大樓', async ({ page }) => {
  await page.goto(TEST_URL);
  await waitForWebGLRender(page);
  
  const canvas = page.locator('canvas').first();
  await expect(canvas).toBeVisible();
  
  await expect(page).toHaveTitle(/Orbit Tower/);
});

test('FPS 應該維持在 30 以上', async ({ page }) => {
  await page.goto(TEST_URL);
  await waitForWebGLRender(page);
  
  const fps = await monitorFPS(page, 3000);
  expect(fps).toBeGreaterThanOrEqual(30);
});
```

### 場景 2：AI 樓管互動

```typescript
test('應該能發送訊息並收到 AI 回覆', async ({ page }) => {
  await page.goto(TEST_URL);
  await waitForWebGLRender(page);
  
  // 開啟聊天視窗
  const conciergeButton = page.locator('button').filter({ 
    has: page.locator('svg.lucide-message-circle') 
  });
  await conciergeButton.click();
  
  // 輸入訊息
  const input = page.locator('input[placeholder*="詢問"]').first();
  await input.fill('帶我看 3F 的空置戶');
  
  // 發送
  const sendButton = page.locator('button').filter({ 
    has: page.locator('svg.lucide-send') 
  });
  await sendButton.click();
  
  // 驗證 AI 回覆
  const response = page.locator('text=目前 3F 的戶別狀態');
  await expect(response).toBeVisible({ timeout: 5000 });
});
```

### 場景 3：Modal 互動

```typescript
test('應該能開啟「方案價格」Modal', async ({ page }) => {
  await page.goto(TEST_URL);
  await waitForWebGLRender(page);
  
  const pricingButton = page.locator('button:has-text("方案價格")');
  await pricingButton.click();
  
  const modal = page.locator('text=基礎方案').first();
  await expect(modal).toBeVisible();
  
  await expect(page.locator('text=NT$35,000')).toBeVisible();
});
```

---

## 🐛 除錯技巧

### 1. 使用 --headed 模式

```bash
npx playwright test --headed
```

瀏覽器視窗會顯示測試過程，方便觀察 UI 互動。

### 2. 使用 --debug 模式

```bash
npx playwright test --debug
```

逐步執行測試，可以在每個步驟暫停檢查。

### 3. 使用 --ui 模式

```bash
npx playwright test --ui
```

互動式 UI，可以：
- 選擇特定測試執行
- 查看測試時間軸
- 檢查 DOM 快照
- 比較不同測試結果

### 4. 查看 Trace

```bash
npx playwright show-trace test-results/xxx/trace.zip
```

查看測試執行的完整時間軸，包含：
- DOM 快照
- 網路請求
- Console 日誌
- 螢幕截圖

---

## 📈 CI/CD 整合

### GitHub Actions

```yaml
name: Playwright Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright
      run: npx playwright install --with-deps
    
    - name: Start dev server
      run: npm run dev &
    
    - name: Wait for server
      run: npx wait-on http://localhost:3000
    
    - name: Run tests
      run: npx playwright test
      env:
        TEST_BASE_URL: http://localhost:3000
    
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### Vercel Preview Deployments

```yaml
name: Vercel Preview Tests
on:
  deployment_status:

jobs:
  test:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Run tests against preview
      run: npx playwright test
      env:
        TEST_BASE_URL: ${{ github.event.deployment_status.target_url }}
```

---

## ⚠️ 注意事項

### 1. WebGL 支援

某些 CI 環境可能不支援 WebGL，測試會自動降級處理：

```typescript
launchOptions: {
  args: ['--enable-webgl', '--use-gl=swiftshader'],
}
```

### 2. FPS 標準

- 本地環境：目標 45+ FPS
- CI 環境：寬鬆標準 30+ FPS
- 考慮虛擬機效能限制

### 3. 測試順序

部分測試有依賴關係，建議按順序執行：

```bash
npx playwright test --workers=1
```

### 4. 手機版測試

手機版測試需要指定 project：

```bash
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

---

## 🔗 相關資源

- [Playwright 官方文件](https://playwright.dev/)
- [Playwright API 參考](https://playwright.dev/docs/api/class-playwright)
- [測試最佳實踐](https://playwright.dev/docs/test-best-practices)
- [CI/CD 整合](https://playwright.dev/docs/ci)

---

## 📞 支援

如有測試相關問題，請：

1. 查看 `playwright-report/` 中的詳細報告
2. 檢查 `test-results/` 中的截圖與影片
3. 使用 `npx playwright show-report` 查看互動式報告

---

**最後更新**: 2026-10-06

**測試版本**: v1.0.0

**Playwright 版本**: ^1.40.0
