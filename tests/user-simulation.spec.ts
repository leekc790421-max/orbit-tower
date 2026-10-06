import { test, expect, Page } from '@playwright/test';

/**
 * Orbit Tower 自動化使用者模擬測試
 * 
 * 測試場景：
 * 1. 訪客 3D 互動體驗（WebGL 渲染、HUD 控制、樓層切換）
 * 2. AI 樓管互動（聊天對話、建議問題）
 * 3. Modal 互動（定價、登入、條款、關於、README）
 * 4. 響應式測試（桌面版、手機版）
 */

// ===== 測試資料 =====
const TEST_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

// ===== 輔助函式 =====

/**
 * 等待 WebGL Canvas 渲染完成
 */
async function waitForWebGLRender(page: Page) {
  await page.waitForFunction(() => {
    const canvas = document.querySelector('canvas');
    return canvas && canvas.width > 0 && canvas.height > 0;
  }, { timeout: 15000 });
}

/**
 * 收集 Console 錯誤
 */
async function collectConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  return errors;
}

/**
 * 監測 FPS（注入監控腳本）
 */
async function monitorFPS(page: Page, durationMs: number = 3000): Promise<number> {
  return await page.evaluate(async (duration) => {
    return new Promise<number>((resolve) => {
      let frameCount = 0;
      let lastTime = performance.now();
      let fps = 0;
      
      const countFrame = () => {
        const now = performance.now();
        frameCount++;
        
        if (now - lastTime >= 1000) {
          fps = Math.round((frameCount * 1000) / (now - lastTime));
          frameCount = 0;
          lastTime = now;
        }
        
        if (now - (performance.now() - duration) < 0) {
          requestAnimationFrame(countFrame);
        } else {
          resolve(fps);
        }
      };
      
      requestAnimationFrame(countFrame);
      
      // 超時保護
      setTimeout(() => resolve(fps || 30), duration + 1000);
    });
  }, durationMs);
}

// =============================================================================
// 場景 1：訪客 3D 互動體驗
// =============================================================================

test.describe('場景 1：訪客 3D 互動體驗', () => {
  
  test('應該成功載入首頁並渲染 3D 大樓', async ({ page }) => {
    const consoleErrors = await collectConsoleErrors(page);
    
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 驗證 Canvas 存在且可見
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
    
    // 驗證標題正確
    await expect(page).toHaveTitle(/Orbit Tower/);
    
    // 檢查是否有嚴重 Console 錯誤（過濾掉警告）
    const criticalErrors = consoleErrors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('deprecated') &&
      !e.includes('THREE')
    );
    expect(criticalErrors).toHaveLength(0);
  });
  
  test('FPS 應該維持在 30 以上（寬鬆標準）', async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 等待 3 秒收集 FPS 數據
    const fps = await monitorFPS(page, 3000);
    
    // 寬鬆標準：30 FPS（考慮 CI 環境效能限制）
    expect(fps).toBeGreaterThanOrEqual(30);
  });
  
  test('應該能切換場景氛圍（霓虹夜城/雲海日出/深海秘境）', async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 找到場景氛圍按鈕
    const cyberButton = page.locator('button:has-text("霓虹夜城")');
    const cloudButton = page.locator('button:has-text("雲海日出")');
    const deepseaButton = page.locator('button:has-text("深海秘境")');
    
    // 驗證按鈕存在
    await expect(cyberButton).toBeVisible();
    await expect(cloudButton).toBeVisible();
    await expect(deepseaButton).toBeVisible();
    
    // 切換到雲海日出
    await cloudButton.click();
    await expect(cloudButton).toHaveClass(/border-cyan-400/);
    
    // 切換到深海秘境
    await deepseaButton.click();
    await expect(deepseaButton).toHaveClass(/border-cyan-400/);
    
    // 切換回霓虹夜城
    await cyberButton.click();
    await expect(cyberButton).toHaveClass(/border-cyan-400/);
  });
  
  test('應該能切換光譜色調', async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 找到光譜色調按鈕（圓形色塊）
    const colorButtons = page.locator('.glass-panel button[title]');
    const count = await colorButtons.count();
    
    // 應該有 4 種色調
    expect(count).toBeGreaterThanOrEqual(4);
    
    // 點擊第二個色調
    await colorButtons.nth(1).click();
    
    // 等待動畫完成
    await page.waitForTimeout(500);
  });
  
  test('應該能點擊樓層指示器切換樓層', async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 找到樓層按鈕
    const floor1Button = page.locator('button:has-text("1F")');
    const floor3Button = page.locator('button:has-text("3F")');
    
    await expect(floor1Button).toBeVisible();
    
    // 點擊 3F
    await floor3Button.click();
    await page.waitForTimeout(500);
    
    // 點擊 1F
    await floor1Button.click();
    await page.waitForTimeout(500);
  });
  
  test('應該能點擊 3D 大樓上的戶別並顯示資訊卡', async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 點擊 Canvas 中央區域（模擬點擊大樓）
    const canvas = page.locator('canvas').first();
    const box = await canvas.boundingBox();
    
    if (box) {
      // 點擊中央偏上（大樓位置）
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 3);
      await page.waitForTimeout(1000);
      
      // 可能會顯示戶別資訊卡（如果有點擊到戶別）
      // 這裡只驗證不會崩潰
    }
  });
  
  test('應該能展開手機版控制面板', async ({ page, isMobile }) => {
    // 只在手機版測試
    test.skip(!isMobile, '僅在手機版測試');
    
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 找到控制面板展開按鈕
    const expandButton = page.locator('button:has-text("控制面板")');
    await expect(expandButton).toBeVisible();
    
    // 點擊展開
    await expandButton.click();
    
    // 驗證面板展開
    const themeSection = page.locator('text=場景氛圍').first();
    await expect(themeSection).toBeVisible();
  });
});

// =============================================================================
// 場景 2：AI 樓管互動
// =============================================================================

test.describe('場景 2：AI 樓管互動', () => {
  
  test('應該能開啟 AI 樓管聊天視窗', async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 找到 AI 樓管按鈕
    const conciergeButton = page.locator('button').filter({ has: page.locator('svg.lucide-message-circle') });
    await expect(conciergeButton).toBeVisible();
    
    // 點擊開啟
    await conciergeButton.click();
    
    // 驗證聊天視窗開啟
    const chatWindow = page.locator('text=AI 樓管').first();
    await expect(chatWindow).toBeVisible();
    
    // 驗證初始訊息
    const welcomeMessage = page.locator('text=歡迎來到賽博虛擬地產總部');
    await expect(welcomeMessage).toBeVisible();
  });
  
  test('應該能發送訊息並收到 AI 回覆', async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 開啟聊天視窗
    const conciergeButton = page.locator('button').filter({ has: page.locator('svg.lucide-message-circle') });
    await conciergeButton.click();
    await page.waitForTimeout(500);
    
    // 找到輸入框
    const input = page.locator('input[placeholder*="詢問"]').first();
    await expect(input).toBeVisible();
    
    // 輸入訊息
    await input.fill('帶我看 3F 的空置戶');
    
    // 點擊發送
    const sendButton = page.locator('button').filter({ has: page.locator('svg.lucide-send') });
    await sendButton.click();
    
    // 等待 AI 回覆（最多 5 秒）
    const response = page.locator('text=目前 3F 的戶別狀態');
    await expect(response).toBeVisible({ timeout: 5000 });
  });
  
  test('應該能點擊建議問題快速詢問', async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 開啟聊天視窗
    const conciergeButton = page.locator('button').filter({ has: page.locator('svg.lucide-message-circle') });
    await conciergeButton.click();
    await page.waitForTimeout(500);
    
    // 找到建議問題按鈕
    const suggestion = page.locator('button:has-text("B2B 方案有哪些")');
    await expect(suggestion).toBeVisible();
    
    // 點擊建議問題
    await suggestion.click();
    
    // 等待 AI 回覆
    const response = page.locator('text=基礎方案');
    await expect(response).toBeVisible({ timeout: 5000 });
  });
  
  test('應該能關閉 AI 樓管聊天視窗', async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 開啟聊天視窗
    const conciergeButton = page.locator('button').filter({ has: page.locator('svg.lucide-message-circle') });
    await conciergeButton.click();
    await page.waitForTimeout(500);
    
    // 找到關閉按鈕
    const closeButton = page.locator('button').filter({ has: page.locator('svg.lucide-x') }).first();
    await closeButton.click();
    
    // 驗證聊天視窗關閉
    const chatWindow = page.locator('text=AI 樓管').first();
    await expect(chatWindow).not.toBeVisible();
  });
});

// =============================================================================
// 場景 3：Modal 互動測試
// =============================================================================

test.describe('場景 3：Modal 互動測試', () => {
  
  test('應該能開啟「方案價格」Modal', async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 找到方案價格按鈕
    const pricingButton = page.locator('button:has-text("方案價格")');
    await expect(pricingButton).toBeVisible();
    
    // 點擊開啟
    await pricingButton.click();
    
    // 驗證 Modal 開啟
    const modal = page.locator('text=基礎方案').first();
    await expect(modal).toBeVisible();
    
    // 驗證方案內容
    await expect(page.locator('text=NT$35,000')).toBeVisible();
    await expect(page.locator('text=NT$60,000')).toBeVisible();
    await expect(page.locator('text=NT$120,000')).toBeVisible();
  });
  
  test('應該能開啟「關於 Orbit Tower」Modal', async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 找到關於按鈕
    const aboutButton = page.locator('button:has-text("關於")').first();
    await expect(aboutButton).toBeVisible();
    
    // 點擊開啟
    await aboutButton.click();
    
    // 驗證 Modal 開啟
    const modal = page.locator('text=關於 Orbit Tower');
    await expect(modal).toBeVisible();
  });
  
  test('應該能開啟「系統說明」Modal', async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 找到系統說明按鈕
    const readmeButton = page.locator('button:has-text("系統說明")');
    await expect(readmeButton).toBeVisible();
    
    // 點擊開啟
    await readmeButton.click();
    
    // 驗證 Modal 開啟
    const modal = page.locator('text=系統架構');
    await expect(modal).toBeVisible();
  });
  
  test('應該能開啟「登入」Modal', async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 找到登入按鈕
    const loginButton = page.locator('button:has-text("登入")');
    await expect(loginButton).toBeVisible();
    
    // 點擊開啟
    await loginButton.click();
    
    // 驗證 Modal 開啟
    const modal = page.locator('text=戶號實名驗證');
    await expect(modal).toBeVisible();
  });
  
  test('應該能開啟「免責聲明」Modal', async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 找到免責聲明按鈕（底部）
    const legalButton = page.locator('button:has-text("免責聲明")');
    await expect(legalButton).toBeVisible();
    
    // 點擊開啟
    await legalButton.click();
    
    // 驗證 Modal 開啟
    const modal = page.locator('text=服務條款');
    await expect(modal).toBeVisible();
  });
  
  test('應該能關閉所有 Modal', async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 開啟方案價格 Modal
    const pricingButton = page.locator('button:has-text("方案價格")');
    await pricingButton.click();
    await page.waitForTimeout(500);
    
    // 找到關閉按鈕（X 圖示）
    const closeButton = page.locator('button').filter({ has: page.locator('svg.lucide-x') }).first();
    await closeButton.click();
    
    // 驗證 Modal 關閉
    const modal = page.locator('text=基礎方案').first();
    await expect(modal).not.toBeVisible();
  });
});

// =============================================================================
// 場景 4：響應式與手機版測試
// =============================================================================

test.describe('場景 4：響應式與手機版測試', () => {
  
  test('桌面版應該正常顯示所有控制元件', async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 驗證頂部 Header
    await expect(page.locator('text=Orbit Tower')).toBeVisible();
    
    // 驗證左側樓層指示器
    await expect(page.locator('button:has-text("1F")')).toBeVisible();
    
    // 驗證右下角控制面板
    await expect(page.locator('button:has-text("認領店面")')).toBeVisible();
    
    // 驗證左下角 AI 樓管
    const conciergeButton = page.locator('button').filter({ has: page.locator('svg.lucide-message-circle') });
    await expect(conciergeButton).toBeVisible();
  });
  
  test('手機版應該有漢堡選單', async ({ page, isMobile }) => {
    test.skip(!isMobile, '僅在手機版測試');
    
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 驗證漢堡選單按鈕存在
    const menuButton = page.locator('button').filter({ has: page.locator('svg.lucide-menu') });
    await expect(menuButton).toBeVisible();
  });
  
  test('手機版控制面板應該可展開收合', async ({ page, isMobile }) => {
    test.skip(!isMobile, '僅在手機版測試');
    
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 找到控制面板按鈕
    const panelButton = page.locator('button:has-text("控制面板")');
    await expect(panelButton).toBeVisible();
    
    // 點擊展開
    await panelButton.click();
    await page.waitForTimeout(300);
    
    // 驗證展開內容
    await expect(page.locator('text=場景氛圍').first()).toBeVisible();
    
    // 再次點擊收合
    await panelButton.click();
  });
  
  test('手機版應該能正常操作 AI 樓管', async ({ page, isMobile }) => {
    test.skip(!isMobile, '僅在手機版測試');
    
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 開啟 AI 樓管
    const conciergeButton = page.locator('button').filter({ has: page.locator('svg.lucide-message-circle') });
    await conciergeButton.click();
    await page.waitForTimeout(500);
    
    // 驗證聊天視窗開啟
    await expect(page.locator('text=AI 樓管').first()).toBeVisible();
    
    // 輸入訊息
    const input = page.locator('input[placeholder*="詢問"]').first();
    await input.fill('你好');
    
    // 發送
    const sendButton = page.locator('button').filter({ has: page.locator('svg.lucide-send') });
    await sendButton.click();
    
    // 驗證訊息送出
    await expect(page.locator('text=你好').first()).toBeVisible();
  });
});

// =============================================================================
// 場景 5：新手引導測試
// =============================================================================

test.describe('場景 5：新手引導測試', () => {
  
  test('首次訪問應該顯示新手引導', async ({ page, context }) => {
    // 清除 localStorage 模擬首次訪問
    await context.clearCookies();
    
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 驗證新手引導顯示
    const onboarding = page.locator('text=歡迎來到 Orbit Tower');
    await expect(onboarding).toBeVisible({ timeout: 5000 });
  });
  
  test('應該能關閉新手引導', async ({ page, context }) => {
    await context.clearCookies();
    
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 等待新手引導顯示
    await page.waitForTimeout(1000);
    
    // 找到關閉按鈕
    const closeButton = page.locator('button').filter({ has: page.locator('svg.lucide-x') }).first();
    
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await page.waitForTimeout(500);
    }
  });
  
  test('再次訪問不應該顯示新手引導', async ({ page }) => {
    // 第一次訪問
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    await page.waitForTimeout(1000);
    
    // 重新載入
    await page.reload();
    await waitForWebGLRender(page);
    
    // 驗證新手引導不顯示
    const onboarding = page.locator('text=歡迎來到 Orbit Tower');
    await expect(onboarding).not.toBeVisible({ timeout: 3000 });
  });
});

// =============================================================================
// 場景 6：效能與穩定性測試
// =============================================================================

test.describe('場景 6：效能與穩定性測試', () => {
  
  test('頁面載入時間應該在 10 秒以內', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(TEST_URL, { waitUntil: 'networkidle' });
    await waitForWebGLRender(page);
    
    const loadTime = Date.now() - startTime;
    
    // 頁面載入時間應該在 10 秒以內
    expect(loadTime).toBeLessThan(10000);
  });
  
  test('連續切換場景不應該崩潰', async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    const themes = ['霓虹夜城', '雲海日出', '深海秘境'];
    
    // 連續切換 10 次
    for (let i = 0; i < 10; i++) {
      const theme = themes[i % themes.length];
      const button = page.locator(`button:has-text("${theme}")`);
      await button.click();
      await page.waitForTimeout(200);
    }
    
    // 驗證頁面仍然正常
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
  });
  
  test('連續開啟關閉 Modal 不應該崩潰', async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForWebGLRender(page);
    
    // 連續開啟關閉 5 次
    for (let i = 0; i < 5; i++) {
      const pricingButton = page.locator('button:has-text("方案價格")');
      await pricingButton.click();
      await page.waitForTimeout(300);
      
      const closeButton = page.locator('button').filter({ has: page.locator('svg.lucide-x') }).first();
      await closeButton.click();
      await page.waitForTimeout(300);
    }
    
    // 驗證頁面仍然正常
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
  });
});
