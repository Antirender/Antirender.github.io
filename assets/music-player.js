/* Floating player for four songs: Dear Deer, September Oath, I'm fine if You're Mine, T.T.
   <html data-music-mode> sets the page rule: "autoplay" on Work and Music, "paused" on Home.
   Autoplay never starts silently out of nowhere: the player opens, counts down 3, 2, 1 with a
   Don't play button, then the song fades in. If the browser blocks sound until a tap, the player
   says so and counts down again after that first tap.
   Volume is a loudness scale that starts at 30%. Each halving of loudness is -10 dB, so a level p
   plays at 10*log2(p) dB: 30% is about -17 dB, an amplitude of 0.135.
   During one visit the listener's choice wins: a pause or hide carries across pages, and the song
   continues from the same position. The volume level is remembered on this device. */
(function () {
  var mode = document.documentElement.getAttribute('data-music-mode');
  if (!mode) return;

  var TRACKS = [
    { title: 'Dear Deer', src: 'assets/audio/DearDeer.m4a', id: '1x9cwZclgWFJTPFpwgvHFd', seconds: 203 },
    { title: 'September Oath', src: 'assets/audio/SeptemberOath.m4a', id: '6lwfu8koKFhQXWRrKs7wYO', seconds: 228 },
    { title: 'I’m fine if You’re Mine', src: 'assets/audio/ImFineIfYoureMine.m4a', id: '6RBtBXukNVfRCsReW6CzhI', seconds: 199 },
    { title: 'T.T', src: 'assets/audio/TT.m4a', id: '1c75fmmHDbCGNg96YtraxE', seconds: 197 }
  ];
  var KEY = 'siteMusic';
  var LEVEL_KEY = 'siteMusicLevel';
  var DEFAULT_LEVEL = 0.3;
  var COUNTDOWN = 3;
  var FADE_MS = 1500;
  /* Browsers unlock sound on different events: mouse on pointerdown, touch on pointerup or touchend. */
  var GESTURES = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'];
  var ICON = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13l11-6.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 5.5v13l9-6.5zM16 5h2.5v14H16z"/></svg>',
    volume: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 9.5h4l5-4v13l-5-4H4z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M16 9a4 4 0 0 1 0 6"/></svg>'
  };
  var TEXT = {
    en: { playing: 'Now playing', paused: 'Paused', startsIn: 'Music starts in {n}', afterTap: 'Starts 3 s after your first tap', dontPlay: 'Don’t play', stop: 'Stop', play: 'Play {t}', pause: 'Pause {t}', next: 'Next song', volume: 'Volume', spotify: 'Open {t} on Spotify', region: 'Music player' },
    'zh-CN': { playing: '正在播放', paused: '已暂停', startsIn: '{n} 秒后开始播放音乐', afterTap: '首次点击后 3 秒开始播放', dontPlay: '不播放', stop: '停止', play: '播放 {t}', pause: '暂停 {t}', next: '下一首', volume: '音量', spotify: '在 Spotify 打开 {t}', region: '音乐播放器' },
    'zh-TW': { playing: '正在播放', paused: '已暫停', startsIn: '{n} 秒後開始播放音樂', afterTap: '首次點擊後 3 秒開始播放', dontPlay: '不播放', stop: '停止', play: '播放 {t}', pause: '暫停 {t}', next: '下一首', volume: '音量', spotify: '在 Spotify 開啟 {t}', region: '音樂播放器' },
    ja: { playing: '再生中', paused: '一時停止中', startsIn: '{n} 秒後に音楽が流れます', afterTap: '最初のタップから 3 秒後に再生', dontPlay: '再生しない', stop: '停止', play: '{t} を再生', pause: '{t} を一時停止', next: '次の曲', volume: '音量', spotify: 'Spotify で {t} を開く', region: '音楽プレーヤー' },
    fr: { playing: 'En lecture', paused: 'En pause', startsIn: 'Musique dans {n} s', afterTap: 'Démarre 3 s après votre premier clic', dontPlay: 'Ne pas lire', stop: 'Arrêter', play: 'Lire {t}', pause: 'Mettre {t} en pause', next: 'Morceau suivant', volume: 'Volume', spotify: 'Ouvrir {t} sur Spotify', region: 'Lecteur de musique' },
    de: { playing: 'Läuft gerade', paused: 'Pausiert', startsIn: 'Musik startet in {n} s', afterTap: 'Startet 3 s nach dem ersten Tippen', dontPlay: 'Nicht abspielen', stop: 'Stopp', play: '{t} abspielen', pause: '{t} pausieren', next: 'Nächster Song', volume: 'Lautstärke', spotify: '{t} auf Spotify öffnen', region: 'Musikplayer' }
  };

  /* Loudness level 0..1 to amplitude: 10^(10*log2(p)/20) = p^(log2(10)/2), about p^1.66 */
  function gainFor(p) { return p <= 0.005 ? 0 : Math.min(1, Math.pow(p, Math.log(10) / Math.LN2 / 2)); }

  function read() { try { return JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch (_) { return {}; } }
  /* { i: song, t: seconds, on: was playing when the last page closed, off: paused by the listener, hidden: closed by the listener } */
  var saved = read();
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(saved)); } catch (_) {} }
  var level = DEFAULT_LEVEL;
  try { var stored = parseFloat(localStorage.getItem(LEVEL_KEY)); if (stored >= 0 && stored <= 1) level = stored; } catch (_) {}

  var index = saved.i >= 0 && saved.i < TRACKS.length ? saved.i : 0;
  function track() { return TRACKS[index]; }

  var root = document.createElement('aside');
  root.className = 'music-player';
  root.id = 'siteMusicPlayer';
  root.innerHTML =
    '<div class="mp-panel">' +
      '<span class="mp-meta"><span class="mp-status" aria-live="polite"></span><span class="mp-time"></span></span>' +
      '<strong class="mp-title"></strong>' +
      '<span class="mp-credit"><span data-i18n="art.credit">Cover art by </span><a href="https://tataqwq233.carrd.co" target="_blank" rel="noopener" data-i18n="art.name">TaTa (tataqwq233) ↗</a></span>' +
    '</div>' +
    '<div class="mp-controls">' +
      '<button class="mp-cancel" type="button"></button>' +
      '<button class="mp-next" type="button">' + ICON.next + '</button>' +
      '<label class="mp-vol">' + ICON.volume + '<input type="range" min="0" max="100" step="1"></label>' +
      '<a class="mp-link" target="_blank" rel="noopener">Spotify ↗</a>' +
    '</div>' +
    '<button class="mp-disc" type="button"><img alt="" width="120" height="120"><span class="mp-icon"></span></button>' +
    '<audio></audio>';
  document.body.appendChild(root);

  var audio = root.querySelector('audio');
  var disc = root.querySelector('.mp-disc');
  var cover = disc.querySelector('img');
  var icon = root.querySelector('.mp-icon');
  var statusEl = root.querySelector('.mp-status');
  var timeEl = root.querySelector('.mp-time');
  var titleEl = root.querySelector('.mp-title');
  var cancelBtn = root.querySelector('.mp-cancel');
  var nextBtn = root.querySelector('.mp-next');
  var slider = root.querySelector('.mp-vol input');
  var link = root.querySelector('.mp-link');
  var select = document.querySelector('.lang-sel');

  /* iPhone and iPad ignore audio.volume: the hardware buttons set the level there. */
  var canVolume = (function () { try { var a = document.createElement('audio'); a.volume = 0.5; return Math.abs(a.volume - 0.5) < 0.01; } catch (_) { return false; } })();
  if (!canVolume) root.classList.add('no-volume');

  var state = 'idle';      /* idle | counting | waiting | live */
  var count = 0;
  var countTimer = null;
  var noticeTimer = null;
  var openTimer = null;
  var fadeFrame = null;
  var armed = false;
  var lastSave = 0;

  function text() { return TEXT[select && select.value] || TEXT.en; }
  function fill(s, t) { return s.replace('{t}', t.title).replace('{n}', count); }

  function setTrack(i, keepTime) {
    index = (i + TRACKS.length) % TRACKS.length;
    var t = track();
    audio.src = t.src;
    cover.src = 'image/tracks/' + t.id + '.webp';
    link.href = 'https://open.spotify.com/track/' + t.id;
    titleEl.textContent = t.title;
    saved.i = index;
    if (!keepTime) saved.t = 0;
    save();
  }

  function renderTime() {
    var total = audio.duration > 0 && isFinite(audio.duration) ? audio.duration : track().seconds;
    var left = Math.max(0, Math.ceil(total - audio.currentTime));
    timeEl.textContent = Math.floor(left / 60) + ':' + ('0' + (left % 60)).slice(-2);
  }
  function render() {
    var t = text(), tr = track();
    var audible = !audio.paused && !audio.muted;
    var asking = state === 'counting' || state === 'waiting';
    root.classList.toggle('is-playing', audible);
    root.classList.toggle('is-asking', asking);
    root.setAttribute('aria-label', t.region);
    statusEl.textContent = state === 'counting' ? fill(t.startsIn, tr) : state === 'waiting' ? t.afterTap : audible ? t.playing : t.paused;
    disc.setAttribute('aria-label', fill(audible ? t.pause : t.play, tr));
    var want = audible ? 'pause' : 'play';
    if (icon.getAttribute('data-icon') !== want) { icon.innerHTML = ICON[want]; icon.setAttribute('data-icon', want); }
    cancelBtn.textContent = asking ? t.dontPlay : t.stop;
    nextBtn.setAttribute('aria-label', t.next);
    slider.setAttribute('aria-label', t.volume);
    link.setAttribute('aria-label', fill(t.spotify, tr));
    renderTime();
  }

  /* Open the panel for a moment so people see what is playing and where to stop it. */
  function showNotice(ms) {
    root.classList.add('is-notice');
    clearTimeout(noticeTimer);
    if (ms) noticeTimer = setTimeout(function () { root.classList.remove('is-notice', 'is-fresh'); }, ms);
  }

  function stopFade() { if (fadeFrame) cancelAnimationFrame(fadeFrame); fadeFrame = null; }
  function fadeIn() {
    stopFade();
    if (!canVolume) return;
    var from = 0, startAt = performance.now();
    audio.volume = from;
    (function step(now) {
      var k = Math.min(1, (now - startAt) / FADE_MS);
      audio.volume = gainFor(level) * k;
      fadeFrame = k < 1 ? requestAnimationFrame(step) : null;
    })(startAt);
  }

  function goLive() {
    state = 'live';
    clearInterval(countTimer);
    disarm();
    audio.muted = false;
    fadeIn();
    if (channel) channel.postMessage('playing');
    saved.off = false;
    save();
    /* For 3 seconds the button under the pointer stays a Stop button, so a late "Don't play" still works. */
    root.classList.add('is-fresh');
    showNotice(3000);
    render();
  }
  /* Start with sound now. Called from a click, or after a countdown. */
  function playNow() {
    clearInterval(countTimer);
    if (canVolume) audio.volume = 0;
    audio.muted = false;
    var p = audio.play();
    return (p && p.then ? p : Promise.resolve()).then(goLive);
  }

  function countdown(done) {
    state = 'counting';
    count = COUNTDOWN;
    showNotice(0);
    render();
    clearInterval(countTimer);
    countTimer = setInterval(function () {
      count -= 1;
      if (count > 0) { render(); return; }
      clearInterval(countTimer);
      done();
    }, 1000);
  }

  function waitForTap() {
    state = 'waiting';
    showNotice(0);
    render();
    arm();
  }
  /* Autoplay was blocked: the first gesture unlocks sound. The song starts muted inside that
     gesture, then the countdown runs, then the sound fades in. */
  function onGesture(e) {
    var el = e.target;
    if (root.contains(el)) return;
    if (el.closest && el.closest('[data-embed]')) return;
    if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Escape' || e.key === 'Shift' || e.ctrlKey || e.metaKey || e.altKey)) return;
    disarm();
    audio.muted = true;
    var p = audio.play();
    (p && p.then ? p : Promise.resolve()).then(function () {
      countdown(goLive);
    }).catch(function () { audio.muted = false; arm(); });
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

  function tryAutoplay() {
    playNow().catch(function () {
      audio.muted = false;
      waitForTap();
    });
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
    /* Someone was already listening on the previous page: carry on with a fade, no countdown. */
    if (saved.on) { tryAutoplay(); return; }
    countdown(tryAutoplay);
  }

  function listenerPause() {
    clearInterval(countTimer);
    stopFade();
    disarm();
    state = 'idle';
    saved.off = true;
    saved.on = false;
    save();
    audio.pause();
    audio.muted = false;
    root.classList.remove('is-notice', 'is-fresh');
    render();
  }

  disc.addEventListener('click', function () {
    var audible = !audio.paused && !audio.muted;
    if (audible) listenerPause();
    else playNow().catch(function () {});
    /* Touch screens have no hover, so a tap also opens the panel for a moment. */
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) {
      root.classList.add('is-open');
      clearTimeout(openTimer);
      openTimer = setTimeout(function () { root.classList.remove('is-open'); }, 5000);
    }
  });
  cancelBtn.addEventListener('click', listenerPause);
  nextBtn.addEventListener('click', function () {
    var wasPlaying = !audio.paused && !audio.muted;
    setTrack(index + 1, false);
    if (wasPlaying) playNow().catch(function () {}); else render();
  });
  slider.value = Math.round(level * 100);
  slider.addEventListener('input', function () {
    level = slider.value / 100;
    try { localStorage.setItem(LEVEL_KEY, String(level)); } catch (_) {}
    if (!fadeFrame && canVolume) audio.volume = gainFor(level);
  });
  /* A Spotify track on the page would play over this one. */
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-embed]')) listenerPause();
  }, true);

  /* Only one tab plays at a time. */
  var channel = null;
  try {
    channel = new BroadcastChannel(KEY);
    channel.onmessage = function () { clearInterval(countTimer); disarm(); state = 'idle'; audio.pause(); root.classList.remove('is-notice'); render(); };
  } catch (_) {}

  audio.addEventListener('play', function () {
    if (!audio.muted && channel) channel.postMessage('playing');
    render();
  });
  /* Muting changes what the disc shows; volume steps during a fade do not. */
  var wasMuted = audio.muted;
  audio.addEventListener('volumechange', function () { if (audio.muted !== wasMuted) { wasMuted = audio.muted; render(); } });
  audio.addEventListener('pause', render);
  audio.addEventListener('ended', function () {
    setTrack(index + 1, false);
    playNow().catch(function () {});
  });
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
    saved.on = state === 'live' && !audio.paused && !audio.muted;
    save();
  });
  /* Back and forward can restore this page from memory. */
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    saved = read();
    if (saved.t) audio.currentTime = saved.t;
    if (mode === 'autoplay') autoStart(); else audio.pause();
    render();
  });
  if (select) select.addEventListener('change', render);

  audio.loop = false;
  if (canVolume) audio.volume = gainFor(level);
  /* Home downloads nothing until someone presses play. */
  audio.preload = mode === 'autoplay' ? 'auto' : 'none';
  setTrack(index, true);
  if (saved.t) audio.currentTime = saved.t;

  render();
  if (window.siteI18n) window.siteI18n.refresh();
  autoStart();
})();
