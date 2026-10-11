/* ============================================
   site-head.js — 全站共用 SEO / Schema / 追蹤注入
   在每個頁面的 <head> 底部載入
   不影響 3D 大樓渲染
   ============================================ */

(function () {
  const SITE = 'https://orbit.xingdeng.tw';
  const TITLE = 'Orbit Tower — AI Digital Headquarters';
  const DESC = '結合 AI 接待、3D 品牌展示、多語溝通體驗，打造下一代企業數位總部。全天候全球化企業門面。';
  const IMG = SITE + '/assets/orbit-poster.png';
  const URL = SITE + window.location.pathname;

  // === 1. Open Graph + Twitter Card 注入 ===
  injectMeta('property', 'og:type', 'website');
  injectMeta('property', 'og:title', document.title || TITLE);
  injectMeta('property', 'og:description', DESC);
  injectMeta('property', 'og:image', IMG);
  injectMeta('property', 'og:url', URL);
  injectMeta('property', 'og:site_name', 'Orbit Tower');
  injectMeta('property', 'og:locale', 'zh_TW');
  injectMeta('name', 'twitter:card', 'summary_large_image');
  injectMeta('name', 'twitter:title', document.title || TITLE);
  injectMeta('name', 'twitter:description', DESC);
  injectMeta('name', 'twitter:image', IMG);

  // === 2. JSON-LD Organization Schema ===
  injectJSONLD({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Orbit Tower',
    'alternateName': '光曜星樞 Singularity Nexus Technology',
    'url': SITE,
    'logo': SITE + '/assets/snt-logo.jpg',
    'description': 'AI-Powered Digital Headquarters — 打造下一代企業數位總部',
    'email': 'contact@559julyu.ai',
    'sameAs': [
      'https://line.me/R/ti/p/@559julyu',
      'https://news3c.xingdeng.tw/'
    ],
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '',
      'contactType': 'customer service',
      'email': 'contact@559julyu.ai',
      'availableLanguage': ['Chinese', 'English', 'Japanese']
    }
  });

  // === 3. JSON-LD WebSite Schema (含 SearchAction) ===
  injectJSONLD({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Orbit Tower',
    'url': SITE,
    'description': DESC,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': SITE + '/?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  });

  // === 4. JSON-LD BreadcrumbList ===
  const path = window.location.pathname.replace(/\/$/, '');
  const breadcrumbMap = {
    '': '首頁',
    '/tower.html': '3D 大樓',
    '/gallery.html': '科技藝廊',
    '/pricing.html': '價格方案',
    '/marketing-hub.html': '行銷裂變與 OMO 數據中樞',
    '/aegis.html': 'Aegis Domain AI',
    '/legal/index.html': '法律中心',
    '/legal/terms.html': '服務條款',
    '/legal/privacy.html': '隱私政策',
    '/legal/ai-policy.html': 'AI 聲明',
    '/legal/disclaimer.html': '免責聲明',
    '/legal/cloud-services.html': '雲端服務聲明',
    '/legal/contracts.html': '合約下載'
  };

  const breadcrumbItems = [
    { '@type': 'ListItem', 'position': 1, 'name': '首頁', 'item': SITE + '/' }
  ];

  if (path && breadcrumbMap[path]) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      'position': 2,
      'name': breadcrumbMap[path],
      'item': SITE + path
    });
  }

  injectJSONLD({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbItems
  });

  // === Helper Functions ===
  function injectMeta(attr, name, content) {
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function injectJSONLD(data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }
})();
