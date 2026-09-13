/* ===== Shared site behaviour: theme, i18n, header, reveal, filters ===== */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  /* ---- Theme ---- */
  var KEY = 'siteTheme';
  var btn = document.getElementById('themeToggle');
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    if (btn) btn.textContent = t === 'dark' ? '☀' : '☾';
    try { localStorage.setItem(KEY, t); } catch (_) {}
  }
  var saved; try { saved = localStorage.getItem(KEY); } catch (_) {}
  if (saved) applyTheme(saved);
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches) applyTheme('dark');
  if (btn) btn.addEventListener('click', function () { applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); });

  /* ---- Year ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- Header ---- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 10); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Reveal ---- */
  var items = document.querySelectorAll('.reveal');
  if (items.length && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    items.forEach(function (s) { obs.observe(s); });
  } else {
    items.forEach(function (s) { s.classList.add('is-visible'); });
  }

  /* ---- Category filter chips ---- */
  document.querySelectorAll('[data-filter-group]').forEach(function (group) {
    var chips = group.querySelectorAll('.chip');
    var scope = document.querySelector(group.getAttribute('data-filter-group')) || document;
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var want = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.classList.toggle('active', c === chip); });
        scope.querySelectorAll('[data-cat]').forEach(function (el) {
          var cats = (el.getAttribute('data-cat') || '').split(/\s+/);
          el.classList.toggle('is-hidden', want !== 'all' && cats.indexOf(want) === -1);
        });
        /* hide groups whose every child is now hidden */
        scope.querySelectorAll('[data-group]').forEach(function (g) {
          var visible = g.querySelectorAll('[data-cat]:not(.is-hidden)').length;
          g.classList.toggle('is-hidden', visible === 0);
        });
      });
    });
  });

  /* ---- Version switcher (client work preview) ---- */
  var iframe = document.getElementById('cwPreview');
  if (iframe) {
    var label = document.getElementById('cwLabel');
    var vers = document.querySelectorAll('.version[data-src]');
    vers.forEach(function (v) {
      v.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        vers.forEach(function (b) { b.classList.remove('active'); });
        v.classList.add('active');
        iframe.src = v.getAttribute('data-src');
        if (label) label.textContent = 'Live preview — ' + v.getAttribute('data-label');
      });
    });
  }

  /* ---- i18n ---- */
  var COMMON = {
    en: { 'nav.work': 'Work', 'nav.music': 'Music', 'nav.about': 'About', 'nav.contact': 'Contact', 'nav.resume': 'Resume',
          'foot.email': 'Email', 'foot.top': 'Back to top' },
    'zh-CN': { 'nav.work': '作品', 'nav.music': '音乐', 'nav.about': '关于', 'nav.contact': '联系', 'nav.resume': '简历',
          'foot.email': '邮箱', 'foot.top': '回到顶部' },
    'zh-TW': { 'nav.work': '作品', 'nav.music': '音樂', 'nav.about': '關於', 'nav.contact': '聯絡', 'nav.resume': '簡歷',
          'foot.email': '信箱', 'foot.top': '回到頂部' },
    ja: { 'nav.work': '作品', 'nav.music': '音楽', 'nav.about': '紹介', 'nav.contact': '連絡', 'nav.resume': '履歴書',
          'foot.email': 'メール', 'foot.top': 'トップへ' },
    fr: { 'nav.work': 'Travaux', 'nav.music': 'Musique', 'nav.about': 'À propos', 'nav.contact': 'Contact', 'nav.resume': 'CV',
          'foot.email': 'Courriel', 'foot.top': 'Haut de page' }
  };
  var PAGE = window.PAGE_T || {};
  function dict(lang) {
    var d = {};
    var src = [COMMON.en, PAGE.en || {}, COMMON[lang] || {}, PAGE[lang] || {}];
    src.forEach(function (s) { Object.keys(s).forEach(function (k) { d[k] = s[k]; }); });
    return d;
  }
  var currentLang = 'en';
  function applyLang(lang) {
    if (!COMMON[lang]) lang = 'en';
    currentLang = lang;
    var d = dict(lang);
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (d[k] != null) el.textContent = d[k];
    });
    document.querySelectorAll('.lang-sel').forEach(function (s) { s.value = lang; });
    root.setAttribute('lang', lang === 'zh-CN' ? 'zh-Hans' : lang === 'zh-TW' ? 'zh-Hant' : lang);
    try { localStorage.setItem('siteLang', lang); } catch (_) {}
  }
  document.querySelectorAll('.lang-sel').forEach(function (s) {
    s.addEventListener('change', function () { applyLang(s.value); });
  });
  try { var sl = localStorage.getItem('siteLang'); if (sl && sl !== 'en' && COMMON[sl]) applyLang(sl); } catch (_) {}
  window.siteI18n = { apply: applyLang, refresh: function () { applyLang(currentLang); }, current: function () { return currentLang; } };
})();
