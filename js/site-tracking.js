/* ============================================
   site-tracking.js — 全站廣告追蹤像素
   Meta Pixel, GTM, GA4, TikTok Pixel
   非阻塞載入，不影響 3D 大樓效能
   ============================================ */

(function () {
  // === Google Tag Manager (Head) ===
  // 替換 GTM-XXXXXXX 為實際 ID
  const GTM_ID = 'GTM-XXXXXXX';
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer',GTM_ID);

  // === Google Analytics 4 (gtag.js) ===
  const GA4_ID = 'G-XXXXXXX';
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(gtagScript);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){dataLayer.push(arguments);};
  gtag('js', new Date());
  gtag('config', GA4_ID, { send_page_view: true });

  // === Meta Pixel (Facebook) ===
  const FB_PIXEL_ID = 'XXXXXXXXXXXXXXXX';
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  if (typeof fbq !== 'undefined') fbq('init', FB_PIXEL_ID);
  if (typeof fbq !== 'undefined') fbq('track', 'PageView');

  // === TikTok Pixel ===
  const TT_PIXEL_ID = 'XXXXXXXXXX';
  !function(w,d,t){
    w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
    ttq.load(TT_PIXEL_ID);
    ttq.page();
  }(window,document,'ttq');

  // === 3D 大樓互動追蹤 ===
  document.addEventListener('DOMContentLoaded', function () {
    // 追蹤樓層點擊
    document.querySelectorAll('.tower-floor').forEach(function (floor) {
      floor.addEventListener('click', function () {
        var floorName = floor.getAttribute('data-floor');
        trackEvent('3D_Tower_Floor_Click', { floor: floorName });
      });
    });

    // 追蹤金流 Modal 開啟
    document.querySelectorAll('[onclick*="PaymentModal.open"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        trackEvent('Payment_Modal_Open', {});
      });
    });

    // 追蹤 LINE 按鈕點擊
    document.querySelectorAll('a[href*="line.me"]').forEach(function (link) {
      link.addEventListener('click', function () {
        trackEvent('LINE_Click', { source: link.closest('section')?.id || 'unknown' });
      });
    });

    // 追蹤推薦分享
    document.querySelectorAll('[data-share-line], [data-share-fb], [data-share-x], [data-share-linkedin]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        trackEvent('Referral_Share', { platform: btn.getAttribute('data-share-line') ? 'LINE' : btn.getAttribute('data-share-fb') ? 'FB' : btn.getAttribute('data-share-x') ? 'X' : 'LinkedIn' });
      });
    });
  });

  function trackEvent(eventName, params) {
    // GA4
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
    // Meta Pixel
    if (typeof fbq === 'function') {
      fbq('trackCustom', eventName, params);
    }
    // TikTok Pixel
    if (typeof ttq !== 'undefined' && ttq.track) {
      ttq.track(eventName, params);
    }
    // dataLayer (GTM)
    if (window.dataLayer) {
      window.dataLayer.push({ event: eventName, ...params });
    }
  }
})();
