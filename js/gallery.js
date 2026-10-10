// Gallery exhibit data
const exhibits = [
  { img: 'assets/quantum-core.png', title: '量子核心組裝中心', en: 'Quantum Core Assembly', desc: '展示多機械臂同步協作之未來製造場景。透過 AI 調度系統實現精密組裝、即時監控與自主校正，達到纳米級精度。', value: ['提升生產效率 300%', '降低人工成本 70%', '強化品管一致性'], apps: ['智慧工廠', '半導體製造', '高端精密業'] },
  { img: 'assets/golden-coin.png', title: '黃金智慧核心', en: 'Golden Intelligence Nexus', desc: '象徵企業 AI 中樞神經系統。將知識、內容、流程、客戶資料與決策支援集中管理，形成統一智慧樞紐。', value: ['提升決策效率 200%', '建立企業知識庫', '實現智慧營運'], apps: ['企業總部', 'AI 指揮中心', '數位轉型專案'] },
  { img: 'assets/green-network.png', title: '神經數據矩陣', en: 'Neural Data Matrix', desc: '以類神經網路架構為基礎的數據處理核心。透過多節點平行運算，實現即時資料分析與模式識別。', value: ['毫秒級數據分析', '預測性商業洞察', '自動化報告生成'], apps: ['金融風控', '供應鏈優化', '市場預測'] },
  { img: 'assets/red-sphere.png', title: '紅晶能量核心', en: 'Crimson Energy Core', desc: '高效能運算能量管理系統。以磁約束技術穩定核心能量輸出，確保 24/7 不間斷的算力供應。', value: ['降低能耗 45%', '99.99% 系統穩定性', '綠色永續營運'], apps: ['資料中心', '雲端服務', '邊緣運算'] },
  { img: 'assets/violet-core.png', title: '紫晶軌道引擎', en: 'Violet Orbital Engine', desc: '多軌道協同處理引擎，模擬星體運行軌跡的資料排程系統。實現跨區域、跨時區的任務自動分配。', value: ['全球化任務排程', '跨時區協作效率', '資源最佳配置'], apps: ['跨國企業', '遠端團隊', '全球運籌'] },
  { img: 'assets/blue-reactor.png', title: '藍光反應爐系統', en: 'Azure Reactor System', desc: '高效能 AI 模型訓練反應爐。以冷卻系統維持最佳運算溫度，支援大規模深度學習模型訓練。', value: ['加速模型訓練 5x', '降低算力成本', '彈性擴展架構'], apps: ['AI 研發', '大模型訓練', '科學運算'] },
  { img: 'assets/golden-system.webp', title: '黃金自動化矩陣', en: 'Golden Automation Grid', desc: '全自動化生產線控制系統。結合電路板層級的精密控制與 AI 決策邏輯，實現零人工干預的智慧製造。', value: ['全自動化生產', '品質一致性保證', '24/7 不間斷運轉'], apps: ['電子製造', '汽車工業', '精密組裝'] },
  { img: 'assets/green-cube.webp', title: '翡翠量子力場', en: 'Emerald Quantum Field', desc: '量子運算模擬力場。以多維度節點網路模擬量子態疊加，為複雜問題提供指數級加速的解決方案。', value: ['指數級運算加速', '複雜問題求解', '密碼學安全'], apps: ['藥物研發', '金融模型', '物流最佳化'] },
  { img: 'assets/red-chamber.webp', title: '紅盾安全協定', en: 'Crimson Containment Protocol', desc: '企業級資安防護系統。以多層能量屏障隔離威脅，結合 AI 威脅偵測實現主動防禦。', value: ['零日威脅防禦', '即時入侵偵測', '合規自動審查'], apps: ['企業資安', '金融防護', '政府機構'] },
  { img: 'assets/spider-bots.webp', title: '藍光群體智慧', en: 'Azure Swarm Intelligence', desc: '多代理協同作業系統。模擬自然界群體智慧，讓多個 AI Agent 自主協作完成複雜任務。', value: ['多任務並行處理', '自主錯誤修復', '彈性任務分配'], apps: ['客服自動化', '資料探勘', '智慧監控'] },
  { img: 'assets/holographic-cube.webp', title: '全息數據核心', en: 'Holographic Data Core', desc: '三維全息資料視覺化引擎。將複雜數據轉化為沉浸式 3D 影像，讓決策者直觀理解數據關係。', value: ['直觀數據理解', '加速決策流程', '跨部門溝通效率'], apps: ['經營分析', '專案管理', '簡報展示'] },
  { img: 'assets/blue-sphere.webp', title: '藍芯處理樞紐', en: 'Cyan Processing Hub', desc: '多核心平行處理樞紐。以六軸機械臂環繞核心進行即時校準，確保運算精度與穩定性。', value: ['超高運算精度', '自動校準系統', '模組化擴展'], apps: ['精密運算', '醫療影像', '工程模擬'] }
];

function openModal(index) {
  const e = exhibits[index];
  const modal = document.getElementById('exhibit-modal');
  document.getElementById('modal-img').src = e.img;
  document.getElementById('modal-img').alt = e.title;
  document.getElementById('modal-info').innerHTML = `
    <h2 style="font-size:28px;margin-bottom:0.5rem;">${e.title}</h2>
    <p style="color:var(--primary-purple);font-size:16px;margin-bottom:1.5rem;font-weight:500;">${e.en}</p>
    <div style="margin-bottom:1.5rem;">
      <h5 style="color:var(--primary-blue);font-size:18px;margin-bottom:0.75rem;display:flex;align-items:center;gap:0.5rem;"><span style="width:4px;height:20px;background:var(--primary-blue);border-radius:2px;display:inline-block;"></span>技術說明</h5>
      <p style="font-size:18px;line-height:1.8;color:var(--text-secondary);">${e.desc}</p>
    </div>
    <div style="margin-bottom:1.5rem;">
      <h5 style="color:var(--primary-blue);font-size:18px;margin-bottom:0.75rem;display:flex;align-items:center;gap:0.5rem;"><span style="width:4px;height:20px;background:var(--primary-blue);border-radius:2px;display:inline-block;"></span>商業價值</h5>
      <ul style="list-style:none;display:flex;flex-wrap:wrap;gap:0.5rem;">${e.value.map(v => `<li style="background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.3);padding:0.5rem 1rem;border-radius:20px;font-size:15px;color:var(--primary-blue);">${v}</li>`).join('')}</ul>
    </div>
    <div>
      <h5 style="color:var(--primary-blue);font-size:18px;margin-bottom:0.75rem;display:flex;align-items:center;gap:0.5rem;"><span style="width:4px;height:20px;background:var(--primary-blue);border-radius:2px;display:inline-block;"></span>應用場景</h5>
      <ul style="list-style:none;display:flex;flex-wrap:wrap;gap:0.5rem;">${e.apps.map(a => `<li style="background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.3);padding:0.5rem 1rem;border-radius:20px;font-size:15px;color:var(--primary-purple);">${a}</li>`).join('')}</ul>
    </div>
  `;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('exhibit-modal').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('exhibit-modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});
