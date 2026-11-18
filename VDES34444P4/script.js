/* ============================
   Nightmare Escape — Interactive Script
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
  // ── Theme Toggle ──
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  function applyTheme(theme, animate) {
    if (animate) html.classList.add('theme-switching');
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      if (themeToggle) {
        themeToggle.textContent = '\u2600\uFE0F'; // ☀️
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
      }
    } else {
      html.removeAttribute('data-theme');
      if (themeToggle) {
        themeToggle.textContent = '\uD83C\uDF19'; // 🌙
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
      }
    }
    if (animate) setTimeout(() => html.classList.remove('theme-switching'), 350);
  }

  // Load saved preference — default is light
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme, false);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = html.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme, true);
    });
  }

  // ── Mobile Nav Toggle ──
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // ── Scrolled Nav Background ──
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Active Nav Link Highlighting ──
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav__links a');

  const highlightNav = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  // ── Tabs ──
  const tabButtons = document.querySelectorAll('.tabs__btn');
  const tabPanels = document.querySelectorAll('.tabs__panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabButtons.forEach(b => b.classList.remove('tabs__btn--active'));
      btn.classList.add('tabs__btn--active');

      tabPanels.forEach(panel => {
        panel.classList.remove('tabs__panel--active');
        if (panel.id === 'tab-' + target) {
          panel.classList.add('tabs__panel--active');
        }
      });
    });
  });

  // ── Accordion ──
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('accordion-item--open');

      // Close all
      accordionItems.forEach(i => i.classList.remove('accordion-item--open'));

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('accordion-item--open');
      }
    });
  });

  // ── Platform View Toggle (Grid ↔ Accordion) ──
  const viewBtns = document.querySelectorAll('.cs-view-btn');
  const platformGrid = document.getElementById('platformGrid');
  const platformAccordion = document.getElementById('platformAccordion');

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('cs-view-btn--active'));
      btn.classList.add('cs-view-btn--active');
      const view = btn.dataset.view;
      if (view === 'grid') {
        platformGrid.style.display = '';
        platformAccordion.style.display = 'none';
      } else {
        platformGrid.style.display = 'none';
        platformAccordion.style.display = '';
      }
    });
  });

  // ── Case Study Filters ──
  const filterBtns = document.querySelectorAll('.cs-filter-btn');
  const archiveItems = document.querySelectorAll('.cs-archive-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      archiveItems.forEach(item => {
        if (filter === 'all') {
          item.classList.remove('hidden');
        } else {
          const matchProject = item.dataset.project === filter;
          const matchType = item.dataset.type === filter;
          item.classList.toggle('hidden', !(matchProject || matchType));
        }
      });
    });
  });

  // ── Scroll Reveal ──
  const revealElements = document.querySelectorAll(
    '.card, .color-swatch, .theme-card, .arc-step, .setting-item, ' +
    '.type-sample, .timeline__item, .mgmt-badge, .poster-mock, ' +
    '.ai-reflection, .dead-ends, .rabbit-holes .card, .gf-step, ' +
    '.cs-meta-item, .cs-file-item, .cs-prompt-block'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => observer.observe(el));

  // ── Staggered Reveal for Grids ──
  document.querySelectorAll('.card-grid, .color-grid, .theme-grid, .setting-list, .cs-meta-grid').forEach(grid => {
    const children = grid.children;
    Array.from(children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  // ── Lightbox ──
  const lightbox = document.getElementById('csLightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('.cs-lightbox__img');
    const lbCaption = lightbox.querySelector('.cs-lightbox__caption');
    const lbCounter = lightbox.querySelector('.cs-lightbox__counter');
    const lbProgress = lightbox.querySelector('.cs-lightbox__progress');
    const lbPrev = lightbox.querySelector('.cs-lightbox__nav--prev');
    const lbNext = lightbox.querySelector('.cs-lightbox__nav--next');
    const lbClose = lightbox.querySelector('.cs-lightbox__close');

    let lbImages = [];
    let lbIndex = 0;

    function collectImages() {
      lbImages = [];
      document.querySelectorAll(
        '.accordion-body img, .cs-plat-card__imgs img, .cs-platform-imgs img, ' +
        '.cs-archive-item img, .split__visual img, .tabs__panel .card img'
      ).forEach(img => {
        if (img.naturalWidth > 0 || img.complete) {
          lbImages.push({
            src: img.src,
            alt: img.alt || '',
            caption: (img.closest('figure') && img.closest('figure').querySelector('figcaption'))
              ? img.closest('figure').querySelector('figcaption').textContent
              : img.alt || ''
          });
        }
      });
    }

    function buildDots() {
      lbProgress.innerHTML = '';
      lbImages.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'cs-lightbox__dot' + (i === lbIndex ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        lbProgress.appendChild(dot);
      });
    }

    function updateDots() {
      lbProgress.querySelectorAll('.cs-lightbox__dot').forEach((d, i) => {
        d.classList.toggle('active', i === lbIndex);
      });
    }

    function show(index) {
      lbIndex = index;
      const item = lbImages[lbIndex];
      lbImg.src = item.src;
      lbImg.alt = item.alt;
      lbCaption.textContent = item.caption;
      lbCounter.textContent = (lbIndex + 1) + ' / ' + lbImages.length;
      updateDots();
    }

    function goTo(i) {
      if (i < 0) i = lbImages.length - 1;
      if (i >= lbImages.length) i = 0;
      show(i);
    }

    function openLightbox(imgEl) {
      collectImages();
      const src = imgEl.src;
      let idx = lbImages.findIndex(item => item.src === src);
      if (idx === -1) idx = 0;
      buildDots();
      show(idx);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Delegate click on all page images
    document.addEventListener('click', (e) => {
      const img = e.target.closest(
        '.accordion-body img, .cs-plat-card__imgs img, .cs-platform-imgs img, ' +
        '.cs-archive-item img, .split__visual img, .tabs__panel .card img'
      );
      if (img) {
        e.preventDefault();
        openLightbox(img);
      }
    });

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', () => goTo(lbIndex - 1));
    lbNext.addEventListener('click', () => goTo(lbIndex + 1));

    // Click backdrop to close
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard: Esc / Left / Right
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goTo(lbIndex - 1);
      if (e.key === 'ArrowRight') goTo(lbIndex + 1);
    });

    // Add pointer cursor to all lightbox-able images
    document.querySelectorAll(
      '.accordion-body img, .cs-plat-card__imgs img, .cs-platform-imgs img, ' +
      '.cs-archive-item img, .split__visual img, .tabs__panel .card img'
    ).forEach(img => { img.style.cursor = 'zoom-in'; });
  }
});
