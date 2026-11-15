/* Latest / Original switch on case study pages.
   Markup: .ver-toggle with button[data-v], and containers with [data-version].
   The latest version shows by default; #original in the URL opens the original. */
(function () {
  var toggles = document.querySelectorAll('.ver-toggle');
  if (!toggles.length) return;
  var buttons = document.querySelectorAll('.ver-toggle button[data-v]');

  function show(v, remember) {
    document.querySelectorAll('[data-version]').forEach(function (el) {
      el.hidden = el.getAttribute('data-version') !== v;
    });
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-v') === v ? 'true' : 'false');
    });
    if (remember) {
      try { history.replaceState(null, '', v === 'original' ? '#original' : location.pathname + location.search); } catch (_) {}
    }
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { show(b.getAttribute('data-v'), true); });
  });
  if (location.hash === '#original') show('original', false);
})();
