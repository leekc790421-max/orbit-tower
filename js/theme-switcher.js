// Orbit Tower — Theme Switcher
// Auto-rotate every 5 minutes, manual switch support

(function() {
  'use strict';

  const THEMES = [
    { id: 'theme-arctic',  name: '極光藍',  icon: '🧊' },
    { id: 'theme-sunrise', name: '曙光金',  icon: '🌅' },
    { id: 'theme-emerald', name: '翡翠科技', icon: '💎' }
  ];

  const ROTATE_INTERVAL = 5 * 60 * 1000; // 5 minutes
  const STORAGE_KEY = 'orbit-tower-theme';
  const PAUSED_KEY = 'orbit-tower-theme-paused';

  let currentIndex = 0;
  let rotateTimer = null;
  let isPaused = false;

  // Get saved theme or default to first
  function getSavedIndex() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const idx = parseInt(saved, 10);
        if (idx >= 0 && idx < THEMES.length) return idx;
      }
    } catch (e) {}
    return 0;
  }

  // Save current theme index
  function saveIndex(idx) {
    try {
      localStorage.setItem(STORAGE_KEY, String(idx));
    } catch (e) {}
  }

  // Check if rotation was paused
  function getPausedState() {
    try {
      return localStorage.getItem(PAUSED_KEY) === 'true';
    } catch (e) {}
    return false;
  }

  function savePausedState(paused) {
    try {
      localStorage.setItem(PAUSED_KEY, String(paused));
    } catch (e) {}
  }

  // Apply theme
  function applyTheme(index) {
    const body = document.body;
    
    // Remove all theme classes
    THEMES.forEach(t => body.classList.remove(t.id));
    
    // Add new theme class
    body.classList.add(THEMES[index].id);
    currentIndex = index;
    saveIndex(index);
    
    // Update dots
    updateDots();
    
    // Update label
    updateLabel();
  }

  // Next theme
  function nextTheme() {
    const next = (currentIndex + 1) % THEMES.length;
    applyTheme(next);
  }

  // Update indicator dots
  function updateDots() {
    const dots = document.querySelectorAll('.theme-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  // Update label text
  function updateLabel() {
    const label = document.querySelector('.theme-switcher-label');
    if (label) {
      label.textContent = THEMES[currentIndex].name;
    }
  }

  // Start auto-rotation
  function startRotation() {
    stopRotation();
    rotateTimer = setInterval(nextTheme, ROTATE_INTERVAL);
    isPaused = false;
    savePausedState(false);
    updatePauseIcon();
  }

  // Stop auto-rotation
  function stopRotation() {
    if (rotateTimer) {
      clearInterval(rotateTimer);
      rotateTimer = null;
    }
  }

  // Toggle pause
  function togglePause() {
    if (isPaused) {
      startRotation();
    } else {
      stopRotation();
      isPaused = true;
      savePausedState(true);
      updatePauseIcon();
    }
  }

  // Update pause/play icon
  function updatePauseIcon() {
    const btn = document.querySelector('.theme-pause-btn');
    if (btn) {
      btn.textContent = isPaused ? '▶' : '⏸';
      btn.title = isPaused ? '繼續自動切換' : '暫停自動切換';
    }
  }

  // Create theme switcher UI
  function createUI() {
    const container = document.createElement('div');
    container.className = 'theme-switcher';
    container.innerHTML = `
      <button class="theme-switcher-btn" title="切換主題">
        <span class="theme-color-ring"></span>
        <span class="theme-icon">${THEMES[currentIndex].icon}</span>
      </button>
      <span class="theme-switcher-label">${THEMES[currentIndex].name}</span>
      <div class="theme-dots">
        ${THEMES.map((_, i) => `<span class="theme-dot${i === currentIndex ? ' active' : ''}"></span>`).join('')}
      </div>
      <button class="theme-pause-btn theme-switcher-btn" style="width:36px;height:36px;font-size:14px;" title="暫停自動切換">⏸</button>
    `;

    document.body.appendChild(container);

    // Click to switch theme
    const switchBtn = container.querySelector('.theme-switcher-btn:not(.theme-pause-btn)');
    switchBtn.addEventListener('click', () => {
      nextTheme();
      // Update icon
      const icon = container.querySelector('.theme-icon');
      if (icon) icon.textContent = THEMES[currentIndex].icon;
      // Restart rotation timer on manual switch
      if (!isPaused) {
        startRotation();
      }
    });

    // Pause button
    const pauseBtn = container.querySelector('.theme-pause-btn');
    pauseBtn.addEventListener('click', togglePause);
  }

  // Initialize
  function init() {
    currentIndex = getSavedIndex();
    isPaused = getPausedState();
    
    // Apply initial theme
    applyTheme(currentIndex);
    
    // Create UI
    createUI();
    
    // Start rotation if not paused
    if (!isPaused) {
      startRotation();
    } else {
      updatePauseIcon();
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
