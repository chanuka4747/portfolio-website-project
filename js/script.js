/* ================================================================
   CHANUKA DILSHAN — PERSONAL PORTFOLIO
   js/script.js
   ================================================================ */

'use strict';

/* ----------------------------------------------------------------
   PROJECT DATA — Edit this object to update modal content
   ---------------------------------------------------------------- */

/* ================================================================
   PARTICLE CANVAS BACKGROUND
   ================================================================ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Respect prefers-reduced-motion
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    canvas.style.display = 'none';
    return;
  }

  let W, H, particles, mouse, animFrame;
  const MOBILE_BREAKPOINT = 600;

  /* --- Helpers --- */
  function isMobile() { return window.innerWidth <= MOBILE_BREAKPOINT; }

  function getParticleCount() { return isMobile() ? 40 : 90; }

  function getAccentColor() {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    return theme === 'dark' ? '56,189,248' : '2,132,199';
  }

  /* --- Particle constructor --- */
  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 2.5 + 1;
    this.alpha = Math.random() * 0.5 + 0.2;
  };

  Particle.prototype.update = function () {
    // Gentle mouse influence
    if (mouse) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        this.vx += dx * 0.0002;
        this.vy += dy * 0.0002;
      }
    }

    // Velocity clamping
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > 0.8) {
      this.vx = (this.vx / speed) * 0.8;
      this.vy = (this.vy / speed) * 0.8;
    }

    this.x += this.vx;
    this.y += this.vy;

    // Wrap around edges
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
  };

  /* --- Setup --- */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initParticleArray() {
    const count = getParticleCount();
    particles = Array.from({ length: count }, () => new Particle());
  }

  /* --- Draw loop --- */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    const color = getAccentColor();

    // Draw connection lines first
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = isMobile() ? 80 : 120;

        if (dist < maxDist) {
          const lineAlpha = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${color},${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${p.alpha})`;
      ctx.fill();

      p.update();
    });

    animFrame = requestAnimationFrame(draw);
  }

  /* --- Events --- */
  window.addEventListener('resize', () => {
    resize();
    initParticleArray();
  }, { passive: true });

  window.addEventListener('mousemove', e => {
    mouse = { x: e.clientX, y: e.clientY };
  }, { passive: true });

  window.addEventListener('mouseleave', () => { mouse = null; }, { passive: true });

  /* --- Init --- */
  resize();
  initParticleArray();
  draw();

  // Re-color when theme changes (listen for attribute mutation)
  const themeObserver = new MutationObserver(() => { /* color read in draw() */ });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
})();


/* ================================================================
   THEME TOGGLE
   ================================================================ */
(function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const root = document.documentElement;

  // Load saved preference; default to dark
  const saved = localStorage.getItem('cd-theme') || 'dark';
  applyTheme(saved);

  if (btn) {
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    root.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    localStorage.setItem('cd-theme', theme);

    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    if (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('title',      theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }
})();


/* ================================================================
   NAVIGATION — scrolled class, active link, hamburger
   ================================================================ */
(function initNav() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  const navLinks  = document.querySelectorAll('.nav-link[data-section]');
  const sections  = [];

  /* --- Map sections --- */
  navLinks.forEach(link => {
    const id = link.getAttribute('data-section');
    const section = document.getElementById(id);
    if (section) sections.push({ link, section });
  });

  /* --- Scrolled class --- */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (navbar) {
          navbar.classList.toggle('scrolled', window.scrollY > 20);
        }
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* --- Active link on scroll --- */
  function updateActiveLink() {
    const scrollY = window.scrollY + 120;

    let active = null;
    sections.forEach(({ section }) => {
      if (section.offsetTop <= scrollY) active = section.id;
    });

    navLinks.forEach(link => {
      const isActive = link.getAttribute('data-section') === active;
      link.classList.toggle('active', isActive);
    });
  }

  /* --- Hamburger toggle --- */
  function setMenuOpen(open) {
    if (!hamburger || !navMenu) return;
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    navMenu.classList.toggle('open', open);
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('open');
      setMenuOpen(!isOpen);
    });
  }

  /* Close mobile menu when a nav link is clicked */
  navMenu && navMenu.addEventListener('click', e => {
    if (e.target.closest('.nav-link')) setMenuOpen(false);
  });

  /* Close mobile menu when clicking outside */
  document.addEventListener('click', e => {
    if (navMenu && hamburger &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      setMenuOpen(false);
    }
  });

  /* Smooth-scroll for all in-page anchor links */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = navbar ? navbar.offsetHeight : 70;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();


/* ================================================================
   HERO TYPING EFFECT
   ================================================================ */
(function initTyping() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'BICT Undergraduate',
    'Aspiring UI/UX Designer',
    'Aspiring Software Engineer',
    'Web Development Enthusiast',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  const TYPING_SPEED  = 70;
  const DELETE_SPEED  = 40;
  const PAUSE_AFTER   = 1800;
  const PAUSE_BEFORE  = 400;

  // Respect reduced-motion: just show first phrase statically
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = phrases[0];
    return;
  }

  function type() {
    if (isPaused) return;

    const current = phrases[phraseIndex];

    if (!isDeleting) {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        isPaused = true;
        setTimeout(() => { isPaused = false; isDeleting = true; }, PAUSE_AFTER);
      }
    } else {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        isPaused = true;
        setTimeout(() => { isPaused = false; }, PAUSE_BEFORE);
      }
    }

    setTimeout(type, isDeleting ? DELETE_SPEED : TYPING_SPEED);
  }

  type();
})();


/* ================================================================
   SCROLL-REVEAL  (IntersectionObserver)
   ================================================================ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  // No animation for reduced motion — mark all as revealed immediately
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute('data-reveal-delay') || '0', 10);
        setTimeout(() => entry.target.classList.add('revealed'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
})();


/* ================================================================
   ANIMATED STATISTICS (count-up, fires once on viewport entry)
   ================================================================ */
(function initStats() {
  const statCards = document.querySelectorAll('[data-stat]');
  if (!statCards.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function countUp(el, target, suffix, duration) {
    if (reducedMotion) { el.textContent = target + suffix; return; }

    const start = performance.now();
    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card   = entry.target;
        const numEl  = card.querySelector('.stat-number');
        if (!numEl) return;
        const target = parseInt(numEl.getAttribute('data-target') || '0', 10);
        const suffix = numEl.getAttribute('data-suffix') || '';
        countUp(numEl, target, suffix, 1200);
        observer.unobserve(card);
      }
    });
  }, { threshold: 0.5 });

  statCards.forEach(card => observer.observe(card));
})();


/* ================================================================
   SKILL PROGRESS BARS (animate on scroll)
   ================================================================ */
(function initSkillBars() {
  const tracks = document.querySelectorAll('.progress-track');
  if (!tracks.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const track = entry.target;
        const bar   = track.querySelector('.progress-bar');
        if (!bar) return;
        const width = parseInt(bar.getAttribute('data-width') || '0', 10);

        if (reducedMotion) {
          bar.style.width = width + '%';
        } else {
          // Small delay then animate
          requestAnimationFrame(() => {
            bar.style.width = width + '%';
          });
        }

        observer.unobserve(track);
      }
    });
  }, { threshold: 0.4 });

  tracks.forEach(track => observer.observe(track));
})();


/* ================================================================
   PROJECT FILTERING
   ================================================================ */
(function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.project-card');
  const grid       = document.getElementById('projectGrid');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update button states
      filterBtns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });

      // Filter cards — use a CSS class approach for clean show/hide
      // We need to re-flow the grid, so toggle visibility carefully
      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        const show = filter === 'all' || category === filter;

        if (show) {
          card.style.display = '';
          // Small timeout so 'display:flex' applies before the transition
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = '';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          // After transition, hide from layout
          setTimeout(() => {
            if (card.style.opacity === '0') card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Initialize — set transitions
  cards.forEach(card => {
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });
})();


/* ================================================================
   PROJECT MODAL
   ================================================================ */
(function initModal() {
  const overlay    = document.getElementById('projectModal');
  const closeBtn   = document.getElementById('modalClose');
  const content    = document.getElementById('modalContent');
  const viewBtns   = document.querySelectorAll('.view-details-btn');

  if (!overlay || !content) return;

  let lastFocused = null;

  /* --- Focus trap --- */
  function getFocusable() {
    return Array.from(overlay.querySelectorAll(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
    ));
  }

  function trapFocus(e) {
    const focusable = getFocusable();
    if (!focusable.length) return;

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    }

    if (e.key === 'Escape') closeModal();
  }

  /* --- Build modal HTML --- */
  function buildModal(project) {
    const techBadges = project.tech
      .map(t => `<span class="tech-badge">${escapeHtml(t)}</span>`)
      .join('');

    const featureItems = project.features
      .map(f => `<li>${escapeHtml(f)}</li>`)
      .join('');

    return `
      <img
        src="${escapeHtml(project.image)}"
        alt="${escapeHtml(project.imageAlt)}"
        class="modal-img"
        loading="lazy"
        onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'680\\' height=\\'340\\'%3E%3Crect width=\\'680\\' height=\\'340\\' fill=\\'%231C2541\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-family=\\'Arial\\' font-size=\\'20\\' fill=\\'%2338BDF8\\'%3E${escapeHtml(project.title)}%3C/text%3E%3C/svg%3E'"
      />
      <span class="modal-category">${escapeHtml(project.category)}</span>
      <h2 class="modal-title" id="modalTitle">${escapeHtml(project.title)}</h2>
      <p class="modal-desc">${escapeHtml(project.desc)}</p>

      <p class="modal-section-heading">Technologies Used</p>
      <div class="modal-tech">${techBadges}</div>

      <p class="modal-section-heading">Key Features</p>
      <ul class="modal-features">${featureItems}</ul>
    `;
  }

  /* --- Open modal --- */
  function openModal(index) {
    const project = PROJECTS[index];
    if (!project) return;

    content.innerHTML = buildModal(project);
    overlay.removeAttribute('hidden');

    // Prevent background scroll
    document.body.style.overflow = 'hidden';

    // Set focus
    requestAnimationFrame(() => {
      const focusable = getFocusable();
      if (focusable.length) focusable[0].focus();
    });

    // Bind events
    document.addEventListener('keydown', trapFocus);
    overlay.addEventListener('click', overlayClick);
  }

  /* --- Close modal --- */
  function closeModal() {
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', trapFocus);
    overlay.removeEventListener('click', overlayClick);

    // Return focus to triggering element
    if (lastFocused) { lastFocused.focus(); lastFocused = null; }
  }

  /* --- Backdrop click --- */
  function overlayClick(e) {
    if (e.target === overlay) closeModal();
  }

  /* --- Bind view-detail buttons --- */
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      lastFocused = btn;
      const index = parseInt(btn.getAttribute('data-project') || '0', 10);
      openModal(index);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
})();


/* ================================================================
   CONTACT FORM — validation + mailto submission
   ================================================================ */
(function initContactForm() {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (!form) return;

  /* --- Field config --- */
  const fields = [
    {
      id:       'name',
      errorId:  'name-error',
      validate: v => {
        if (!v) return 'Please enter your full name.';
        if (v.length < 2) return 'Name must be at least 2 characters.';
        return '';
      },
    },
    {
      id:       'email',
      errorId:  'email-error',
      validate: v => {
        if (!v) return 'Please enter your email address.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address.';
        return '';
      },
    },
    {
      id:       'subject',
      errorId:  'subject-error',
      validate: v => {
        if (!v) return 'Please enter a subject.';
        if (v.length < 3) return 'Subject must be at least 3 characters.';
        return '';
      },
    },
    {
      id:       'message',
      errorId:  'message-error',
      validate: v => {
        if (!v) return 'Please enter your message.';
        if (v.length < 10) return 'Message must be at least 10 characters.';
        return '';
      },
    },
  ];

  /* --- Show / clear error --- */
  function setError(fieldCfg, message) {
    const input = document.getElementById(fieldCfg.id);
    const errorEl = document.getElementById(fieldCfg.errorId);
    if (input)   input.classList.toggle('error', Boolean(message));
    if (errorEl) errorEl.textContent = message;
  }

  /* --- Clear a field error on input --- */
  fields.forEach(cfg => {
    const input = document.getElementById(cfg.id);
    if (input) {
      input.addEventListener('input', () => setError(cfg, ''));
      input.addEventListener('blur',  () => {
        const val = input.value.trim();
        setError(cfg, cfg.validate(val));
      });
    }
  });

  /* --- Validate all --- */
  function validateAll() {
    let valid = true;
    fields.forEach(cfg => {
      const input = document.getElementById(cfg.id);
      if (!input) return;
      const error = cfg.validate(input.value.trim());
      setError(cfg, error);
      if (error) valid = false;
    });
    return valid;
  }

  /* --- Show status message --- */
  function showStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className   = 'form-status ' + type;
  }

  /* --- Submit handler --- */
  form.addEventListener('submit', e => {
    e.preventDefault();

    if (!validateAll()) return;

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Build mailto URI
    const body    = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailto  =
      `mailto:chanukad513@gmail.com` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    // Open in default mail client
    window.location.href = mailto;

    // Show user-friendly status message
    showStatus(
      '✓ Your email client has opened with the message pre-filled. Please send it from there.',
      'success'
    );

    // Disable submit button briefly to prevent double-click
    if (submitBtn) {
      submitBtn.disabled = true;
      setTimeout(() => { submitBtn.disabled = false; }, 4000);
    }
  });
})();


/* ================================================================
   BACK TO TOP
   ================================================================ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ================================================================
   UTILITY — HTML entity escaping (for user-generated / data strings)
   ================================================================ */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}
