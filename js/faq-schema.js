// FAQ Schema JSON-LD — 僅在 index.html 載入
(function () {
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': '什麼是 AI 數位展示館？',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'AI 數位展示館是結合人工智慧、3D 互動技術與品牌體驗的下一代企業官網。不同於傳統靜態網站，AI 數位展示館提供沉浸式 3D 品牌展示、24/7 AI 客戶接待、多語系即時溝通，讓企業在全球市場脫穎而出。'
        }
      },
      {
        '@type': 'Question',
        'name': '3D 網站對 SEO 有幫助嗎？',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': '是的。Orbit Tower 採用 SEO 友善的 3D 渲染技術，所有內容皆可被搜尋引擎爬取。我們同時部署 JSON-LD 結構化資料、動態 Sitemap、OG 社群預覽，確保 Google、Bing、AI 回答引擎（Perplexity、ChatGPT）都能正確索引您的內容。'
        }
      },
      {
        '@type': 'Question',
        'name': 'AI 客服如何運作？',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Orbit Tower 整合 Gemini、Copilot、Meta AI 等六大 AI 引擎，提供 24/7 多語系客戶接待。AI 自動辨識訪客意圖、分類商機、即時回應常見問題，並將高價值線索轉交人工客服。每月可自動處理 2,000+ 詢價。'
        }
      },
      {
        '@type': 'Question',
        'name': '企業需要多語網站嗎？',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': '如果您的目標市場包含海外客戶，多語網站是必備的。Orbit Tower 支援 12 種語言，AI 自動翻譯並保持品牌語調一致性。研究顯示，72% 的消費者更傾向用母語購買產品。'
        }
      },
      {
        '@type': 'Question',
        'name': 'Digital Headquarters 是什麼？',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Digital Headquarters（數位總部）是 Orbit Tower 的核心概念。它不只是網站，而是整合 AI 接待、3D 品牌展示、雲端辦公室、行銷自動化、客戶管理的全方位企業數位門面。讓品牌、AI 與客戶在同一個數位空間相遇。'
        }
      },
      {
        '@type': 'Question',
        'name': '推薦裂變獎勵機制如何運作？',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': '每位 Orbit Tower 租戶/會員都會獲得專屬「賽博門牌邀請碼」。成功推薦新企業進駐，您可获得 1 個月 MRR 維護費折抵（或等值 AI 算力 Token），新租戶則享受首次 9 折優惠。一鍵分享至 LINE、Facebook、X、LinkedIn。'
        }
      },
      {
        '@type': 'Question',
        'name': 'OMO 虛實整合是什麼？',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'OMO（Online-Merge-Offline）是線上線下虛實整合機制。實體展場訪客掃描 3D 門牌 QR Code 後，手機端秒級進入 3D 動態門戶，同時自動將 LINE 好友資訊對接後台 CRM，完成實體流量向雲端資產的轉化。'
        }
      }
    ]
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(faqData);
  document.head.appendChild(script);
})();
