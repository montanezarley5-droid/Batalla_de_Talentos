/* ============================================================
   BATALLA DE TALENTOS — script.js
   JavaScript Vanilla — sin frameworks
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     0. RESPETO A "PREFERS-REDUCED-MOTION"
     Si el usuario prefiere menos movimiento, se detiene el
     autoplay del carousel de la galería.
  ---------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    const galleryCarouselEl = document.getElementById('galeriaCarousel');
    if (galleryCarouselEl) {
      galleryCarouselEl.removeAttribute('data-bs-ride');
    }
  }

  /* ----------------------------------------------------------
     1. CURSOR PERSONALIZADO
     El punto sigue al mouse de inmediato; el anillo lo persigue
     con un pequeño retraso (lerp) para dar sensación de inercia.
  ---------------------------------------------------------- */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (cursorDot && cursorRing && window.matchMedia('(hover: hover)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function animateRing() {
      // Interpolación suave (lerp) para el efecto de inercia
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Agrandar el anillo sobre elementos interactivos
    const hoverTargets = document.querySelectorAll(
      'a, button, input, .stat-card, .carousel-item, .tag-chip'
    );
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hovering'));
    });
  }

  /* ----------------------------------------------------------
     2. NAVBAR: transparente al inicio, sólida al hacer scroll
  ---------------------------------------------------------- */
  const navbar = document.querySelector('.navbar-battle');
  if (navbar) {
    const toggleNavbar = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    toggleNavbar();
    window.addEventListener('scroll', toggleNavbar, { passive: true });
  }

  /* ----------------------------------------------------------
     3. MODO CLARO / OSCURO + LOCALSTORAGE
  ---------------------------------------------------------- */
  const THEME_KEY = 'batalla-talentos-theme';
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    themeToggleBtns.forEach((btn) => {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = theme === 'light' ? 'bi bi-moon-stars' : 'bi bi-sun';
      }
    });
  }

  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(savedTheme);

  themeToggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  });

  /* ----------------------------------------------------------
     4. ANIMACIONES DE ENTRADA AL SCROLL (Intersection Observer)
  ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  }

  /* ----------------------------------------------------------
     5. CONTADORES ANIMADOS (estadísticas)
  ---------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length) {
    const animateCount = (el) => {
      const target = parseInt(el.dataset.target, 10) || 0;
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        // Easing tipo "ease-out" para una desaceleración natural
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);
        el.textContent = `${value}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = `${target}${suffix}`;
        }
      }
      requestAnimationFrame(tick);
    };

    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    statNumbers.forEach((el) => statObserver.observe(el));
  }

  /* ----------------------------------------------------------
     6. CAMBIO DE IDIOMA (Bilingual Experience)
  ---------------------------------------------------------- */
  const langButtons = document.querySelectorAll('.lang-switch-shell button');
  const langPanels = document.querySelectorAll('.lang-panel');

  langButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;

      langButtons.forEach((b) => b.classList.toggle('active', b === btn));
      langPanels.forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.lang === lang);
      });
    });
  });

  /* ----------------------------------------------------------
     7. BOTÓN VOLVER AL INICIO
  ---------------------------------------------------------- */
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener(
      'scroll',
      () => {
        backToTopBtn.classList.toggle('is-visible', window.scrollY > 480);
      },
      { passive: true }
    );

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     8. SCROLL SUAVE PARA ENLACES DE ANCLA
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length > 1) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ----------------------------------------------------------
     9. TRANSICIÓN CINEMATOGRÁFICA ENTRE PÁGINAS
  ---------------------------------------------------------- */
  const overlay = document.querySelector('.page-transition-overlay');
  if (overlay) {
    // Revela el contenido al cargar la página
    requestAnimationFrame(() => {
      overlay.classList.remove('is-active');
    });

    document.querySelectorAll('a.page-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('http')) {
          e.preventDefault();
          overlay.classList.add('is-active');
          setTimeout(() => {
            window.location.href = href;
          }, 550);
        }
      });
    });
  }

  /* ----------------------------------------------------------
     10. GLOSARIO: BUSCADOR EN TIEMPO REAL
     (Solo se ejecuta si existen los elementos en la página)
  ---------------------------------------------------------- */
  const glossarySearch = document.getElementById('glossarySearch');
  const glossaryRows = document.querySelectorAll('.glossary-table tbody tr');
  const glossaryEmpty = document.querySelector('.glossary-empty');
  const glossaryCount = document.querySelector('.glossary-count');

  if (glossarySearch && glossaryRows.length) {
    const updateCount = (visibleCount) => {
      if (glossaryCount) {
        glossaryCount.textContent = `${visibleCount} / ${glossaryRows.length} términos`;
      }
    };

    updateCount(glossaryRows.length);

    glossarySearch.addEventListener('input', () => {
      const query = glossarySearch.value.trim().toLowerCase();
      let visibleCount = 0;

      glossaryRows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        const matches = text.includes(query);
        row.style.display = matches ? '' : 'none';
        if (matches) visibleCount += 1;
      });

      if (glossaryEmpty) {
        glossaryEmpty.classList.toggle('is-visible', visibleCount === 0);
      }
      updateCount(visibleCount);
    });
  }

});
