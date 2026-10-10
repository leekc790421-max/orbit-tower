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

})();
