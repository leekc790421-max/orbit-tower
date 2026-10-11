/* ============================================
   HUD Overlay Components — JS Logic
   獨立模組，不影響 3D 大樓渲染
   ============================================ */

// === Payment Modal ===
const PaymentModal = {
  open() {
    const overlay = document.getElementById('payment-modal-overlay');
    if (overlay) overlay.classList.add('active');
  },
  close() {
    const overlay = document.getElementById('payment-modal-overlay');
    if (overlay) overlay.classList.remove('active');
  },
  copyValue(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      const orig = btn.textContent;
      btn.textContent = '已複製';
      btn.style.color = '#00ff88';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.color = '';
      }, 1500);
    });
  }
};

// === Legal Disclaimer Modal ===
const LegalModal = {
  open() {
    const overlay = document.getElementById('legal-modal-overlay');
    if (overlay) overlay.classList.add('active');
  },
  close() {
    const overlay = document.getElementById('legal-modal-overlay');
    if (overlay) overlay.classList.remove('active');
  },
  toggleAccept() {
    const cb = document.getElementById('legal-accept-check');
    const btn = document.getElementById('legal-accept-btn');
    if (cb && btn) btn.disabled = !cb.checked;
  },
  accept() {
    localStorage.setItem('orbit-legal-accepted', 'true');
    this.close();
  },
  isAccepted() {
    return localStorage.getItem('orbit-legal-accepted') === 'true';
  }
};

// === Init ===
document.addEventListener('DOMContentLoaded', function () {
  // Close modals on overlay click
  ['payment-modal-overlay', 'legal-modal-overlay'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', function (e) {
        if (e.target === this) {
          this.classList.remove('active');
        }
      });
    }
  });

  // Close modals on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      ['payment-modal-overlay', 'legal-modal-overlay'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
      });
    }
  });
});
