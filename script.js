/* ========================================
   HassleFreeDrive – App JavaScript
   All animations, interactions, and logic
   ======================================== */

(function () {
  'use strict';

  /* ── DOM Refs ── */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileClose = document.getElementById('mobileClose');
  const wordRotator = document.getElementById('wordRotator');
  const mobLinks = document.querySelectorAll('.mob-link, .mob-cta');

  /* ========================================
     1. NAVBAR – Scroll Transition
  ======================================== */
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Add scrolled class for background
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = scrollY;
  }, { passive: true });


  function openMobileNav() {
    mobileNav.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNav.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMobileNav);
  mobileClose.addEventListener('click', closeMobileNav);
  mobileOverlay.addEventListener('click', closeMobileNav);

  // Close on link click
  mobLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  /* ========================================
     3. WORD ROTATOR – Typography Loop
  ======================================== */
  const words = wordRotator.querySelectorAll('.word');
  let currentWord = 0;
  let rotatorInterval;

  function rotateWords() {
    const current = words[currentWord];
    const nextIndex = (currentWord + 1) % words.length;
    const next = words[nextIndex];

    // Exit current
    current.classList.remove('active');
    current.classList.add('exit');

    // Enter next
    next.classList.add('active');

    // Clean up exit class
    setTimeout(() => {
      current.classList.remove('exit');
    }, 550);

    currentWord = nextIndex;
  }

  // Start after short delay
  setTimeout(() => {
    rotatorInterval = setInterval(rotateWords, 2400);
  }, 1500);

  /* ========================================
     4. SCROLL REVEAL ANIMATIONS
  ======================================== */
  const revealElements = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  /* ========================================
     5. SMOOTH SCROLL for anchor links
  ======================================== */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top,
          behavior: 'smooth'
        });
      }
    });
  });

  // Handle mailto links explicitly for better reliability
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = link.href;
    });
  });

  /* ========================================
     6. ACTIVE NAV LINK on scroll
  ======================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active-link');
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(section => sectionObserver.observe(section));

  /* ========================================
     7. SUBTLE PARALLAX in hero
  ======================================== */
  const heroBlobs = document.querySelectorAll('.bg-blob');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroBlobs.forEach((blob, i) => {
        const speed = 0.08 + i * 0.04;
        blob.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }
  }, { passive: true });

  /* ========================================
     8. BUTTON RIPPLE EFFECT
  ======================================== */
  document.querySelectorAll('.btn-primary, .btn-outline, .nav-cta, .cta-store-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: 0; height: 0;
        border-radius: 50%;
        background: rgba(255,255,255,0.25);
        left: ${x}px; top: ${y}px;
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: rippleAnim 0.6s ease-out forwards;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Inject ripple keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to {
        width: 200px;
        height: 200px;
        opacity: 0;
      }
    }
    .nav-link.active-link {
      color: var(--green) !important;
    }
    .nav-link.active-link::after {
      width: 100% !important;
    }
  `;
  document.head.appendChild(style);

  /* ========================================
     9. FEATURE CARDS – Tilt effect
  ======================================== */
  const featureCards = document.querySelectorAll('.feature-card');

  featureCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `
        translateY(-8px)
        rotateX(${y * -6}deg)
        rotateY(${x * 6}deg)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.4s ease';
      setTimeout(() => {
        card.style.transition = '';
      }, 400);
    });
  });

  /* ========================================
     10. COUNTER ANIMATION for hero stats
  ======================================== */
  const stats = document.querySelectorAll('.stat strong');

  const countTargets = {
    '50K+': { num: 50, suffix: 'K+' },
    '99.9%': { num: 99.9, suffix: '%' },
    '200+': { num: 200, suffix: '+' }
  };

  let countersDone = false;

  function animateCounter(el, target, suffix) {
    const duration = 1800;
    const start = performance.now();
    const isDecimal = target % 1 !== 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      el.textContent = isDecimal
        ? current.toFixed(1) + suffix
        : Math.floor(current) + suffix;

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersDone) {
        countersDone = true;
        stats.forEach(stat => {
          const text = stat.textContent.trim();
          const data = countTargets[text];
          if (data) animateCounter(stat, data.num, data.suffix);
        });
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsRow = document.querySelector('.hero-stats');
  if (statsRow) statsObserver.observe(statsRow);

  /* ========================================
     11. PROGRESS BAR pulse in mockup
  ======================================== */
  // Already handled via CSS animation

  /* ========================================
     12. INIT COMPLETE
  ======================================== */
  console.log('🚗 HassleFreeDrive – Ready to go!');

})();