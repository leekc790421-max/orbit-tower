// Tower floor data
const floorData = {
  aicore: {
    title: '🧠 AI Core — 企業智慧核心',
    leftTitle: 'AI 智慧核心',
    leftContent: '<p>Orbit Tower 的大腦。所有 AI 能力的運算中樞，驅動六大協同能力的核心引擎。</p><ul class="info-panel-list"><li>智慧分析引擎</li><li>自然語言處理</li><li>深度學習模型</li><li>即時決策系統</li></ul>',
    rightTitle: '對應科技展品',
    rightContent: '<p>AI Core 樓層對應以下科技展品：</p><ul class="info-panel-list"><li><a href="gallery.html" style="color:var(--primary-blue);">量子核心組裝中心</a></li><li><a href="gallery.html" style="color:var(--primary-blue);">藍光反應爐系統</a></li><li><a href="gallery.html" style="color:var(--primary-blue);">全息數據核心</a></li></ul>',
    modalDesc: 'AI Core 是 Orbit Tower 的運算核心，整合智慧分析、自然語言處理、深度學習與即時決策系統。所有樓層的 AI 功能皆由此驅動。',
    galleryLink: '量子核心組裝中心'
  },
  cloud: {
    title: '☁️ 雲端辦公室 — 企業營運中樞',
    leftTitle: '雲端辦公室',
    leftContent: '<p>六大營運中心的雲端管理介面。隨時隨地掌控企業全局。</p><ul class="info-panel-list"><li>業務中心</li><li>內容中心</li><li>維運中心</li><li>交付中心</li><li>法務中心</li><li>策略中心</li></ul>',
    rightTitle: '對應科技展品',
    rightContent: '<p>雲端辦公室對應以下科技展品：</p><ul class="info-panel-list"><li><a href="gallery.html" style="color:var(--primary-blue);">黃金智慧核心</a></li><li><a href="gallery.html" style="color:var(--primary-blue);">翡翠量子力場</a></li></ul>',
    modalDesc: '雲端辦公室提供六大營運中心的統一管理介面，支援遠端協作、即時監控與自動化報告。',
    galleryLink: '黃金智慧核心'
  },
  sales: {
    title: '📊 業務中心 — 商機管理引擎',
    leftTitle: '業務中心',
    leftContent: '<p>AI 驅動的商機管理系統。從潛在客戶識別到成交追蹤，全流程自動化。</p><ul class="info-panel-list"><li>AI 商機識別</li><li>客戶分級管理</li><li>自動跟進提醒</li><li>銷售漏斗分析</li></ul>',
    rightTitle: '功能亮點',
    rightContent: '<p>業務中心整合 AI 客戶接待與商機收集系統，自動分類來訪者意圖並分配給對應業務人員。</p><ul class="info-panel-list"><li>轉換率追蹤</li><li>ROI 分析</li></ul>',
    modalDesc: '業務中心整合 AI 客戶接待、商機自動分類與銷售漏斗管理，讓每一筆商機都不被遺漏。',
    galleryLink: null
  },
  content: {
    title: '✍️ 內容中心 — AI 內容工廠',
    leftTitle: '內容中心',
    leftContent: '<p>AI 驅動的內容生產線。自動產出 SEO 優化文章、社群貼文、產品描述。</p><ul class="info-panel-list"><li>AI 文章生成</li><li>多語系翻譯</li><li>SEO 自動優化</li><li>品牌語調一致性</li></ul>',
    rightTitle: '產出能力',
    rightContent: '<p>內容工廠每月可產出 200+ 篇高品質 SEO 文章，支援 12 種語言。</p><ul class="info-panel-list"><li>月產 200+ 篇文章</li><li>12 種語言支援</li></ul>',
    modalDesc: '內容中心是 Orbit Tower 的內容引擎，AI 自動產出符合品牌調性的高品質內容，大幅降低內容行銷成本。',
    galleryLink: '黃金自動化矩陣'
  },
  ops: {
    title: '⚙️ 維運中心 — 系統守護者',
    leftTitle: '維運中心',
    leftContent: '<p>24/7 系統監控與自動維護。確保 Orbit Tower 永遠在線。</p><ul class="info-panel-list"><li>即時系統監控</li><li>自動備份機制</li><li>安全威脅防禦</li><li>效能優化</li></ul>',
    rightTitle: '對應科技展品',
    rightContent: '<p>維運中心對應以下科技展品：</p><ul class="info-panel-list"><li><a href="gallery.html" style="color:var(--primary-blue);">紅晶能量核心</a></li><li><a href="gallery.html" style="color:var(--primary-blue);">紅盾安全協定</a></li></ul>',
    modalDesc: '維運中心提供企業級系統監控、自動備份、安全防護與效能優化服務，確保 99.99% 系統穩定性。',
    galleryLink: '紅盾安全協定'
  },
  delivery: {
    title: '🚀 交付中心 — 專案管理引擎',
    leftTitle: '交付中心',
    leftContent: '<p>從需求分析到上線交付，AI 輔助的專案管理系統。</p><ul class="info-panel-list"><li>需求自動分析</li><li>任務智能分配</li><li>進度即時追蹤</li><li>品質自動檢測</li></ul>',
    rightTitle: '效率提升',
    rightContent: '<p>AI 輔助專案管理，減少 60% 溝通成本，提升 40% 交付速度。</p><ul class="info-panel-list"><li>溝通成本降低 60%</li><li>交付速度提升 40%</li></ul>',
    modalDesc: '交付中心以 AI 驅動專案管理流程，從需求分析、任務分配到品質檢測，實現高效交付。',
    galleryLink: null
  },
  legal: {
    title: '⚖️ 法務中心 — 合規守護',
    leftTitle: '法務中心',
    leftContent: '<p>AI 輔助的合約管理與合規審查系統。</p><ul class="info-panel-list"><li>智慧合約分析</li><li>合規自動審查</li><li>智慧財產管理</li><li>風險預警系統</li></ul>',
    rightTitle: '對應科技展品',
    rightContent: '<p>法務中心對應以下科技展品：</p><ul class="info-panel-list"><li><a href="gallery.html" style="color:var(--primary-blue);">紅盾安全協定</a></li></ul>',
    modalDesc: '法務中心提供 AI 驅動的合約分析、合規審查與智慧財產管理，降低法律風險。',
    galleryLink: '紅盾安全協定'
  },
  strategy: {
    title: '🎯 策略中心 — 決策指揮部',
    leftTitle: '策略中心',
    leftContent: '<p>整合多維度數據的 AI 決策支援系統。</p><ul class="info-panel-list"><li>市場趨勢分析</li><li>競爭情報收集</li><li>策略情境模擬</li><li>KPI 即時追蹤</li></ul>',
    rightTitle: '對應科技展品',
    rightContent: '<p>策略中心對應以下科技展品：</p><ul class="info-panel-list"><li><a href="gallery.html" style="color:var(--primary-blue);">神經數據矩陣</a></li><li><a href="gallery.html" style="color:var(--primary-blue);">紫晶軌道引擎</a></li></ul>',
    modalDesc: '策略中心整合市場數據、競爭情報與內部 KPI，AI 模擬不同策略情境，輔助高層做出最佳決策。',
    galleryLink: '神經數據矩陣'
  }
};

let isRotating = true;
let currentFloor = null;

function selectFloor(floorId) {
  const data = floorData[floorId];
  if (!data) return;
  
  currentFloor = floorId;
  
  // Update left panel
  document.getElementById('left-title').textContent = data.leftTitle;
  document.getElementById('left-content').innerHTML = data.leftContent;
  
  // Update right panel
  document.getElementById('right-title').textContent = data.rightTitle;
  document.getElementById('right-content').innerHTML = data.rightContent;
  
  // Highlight selected floor
  document.querySelectorAll('.tower-floor').forEach(f => {
    f.style.borderColor = 'rgba(0, 212, 255, 0.3)';
    f.style.background = 'rgba(0, 212, 255, 0.05)';
  });
  const selectedFloor = document.querySelector(`[data-floor="${floorId}"]`);
  if (selectedFloor) {
    selectedFloor.style.borderColor = 'var(--primary-blue)';
    selectedFloor.style.background = 'rgba(0, 212, 255, 0.2)';
    selectedFloor.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.5)';
  }
  
  // Show modal
  document.getElementById('modal-floor-title').textContent = data.title;
  document.getElementById('modal-floor-desc').textContent = data.modalDesc;
  
  let linkHtml = '';
  if (data.galleryLink) {
    linkHtml = `<a href="gallery.html" class="floor-modal-link">前往科技藝廊 — ${data.galleryLink}</a>`;
  }
  document.getElementById('modal-floor-link').innerHTML = linkHtml;
  
  document.getElementById('floor-modal').classList.add('active');
}

function closeFloorModal() {
  document.getElementById('floor-modal').classList.remove('active');
}

function toggleRotation() {
  const tower = document.getElementById('tower-3d');
  const btn = document.getElementById('rotate-btn');
  isRotating = !isRotating;
  tower.style.animationPlayState = isRotating ? 'running' : 'paused';
  btn.textContent = isRotating ? '暫停旋轉' : '繼續旋轉';
  btn.classList.toggle('active', !isRotating);
}

function resetView() {
  document.querySelectorAll('.tower-floor').forEach(f => {
    f.style.borderColor = 'rgba(0, 212, 255, 0.3)';
    f.style.background = 'rgba(0, 212, 255, 0.05)';
    f.style.boxShadow = 'none';
  });
  document.getElementById('left-title').textContent = 'AI Digital Headquarters';
  document.getElementById('left-content').innerHTML = '<p>歡迎進入 Orbit Tower — 一座可互動探索的未來企業數位總部。</p><p>點擊右側大樓樓層，探索每個區域的功能與對應的科技展品。</p><ul class="info-panel-list"><li>8 大功能樓層</li><li>12 件科技展品</li><li>6 大 AI 協同能力</li></ul>';
  document.getElementById('right-title').textContent = '樓層資訊';
  document.getElementById('right-content').innerHTML = '<p>選擇一個樓層以查看詳細資訊。</p><p>每個樓層都對應特定的企業功能與科技展品。</p>';
  currentFloor = null;
}

// Create ambient particles
function createParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'tower-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (6 + Math.random() * 6) + 's';
    container.appendChild(particle);
  }
}

// Handle hash navigation
function handleHash() {
  const hash = window.location.hash.replace('#', '');
  if (hash && floorData[hash]) {
    setTimeout(() => selectFloor(hash), 500);
  }
}

// Init
createParticles();
handleHash();
window.addEventListener('hashchange', handleHash);

document.getElementById('floor-modal').addEventListener('click', function(e) {
  if (e.target === this) closeFloorModal();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeFloorModal();
});
