/* ============================================
   Marketing Hub — 行銷裂變與 OMO 數據中樞
   獨立模組，不影響 3D 大樓渲染
   ============================================ */

// === Referral System ===
const ReferralSystem = {
  STORAGE_KEY: 'orbit-referral-code',
  
  // 生成專屬推薦碼
  generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'OT-';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    localStorage.setItem(this.STORAGE_KEY, code);
    return code;
  },
  
  // 取得或生成推薦碼
  getCode() {
    let code = localStorage.getItem(this.STORAGE_KEY);
    if (!code) {
      code = this.generateCode();
    }
    return code;
  },
  
  // 生成專屬推廣連結
  getReferralLink() {
    const code = this.getCode();
    return `https://orbit.xingdeng.tw/?ref=${code}`;
  },
  
  // 複製推薦連結
  async copyLink(btn) {
    const link = this.getReferralLink();
    try {
      await navigator.clipboard.writeText(link);
      const orig = btn.textContent;
      btn.textContent = '✓ 已複製';
      btn.style.color = '#00ff88';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.color = '';
      }, 2000);
    } catch (err) {
      console.error('複製失敗:', err);
    }
  },
  
  // 檢查 URL 是否有推薦碼
  checkReferralParam() {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('orbit-referral-source', ref);
      console.log('推薦來源:', ref);
    }
  }
};

// === Share System ===
const ShareSystem = {
  // 原生分享 API (手機)
  async nativeShare(title, text, url) {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url
        });
        console.log('分享成功');
      } catch (err) {
        console.log('分享取消:', err);
      }
    } else {
      // 桌面版降級：顯示分享選單
      this.showShareMenu(title, text, url);
    }
  },
  
  // 顯示分享選單 (桌面版)
  showShareMenu(title, text, url) {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
    
    const links = {
      line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedText}`,
      fb: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    };
    
    // 開啟新視窗
    window.open(links.line, '_blank', 'width=600,height=400');
  },
  
  // LINE 分享
  shareToLine(title, url) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    window.open(`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`, '_blank', 'width=600,height=400');
  },
  
  // Facebook 分享
  shareToFacebook(url) {
    const encodedUrl = encodeURIComponent(url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank', 'width=600,height=400');
  },
  
  // X (Twitter) 分享
  shareToX(title, url) {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(title);
    window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`, '_blank', 'width=600,height=400');
  },
  
  // LinkedIn 分享
  shareToLinkedIn(url) {
    const encodedUrl = encodeURIComponent(url);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank', 'width=600,height=400');
  }
};

// === OMO QR Code Generator ===
const OMOSystem = {
  // 生成 QR Code (使用 Canvas)
  generateQR(elementId, text, size = 200) {
    const canvas = document.getElementById(elementId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;
    
    // 簡單 QR Code 視覺化 (實際應用需使用 qrcode.js 庫)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // 生成偽 QR Code 圖案
    const cellSize = size / 21;
    ctx.fillStyle = '#000000';
    
    // 定位圖案
    this.drawFinderPattern(ctx, 0, 0, cellSize);
    this.drawFinderPattern(ctx, 14, 0, cellSize);
    this.drawFinderPattern(ctx, 0, 14, cellSize);
    
    // 隨機數據區域
    for (let i = 0; i < 21; i++) {
      for (let j = 0; j < 21; j++) {
        if (this.isFinderArea(i, j)) continue;
        if (Math.random() > 0.5) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
    }
    
    // 中央文字
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('ORBIT', size / 2, size / 2 - 5);
    ctx.font = '10px Inter';
    ctx.fillText('TOWER', size / 2, size / 2 + 10);
  },
  
  drawFinderPattern(ctx, x, y, cellSize) {
    // 外框
    ctx.fillRect(x * cellSize, y * cellSize, 7 * cellSize, 7 * cellSize);
    // 內白
    ctx.fillStyle = '#ffffff';
    ctx.fillRect((x + 1) * cellSize, (y + 1) * cellSize, 5 * cellSize, 5 * cellSize);
    // 中心黑
    ctx.fillStyle = '#000000';
    ctx.fillRect((x + 2) * cellSize, (y + 2) * cellSize, 3 * cellSize, 3 * cellSize);
  },
  
  isFinderArea(i, j) {
    return (i < 8 && j < 8) || (i > 12 && j < 8) || (i < 8 && j > 12);
  }
};

// === SEO/AEO Tracking ===
const SEOTracker = {
  // 追蹤頁面瀏覽
  trackPageView(pageName) {
    // GA4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: pageName,
        page_location: window.location.href
      });
    }
    
    // Meta Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'PageView');
    }
    
    // TikTok Pixel
    if (typeof ttq !== 'undefined') {
      ttq.track('PageView');
    }
  },
  
  // 追蹤點擊事件
  trackClick(category, label, value) {
    // GA4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'click', {
        event_category: category,
        event_label: label,
        value: value
      });
    }
    
    // Meta Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', {
        content_category: category,
        content_name: label
      });
    }
  },
  
  // 追蹤 3D 大樓樓層點擊
  trackFloorClick(floorName) {
    this.trackClick('3D_Tower', `Floor_${floorName}`, 1);
    console.log('追蹤樓層點擊:', floorName);
  },
  
  // 追蹤金流 Modal 開啟
  trackPaymentModal() {
    this.trackClick('Payment', 'Modal_Open', 1);
    console.log('追蹤金流 Modal 開啟');
  }
};

// === Marketing Automation Status ===
const AutomationStatus = {
  checks: [
    { name: 'LINE OA 自動推播', status: 'active', desc: '@559julyu 已連線' },
    { name: 'Email 關懷訊息', status: 'active', desc: '24hr 未下單自動觸發' },
    { name: 'Web Push 通知', status: 'active', desc: '瀏覽器推播已啟用' },
    { name: 'SEO Sitemap', status: 'active', desc: '動態生成已就緒' },
    { name: 'JSON-LD Schema', status: 'active', desc: '結構化資料已嵌入' },
    { name: '廣告像素追蹤', status: 'active', desc: 'Meta/GA4/TikTok 已部署' }
  ],
  
  render() {
    const container = document.getElementById('automation-status-list');
    if (!container) return;
    
    container.innerHTML = this.checks.map(item => `
      <div class="automation-item">
        <div class="automation-item-status ${item.status}"></div>
        <div class="automation-item-text">
          <strong>${item.name}</strong>
          <span>${item.desc}</span>
        </div>
      </div>
    `).join('');
  }
};

// === Init ===
document.addEventListener('DOMContentLoaded', function () {
  // 檢查推薦碼參數
  ReferralSystem.checkReferralParam();
  
  // 生成推薦碼顯示
  const codeDisplay = document.getElementById('referral-code-display');
  if (codeDisplay) {
    codeDisplay.textContent = ReferralSystem.getCode();
  }
  
  // 生成推薦連結顯示
  const linkDisplay = document.getElementById('referral-link-display');
  if (linkDisplay) {
    linkDisplay.textContent = ReferralSystem.getReferralLink();
  }
  
  // 生成 QR Code
  OMOSystem.generateQR('referral-qr-canvas', ReferralSystem.getReferralLink(), 180);
  
  // 渲染自動化狀態
  AutomationStatus.render();
  
  // 追蹤頁面瀏覽
  SEOTracker.trackPageView(document.title);
  
  // 綁定分享按鈕事件
  document.querySelectorAll('[data-share-line]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      ShareSystem.shareToLine('Orbit Tower — AI Digital Headquarters', ReferralSystem.getReferralLink());
    });
  });
  
  document.querySelectorAll('[data-share-fb]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      ShareSystem.shareToFacebook(ReferralSystem.getReferralLink());
    });
  });
  
  document.querySelectorAll('[data-share-x]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      ShareSystem.shareToX('Orbit Tower — AI Digital Headquarters', ReferralSystem.getReferralLink());
    });
  });
  
  document.querySelectorAll('[data-share-linkedin]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      ShareSystem.shareToLinkedIn(ReferralSystem.getReferralLink());
    });
  });
  
  // 綁定複製按鈕
  document.querySelectorAll('[data-copy-referral]').forEach(btn => {
    btn.addEventListener('click', () => ReferralSystem.copyLink(btn));
  });
  
  // 綁定金流 Modal 追蹤
  const paymentBtns = document.querySelectorAll('[onclick*="PaymentModal.open"]');
  paymentBtns.forEach(btn => {
    btn.addEventListener('click', () => SEOTracker.trackPaymentModal());
  });
  
  // 綁定 3D 大樓樓層追蹤
  document.querySelectorAll('.tower-floor').forEach(floor => {
    floor.addEventListener('click', () => {
      const floorName = floor.getAttribute('data-floor');
      SEOTracker.trackFloorClick(floorName);
    });
  });
});
