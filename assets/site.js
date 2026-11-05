/* ===== Shared site behaviour: theme, i18n, header, reveal, filters ===== */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  /* ---- Theme ---- */
  var KEY = 'siteTheme';
  var btn = document.getElementById('themeToggle');
  function applyTheme(t, animate) {
    var duration = Math.round(80 + Math.random() * 190);
    if (animate) {
      root.style.setProperty('--theme-duration', duration + 'ms');
      root.classList.add('theme-transition');
      clearTimeout(root._themeTransitionTimer);
      root._themeTransitionTimer = setTimeout(function () { root.classList.remove('theme-transition'); }, duration);
    }
    root.setAttribute('data-theme', t);
    if (btn) btn.textContent = t === 'dark' ? '☀' : '☾';
    try { localStorage.setItem(KEY, t); } catch (_) {}
  }
  var saved; try { saved = localStorage.getItem(KEY); } catch (_) {}
  if (saved) applyTheme(saved);
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches) applyTheme('dark');
  if (btn) btn.addEventListener('click', function () { applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true); });

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
        if (label) {
          label.setAttribute('data-i18n', v.hasAttribute('data-final') ? 'cw.liveFinal' : 'cw.live');
          label.setAttribute('data-i18n-v', v.getAttribute('data-label'));
          translate(label, dict(currentLang));
        }
      });
    });
  }

  /* ---- Spotify: cover art first, the player loads only when asked ---- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-embed]');
    if (!b) return;
    var box = b.closest('.sp-facade'), f = document.createElement('iframe');
    f.className = 'spotify' + (box.classList.contains('sp-facade--artist') ? ' artist-embed' : '');
    f.src = b.getAttribute('data-embed');
    f.title = b.getAttribute('data-embed-title') || 'Spotify';
    f.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    box.replaceWith(f);
    f.focus();
  });

  /* ---- i18n ---- */
  var COMMON = {
    en: { 'art.credit': 'Cover art by ', 'art.name': 'TaTa (tataqwq233) ↗', 'sp.play': 'Play here', 'sp.open': 'Open in Spotify ↗', 'sp.artist': 'Load the full catalogue', 'nav.work': 'Work', 'nav.music': 'Music', 'nav.about': 'About', 'nav.contact': 'Contact', 'nav.resume': 'Resume',
          'nav.home': 'Home', 'foot.email': 'Email', 'foot.top': 'Back to top', 'skip': 'Skip to content', 'theme': 'Toggle dark mode' },
    'zh-CN': { 'art.credit': '封面插画：', 'art.name': '塔塔（tataqwq233）↗', 'sp.play': '在此播放', 'sp.open': '在 Spotify 打开 ↗', 'sp.artist': '加载完整目录', 'nav.work': '作品', 'nav.music': '音乐', 'nav.about': '关于', 'nav.contact': '联系', 'nav.resume': '简历',
          'nav.home': '首页', 'foot.email': '邮箱', 'foot.top': '回到顶部', 'skip': '跳到正文', 'theme': '切换深色模式' },
    'zh-TW': { 'art.credit': '封面插畫：', 'art.name': '塔塔（tataqwq233）↗', 'sp.play': '在此播放', 'sp.open': '在 Spotify 開啟 ↗', 'sp.artist': '載入完整目錄', 'nav.work': '作品', 'nav.music': '音樂', 'nav.about': '關於', 'nav.contact': '聯絡', 'nav.resume': '履歷',
          'nav.home': '首頁', 'foot.email': '信箱', 'foot.top': '回到頂部', 'skip': '跳到正文', 'theme': '切換深色模式' },
    ja: { 'art.credit': 'ジャケットイラスト：', 'art.name': '塔塔（tataqwq233）↗', 'sp.play': 'ここで再生', 'sp.open': 'Spotify で開く ↗', 'sp.artist': '全カタログを読み込む', 'nav.work': '作品', 'nav.music': '音楽', 'nav.about': '紹介', 'nav.contact': '連絡', 'nav.resume': '履歴書',
          'nav.home': 'ホーム', 'foot.email': 'メール', 'foot.top': 'トップへ', 'skip': '本文へ移動', 'theme': 'ダークモード切替' },
    fr: { 'art.credit': 'Pochettes illustrées par ', 'art.name': 'TaTa (tataqwq233) ↗', 'sp.play': 'Écouter ici', 'sp.open': 'Ouvrir dans Spotify ↗', 'sp.artist': 'Charger le catalogue complet', 'nav.work': 'Travaux', 'nav.music': 'Musique', 'nav.about': 'À propos', 'nav.contact': 'Contact', 'nav.resume': 'CV',
          'nav.home': 'Accueil', 'foot.email': 'Courriel', 'foot.top': 'Haut de page', 'skip': 'Aller au contenu', 'theme': 'Basculer le mode sombre' },
    de: { 'art.credit': 'Cover-Illustrationen von ', 'art.name': 'TaTa (tataqwq233) ↗', 'sp.play': 'Hier abspielen', 'sp.open': 'In Spotify öffnen ↗', 'sp.artist': 'Gesamten Katalog laden', 'nav.work': 'Arbeiten', 'nav.music': 'Musik', 'nav.about': 'Über mich', 'nav.contact': 'Kontakt', 'nav.resume': 'Lebenslauf',
          'nav.home': 'Start', 'foot.email': 'E-Mail', 'foot.top': 'Nach oben', 'skip': 'Zum Inhalt springen', 'theme': 'Dunkelmodus umschalten' }
  };
  var TAGS = { 'zh-CN': 'zh-Hans', 'zh-TW': 'zh-Hant' };
  var PAGE = window.PAGE_T || {};
  function dict(lang) {
    var d = {};
    var src = [COMMON.en, PAGE.en || {}, COMMON[lang] || {}, PAGE[lang] || {}];
    src.forEach(function (s) { Object.keys(s).forEach(function (k) { d[k] = s[k]; }); });
    return d;
  }
  /* the markup's own (English) text is the fallback for keys a language lacks;
     data-i18n-v fills a {v} slot, e.g. 'Open {v} (final) ↗' with V17 */
  function translate(el, d) {
    var k = el.getAttribute('data-i18n');
    if (!el.hasAttribute('data-i18n-en')) el.setAttribute('data-i18n-en', el.textContent);
    var s = d[k] != null ? d[k] : el.getAttribute('data-i18n-en');
    var v = el.getAttribute('data-i18n-v');
    el.textContent = v == null ? s : s.replace('{v}', v);
  }
  var currentLang = 'en';
  function applyLang(lang) {
    if (!COMMON[lang]) lang = 'en';
    currentLang = lang;
    var d = dict(lang), tag = TAGS[lang] || lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) { translate(el, d); });
    /* data-i18n-alt: img alt, iframe title, otherwise aria-label */
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var a = el.tagName === 'IMG' ? 'alt' : el.tagName === 'IFRAME' ? 'title' : 'aria-label';
      if (!el.hasAttribute('data-i18n-alt-en')) el.setAttribute('data-i18n-alt-en', el.getAttribute(a) || '');
      var k = el.getAttribute('data-i18n-alt');
      el.setAttribute(a, d[k] != null ? d[k] : el.getAttribute('data-i18n-alt-en'));
    });
    /* data-i18n-date="2026-01" → "Jan 2026" / "2026年1月" / "janv. 2026" */
    document.querySelectorAll('[data-i18n-date]').forEach(function (el) {
      var p = el.getAttribute('data-i18n-date').split('-');
      try { el.textContent = new Intl.DateTimeFormat(tag, { year: 'numeric', month: 'short' }).format(new Date(+p[0], p[1] - 1, 1)); } catch (_) {}
    });
    if (!root.hasAttribute('data-title-en')) root.setAttribute('data-title-en', document.title);
    document.title = d['page.title'] != null ? d['page.title'] : root.getAttribute('data-title-en');
    document.querySelectorAll('.lang-sel').forEach(function (s) { s.value = lang; });
    root.setAttribute('lang', tag);
    try { localStorage.setItem('siteLang', lang); } catch (_) {}
  }
  document.querySelectorAll('.lang-sel').forEach(function (s) {
    s.addEventListener('change', function () { applyLang(s.value); });
  });
  try { var sl = localStorage.getItem('siteLang'); if (sl && sl !== 'en' && COMMON[sl]) applyLang(sl); } catch (_) {}
  window.siteI18n = { apply: applyLang, refresh: function () { applyLang(currentLang); }, current: function () { return currentLang; } };
})();
