// Orbit Tower - Main JS
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

// Intersection Observer for fade-in animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .capability-card, .solution-card, .explore-item, .ops-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  observer.observe(el);
});

// Nav background on scroll
const nav = document.querySelector('.nav-main');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.style.background = 'var(--nav-bg-scroll, rgba(10, 10, 15, 0.98))';
  } else {
    nav.style.background = 'var(--nav-bg, rgba(10, 10, 15, 0.95))';
  }
});
