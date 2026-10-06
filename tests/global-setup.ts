import { FullConfig } from '@playwright/test';

/**
 * Playwright 全域設定
 * 在測試執行前執行一次
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Orbit Tower 測試環境初始化...');
  
  // 驗證測試網址是否可訪問
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3000';
  
  try {
    const response = await fetch(baseURL, { 
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    
    if (response.ok) {
      console.log(`✅ 測試網址可訪問: ${baseURL}`);
    } else {
      console.warn(`⚠️  測試網址回應異常: ${response.status}`);
    }
  } catch (error) {
    console.error(`❌ 無法訪問測試網址: ${baseURL}`);
    console.error('請確保開發伺服器已啟動：npm run dev');
    process.exit(1);
  }
  
  console.log('✅ 測試環境就緒');
}

export default globalSetup;
