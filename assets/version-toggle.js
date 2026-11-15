/* Latest / Previous switch on case study pages.
   Markup: .ver-toggle with button[data-v], and containers with [data-version].
   The latest version shows by default; #previous in the URL opens the previous one.
   Interactive blocks that need unique ids (live charts, calculators, a hero video) exist once:
   each sits in a [data-piece] element, and both versions hold a [data-slot] of the same name.
   Switching moves every piece into the visible version, then asks the charts to redraw. */
(function () {
  var toggles = document.querySelectorAll('.ver-toggle');
  if (!toggles.length) return;
  var buttons = document.querySelectorAll('.ver-toggle button[data-v]');

  function place(v) {
    var moved = false;
    document.querySelectorAll('[data-version="' + v + '"] [data-slot]').forEach(function (slot) {
      var piece = document.querySelector('[data-piece="' + slot.getAttribute('data-slot') + '"]');
      if (piece && piece.parentNode !== slot) { slot.appendChild(piece); moved = true; }
    });
    if (moved) { try { window.dispatchEvent(new Event('resize')); } catch (_) {} }
  }

  function show(v, remember) {
    document.querySelectorAll('[data-version]').forEach(function (el) {
      el.hidden = el.getAttribute('data-version') !== v;
    });
    place(v);
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-v') === v ? 'true' : 'false');
    });
    if (remember) {
      try { history.replaceState(null, '', v === 'previous' ? '#previous' : location.pathname + location.search); } catch (_) {}
    }
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { show(b.getAttribute('data-v'), true); });
  });
  /* #original was the first name of this link */
  if (location.hash === '#previous' || location.hash === '#original') show('previous', false);
})();
