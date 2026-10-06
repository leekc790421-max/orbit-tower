import { defineConfig, devices } from '@playwright/test';

/**
 * Orbit Tower Playwright 自動化測試配置
 * 
 * 測試場景：
 * 1. 訪客 3D 互動體驗（WebGL 渲染、HUD 控制、樓層切換）
 * 2. AI 樓管互動（聊天對話、建議問題）
 * 3. Modal 互動（定價、登入、條款、關於、README）
 * 4. 響應式測試（桌面版、手機版）
 * 
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 測試目錄
  testDir: './tests',
  
  // 完全並行執行
  fullyParallel: true,
  
  // CI 環境禁止 test.only
  forbidOnly: !!process.env.CI,
  
  // 失敗重試次數
  retries: process.env.CI ? 2 : 0,
  
  // 並行 worker 數量
  workers: process.env.CI ? 1 : undefined,
  
  // 測試報告器
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  
  // 全域設定
  use: {
    // 測試網址
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:3000',
    
    // 收集失敗時的 trace
    trace: 'on-first-retry',
    
    // 失敗時截圖
    screenshot: 'only-on-failure',
    
    // 失敗時錄製影片
    video: 'retain-on-failure',
    
    // 繁體中文環境
    locale: 'zh-TW',
    timezoneId: 'Asia/Taipei',
    
    // 忽略 HTTPS 錯誤（測試環境）
    ignoreHTTPSErrors: true,
    
    // 預設 viewport
    viewport: { width: 1920, height: 1080 },
  },
  
  // 全域 timeout
  timeout: 60_000,        // 測試超時：60 秒
  expect: {
    timeout: 10_000,      // 斷言超時：10 秒
  },
  
  // 瀏覽器專案
  projects: [
    // 桌面瀏覽器
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--enable-webgl', '--use-gl=swiftshader'],
        },
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        launchOptions: {
          args: ['--enable-webgl'],
        },
      },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // 手機版
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        launchOptions: {
          args: ['--enable-webgl', '--use-gl=swiftshader'],
        },
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 13'],
      },
    },
  ],
  
  // 本地開發伺服器（可選）
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120_000,
  // },
});
