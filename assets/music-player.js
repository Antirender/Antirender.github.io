/* Floating player for Dear Deer.
   <html data-music-mode> sets the page rule: "autoplay" on Work and Music, "paused" on Home.
   During one visit the listener's choice wins: a pause or hide carries across pages,
   and the song continues from the same position. Closing the tab starts a new visit. */
(function () {
  var mode = document.documentElement.getAttribute('data-music-mode');
  if (!mode) return;

  var TRACK = {
    title: 'Dear Deer',
    src: 'assets/audio/DearDeer.m4a',
    cover: 'image/tracks/1x9cwZclgWFJTPFpwgvHFd.webp',
    spotify: 'https://open.spotify.com/track/1x9cwZclgWFJTPFpwgvHFd',
    seconds: 203
  };
  var VOLUME = 0.5;
  var KEY = 'siteMusic';
  /* Browsers unlock sound on different events: mouse on pointerdown, touch on pointerup or touchend. */
  var GESTURES = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'];
  var ICON = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13l11-6.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/></svg>'
  };
  var TEXT = {
    en: { playing: 'Now playing', paused: 'Paused', play: 'Play Dear Deer', pause: 'Pause Dear Deer', hide: 'Hide player', spotify: 'Open Dear Deer on Spotify', region: 'Music player' },
    'zh-CN': { playing: '正在播放', paused: '已暂停', play: '播放 Dear Deer', pause: '暂停 Dear Deer', hide: '隐藏播放器', spotify: '在 Spotify 打开 Dear Deer', region: '音乐播放器' },
    'zh-TW': { playing: '正在播放', paused: '已暫停', play: '播放 Dear Deer', pause: '暫停 Dear Deer', hide: '隱藏播放器', spotify: '在 Spotify 開啟 Dear Deer', region: '音樂播放器' },
    ja: { playing: '再生中', paused: '一時停止中', play: 'Dear Deer を再生', pause: 'Dear Deer を一時停止', hide: 'プレーヤーを隠す', spotify: 'Spotify で Dear Deer を開く', region: '音楽プレーヤー' },
    fr: { playing: 'En lecture', paused: 'En pause', play: 'Lire Dear Deer', pause: 'Mettre Dear Deer en pause', hide: 'Masquer le lecteur', spotify: 'Ouvrir Dear Deer sur Spotify', region: 'Lecteur de musique' },
    de: { playing: 'Läuft gerade', paused: 'Pausiert', play: 'Dear Deer abspielen', pause: 'Dear Deer pausieren', hide: 'Player ausblenden', spotify: 'Dear Deer auf Spotify öffnen', region: 'Musikplayer' }
  };

  function read() { try { return JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch (_) { return {}; } }
  var saved = read(); /* { t: seconds, off: paused by the listener, hidden: closed by the listener } */
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(saved)); } catch (_) {} }
  if (saved.hidden) return;

  var root = document.createElement('aside');
  root.className = 'music-player';
  root.id = 'siteMusicPlayer';
  root.innerHTML =
    '<div class="mp-panel">' +
      '<span class="mp-meta"><span class="mp-status"></span><span class="mp-time"></span></span>' +
      '<strong class="mp-title">' + TRACK.title + '</strong>' +
      '<span class="mp-credit"><span data-i18n="art.credit">Cover art by </span><a href="https://tataqwq233.carrd.co" target="_blank" rel="noopener" data-i18n="art.name">TaTa (tataqwq233) ↗</a></span>' +
    '</div>' +
    '<div class="mp-controls">' +
      '<a class="mp-link" href="' + TRACK.spotify + '" target="_blank" rel="noopener">Spotify ↗</a>' +
      '<button class="mp-hide" type="button">' + ICON.close + '</button>' +
    '</div>' +
    '<button class="mp-disc" type="button"><img src="' + TRACK.cover + '" alt="" width="120" height="120"><span class="mp-icon"></span></button>' +
    '<audio></audio>';
  document.body.appendChild(root);

  var audio = root.querySelector('audio');
  var disc = root.querySelector('.mp-disc');
  var icon = root.querySelector('.mp-icon');
  var statusEl = root.querySelector('.mp-status');
  var timeEl = root.querySelector('.mp-time');
  var hideBtn = root.querySelector('.mp-hide');
  var link = root.querySelector('.mp-link');
  var select = document.querySelector('.lang-sel');
  var armed = false;
  var lastSave = 0;
  var openTimer;

  audio.loop = true;
  audio.volume = VOLUME;
  /* Home downloads nothing until someone presses play. */
  audio.preload = mode === 'autoplay' ? 'auto' : 'none';
  audio.src = TRACK.src;
  if (saved.t) audio.currentTime = saved.t;

  function text() {
    var lang = select && select.value;
    return TEXT[lang] || TEXT.en;
  }
  function renderTime() {
    var total = audio.duration > 0 && isFinite(audio.duration) ? audio.duration : TRACK.seconds;
    var left = Math.max(0, Math.ceil(total - audio.currentTime));
    timeEl.textContent = Math.floor(left / 60) + ':' + ('0' + (left % 60)).slice(-2);
  }
  function render() {
    var t = text();
    var playing = !audio.paused;
    root.classList.toggle('is-playing', playing);
    root.setAttribute('aria-label', t.region);
    statusEl.textContent = playing ? t.playing : t.paused;
    disc.setAttribute('aria-label', playing ? t.pause : t.play);
    icon.innerHTML = playing ? ICON.pause : ICON.play;
    hideBtn.setAttribute('aria-label', t.hide);
    link.setAttribute('aria-label', t.spotify);
    renderTime();
  }

  function start() {
    var p = audio.play();
    return p && p.then ? p : Promise.resolve();
  }
  function arm() {
    if (armed || saved.off) return;
    armed = true;
    GESTURES.forEach(function (g) { document.addEventListener(g, onGesture, true); });
  }
  function disarm() {
    if (!armed) return;
    armed = false;
    GESTURES.forEach(function (g) { document.removeEventListener(g, onGesture, true); });
  }
  /* Autoplay was blocked: start on the first gesture on the page. The player's own
     buttons and the Spotify buttons make their own decision. */
  function onGesture(e) {
    var el = e.target;
    if (root.contains(el)) return;
    if (el.closest && el.closest('[data-embed]')) return;
    if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Escape' || e.key === 'Shift' || e.ctrlKey || e.metaKey || e.altKey)) return;
    start().then(disarm).catch(function () {});
  }
  function autoStart() {
    if (mode !== 'autoplay' || saved.off) return;
    if (document.hidden) {
      document.addEventListener('visibilitychange', function again() {
        if (document.hidden) return;
        document.removeEventListener('visibilitychange', again);
        autoStart();
      });
      return;
    }
    start().then(disarm).catch(arm);
  }
  function listenerPause() {
    saved.off = true;
    save();
    disarm();
    audio.pause();
  }

  disc.addEventListener('click', function () {
    if (audio.paused) {
      saved.off = false;
      save();
      disarm();
      start().catch(function () {});
    } else {
      listenerPause();
    }
    /* Touch screens have no hover, so a tap also opens the panel for a moment. */
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) {
      root.classList.add('is-open');
      clearTimeout(openTimer);
      openTimer = setTimeout(function () { root.classList.remove('is-open'); }, 5000);
    }
  });
  hideBtn.addEventListener('click', function () {
    saved.hidden = true;
    listenerPause();
    root.remove();
  });
  /* A Spotify track on the page would play over this one. */
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-embed]')) listenerPause();
  }, true);

  /* Only one tab plays at a time. */
  var channel = null;
  try {
    channel = new BroadcastChannel(KEY);
    channel.onmessage = function () { disarm(); audio.pause(); };
  } catch (_) {}

  audio.addEventListener('play', function () {
    disarm();
    if (channel) channel.postMessage('playing');
    render();
  });
  audio.addEventListener('pause', render);
  audio.addEventListener('loadedmetadata', function () {
    if (saved.t && audio.currentTime < 0.5) audio.currentTime = saved.t;
    renderTime();
  });
  audio.addEventListener('timeupdate', function () {
    renderTime();
    var now = Date.now();
    if (now - lastSave > 1000 && audio.currentTime > 0) {
      lastSave = now;
      saved.t = audio.currentTime;
      save();
    }
  });
  window.addEventListener('pagehide', function () {
    if (audio.currentTime > 0) saved.t = audio.currentTime;
    save();
  });
  /* Back and forward can restore this page from memory. */
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    saved = read();
    if (saved.hidden) { audio.pause(); root.remove(); return; }
    if (saved.t) audio.currentTime = saved.t;
    if (mode === 'autoplay') autoStart(); else audio.pause();
    render();
  });
  if (select) select.addEventListener('change', render);

  render();
  if (window.siteI18n) window.siteI18n.refresh();
  autoStart();
})();
