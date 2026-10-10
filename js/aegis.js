// Aegis Domain AI — Interactive Dashboard

(function() {
  'use strict';

  // Animate stats on scroll
  function animateStats() {
    const stats = [
      { el: document.getElementById('stat-domains'), target: 48, suffix: '' },
      { el: document.getElementById('stat-tenants'), target: 23, suffix: '' },
      { el: document.getElementById('stat-score'), target: 94, suffix: '' },
      { el: document.getElementById('stat-uptime'), target: 99.9, suffix: '%' }
    ];

    stats.forEach(stat => {
      if (!stat.el) return;
      let current = 0;
      const increment = stat.target / 40;
      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.target) {
          current = stat.target;
          clearInterval(timer);
        }
        stat.el.textContent = Number.isInteger(stat.target) 
          ? Math.floor(current) 
          : current.toFixed(1);
        if (stat.suffix) stat.el.textContent += stat.suffix;
      }, 30);
    });
  }

  // Animate tenant score
  function animateTenantScore() {
    const el = document.getElementById('tenant-score');
    if (!el) return;
    let current = 0;
    const target = 87;
    const increment = target / 30;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, 40);
  }

  // Animate risk gauge
  function animateRiskGauge() {
    const fill = document.getElementById('risk-gauge-fill');
    const scoreEl = document.getElementById('risk-score');
    if (!fill || !scoreEl) return;

    const targetScore = 30;
    const circumference = 534; // 2 * PI * 85
    const targetOffset = circumference - (targetScore / 100) * circumference;
    
    // Animate score number
    let currentScore = 0;
    const scoreTimer = setInterval(() => {
      currentScore += 1;
      if (currentScore >= targetScore) {
        currentScore = targetScore;
        clearInterval(scoreTimer);
      }
      scoreEl.textContent = currentScore;
    }, 30);

    // Animate gauge
    fill.style.strokeDashoffset = circumference;
    setTimeout(() => {
      fill.style.transition = 'stroke-dashoffset 1.5s ease';
      fill.style.strokeDashoffset = targetOffset;
      
      // Set color based on score
      if (targetScore <= 30) {
        fill.style.stroke = '#22c55e'; // green
      } else if (targetScore <= 70) {
        fill.style.stroke = '#eab308'; // yellow
      } else {
        fill.style.stroke = '#ef4444'; // red
      }
    }, 100);
  }

  // Animate provisioning steps
  function animateProvisioning() {
    const steps = document.querySelectorAll('.provisioning-step');
    steps.forEach((step, i) => {
      setTimeout(() => {
        step.style.opacity = '1';
        step.style.transform = 'translateY(0)';
      }, i * 200);
    });
  }

  // Intersection Observer for animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        if (id === 'verification') animateTenantScore();
        if (id === 'risk') animateRiskGauge();
        if (id === 'provisioning') animateProvisioning();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  // Observe modules
  document.querySelectorAll('.aegis-module').forEach(module => {
    observer.observe(module);
  });

  // Animate stats when hero is visible
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const hero = document.querySelector('.aegis-hero');
  if (hero) heroObserver.observe(hero);

  // Domain card hover effects
  document.querySelectorAll('.domain-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-6px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  // Violation category click effect
  document.querySelectorAll('.violation-category').forEach(cat => {
    cat.addEventListener('click', () => {
      cat.style.transform = 'scale(0.95)';
      setTimeout(() => {
        cat.style.transform = 'scale(1)';
      }, 150);
    });
  });

  // Renewal milestone animation
  function animateRenewalMilestones() {
    const dots = document.querySelectorAll('.renewal-dot');
    dots.forEach((dot, i) => {
      setTimeout(() => {
        dot.classList.add('active');
      }, i * 300);
    });
  }

  const renewalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateRenewalMilestones();
        renewalObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const renewalSection = document.getElementById('renewal');
  if (renewalSection) renewalObserver.observe(renewalSection);

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================================
  // ADMIN LOGIN SYSTEM
  // ============================================
  
  const ADMIN_USERNAME = 'kclee1654';
  const STORAGE_KEY_ADMIN = 'aegis-admin-logged-in';
  
  // Check if already logged in on page load
  function checkAdminSession() {
    try {
      const isLoggedIn = sessionStorage.getItem(STORAGE_KEY_ADMIN) === 'true';
      if (isLoggedIn) {
        showAdminLoggedIn();
      }
    } catch (e) {}
  }
  
  // Open login modal
  window.openLoginModal = function() {
    const modal = document.getElementById('admin-login-modal');
    if (modal) {
      modal.classList.add('active');
      document.getElementById('admin-username').focus();
    }
  };
  
  // Close login modal
  window.closeLoginModal = function() {
    const modal = document.getElementById('admin-login-modal');
    if (modal) {
      modal.classList.remove('active');
      document.getElementById('login-error').style.display = 'none';
      document.getElementById('admin-username').value = '';
    }
  };
  
  // Admin login
  window.adminLogin = function() {
    const username = document.getElementById('admin-username').value.trim();
    const errorEl = document.getElementById('login-error');
    
    if (username === ADMIN_USERNAME) {
      // Success
      try {
        sessionStorage.setItem(STORAGE_KEY_ADMIN, 'true');
      } catch (e) {}
      
      closeLoginModal();
      showAdminLoggedIn();
    } else {
      // Error
      errorEl.style.display = 'block';
      document.getElementById('admin-username').style.borderColor = '#dc2626';
      setTimeout(() => {
        document.getElementById('admin-username').style.borderColor = '';
      }, 2000);
    }
  };
  
  // Admin logout
  window.adminLogout = function() {
    try {
      sessionStorage.removeItem(STORAGE_KEY_ADMIN);
    } catch (e) {}
    
    hideAdminPanel();
  };
  
  // Show admin logged in state
  function showAdminLoggedIn() {
    document.getElementById('admin-login-btn').style.display = 'none';
    document.getElementById('admin-user-info').style.display = 'flex';
    document.getElementById('admin-panel').style.display = 'block';
    showAdminSection('overview');
  }
  
  // Hide admin panel
  function hideAdminPanel() {
    document.getElementById('admin-login-btn').style.display = 'flex';
    document.getElementById('admin-user-info').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'none';
  }
  
  // Show admin section
  window.showAdminSection = function(section) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
    
    // Show selected section
    const target = document.getElementById('admin-' + section);
    if (target) target.style.display = 'block';
    
    // Update button states
    document.querySelectorAll('.admin-action-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
  };
  
  // Handle Enter key in login form
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      const modal = document.getElementById('admin-login-modal');
      if (modal && modal.classList.contains('active')) {
        adminLogin();
      }
    }
    if (e.key === 'Escape') {
      closeLoginModal();
    }
  });
  
  // Click outside modal to close
  document.addEventListener('click', function(e) {
    const modal = document.getElementById('admin-login-modal');
    if (e.target === modal) {
      closeLoginModal();
    }
  });
  
  // Check admin session on load
  checkAdminSession();

})();
