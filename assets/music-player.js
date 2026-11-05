(function () {
  var player = document.getElementById('siteMusicPlayer');
  if (!player) return;

  var audio = player.querySelector('audio');
  var toggle = player.querySelector('[data-music-toggle]');
  var close = player.querySelector('[data-music-close]');
  var status = player.querySelector('[data-music-status]');
  var pageMode = document.documentElement.getAttribute('data-music-mode') || 'paused';
  var volume = 0.5;

  audio.volume = volume;

  function update(isPlaying) {
    player.classList.toggle('is-playing', isPlaying);
    toggle.setAttribute('aria-label', isPlaying ? 'Pause Dear Deer' : 'Play Dear Deer');
    toggle.textContent = isPlaying ? '||' : '>'; 
    status.textContent = isPlaying ? 'Now playing' : 'Paused';
  }

  function play() {
    audio.play().then(function () { update(true); }).catch(function () {
      update(false);
      player.classList.add('needs-gesture');
    });
  }

  toggle.addEventListener('click', function () {
    if (audio.paused) play();
    else { audio.pause(); update(false); }
  });
  close.addEventListener('click', function () {
    audio.pause();
    update(false);
    player.classList.add('is-hidden');
  });
  audio.addEventListener('play', function () { update(true); });
  audio.addEventListener('pause', function () { update(false); });
  audio.addEventListener('ended', function () { update(false); });

  if (pageMode === 'autoplay') {
    play();
    document.addEventListener('pointerdown', function resume() {
      if (audio.paused && !player.classList.contains('is-hidden')) play();
      document.removeEventListener('pointerdown', resume);
    }, { once: true });
  } else {
    update(false);
  }
})();
