/* Version switch on case study pages (Latest / Previous, or Original / Latest / Previous).
   Markup: .ver-toggle with button[data-v], and containers with [data-version].
   The container without the hidden attribute is the default; #<version> in the URL opens another one.
   Interactive blocks that need unique ids (live charts, calculators, a hero video) exist once:
   each sits in a [data-piece] element, and the versions hold a [data-slot] of the same name.
   Switching moves every piece into the visible version, then fires a resize so charts and
   embedded pages fit again. */
(function () {
  var toggles = document.querySelectorAll('.ver-toggle');
  if (!toggles.length) return;
  var buttons = document.querySelectorAll('.ver-toggle button[data-v]');
  var first = [].filter.call(document.querySelectorAll('[data-version]'), function (el) { return !el.hidden; })[0];
  var defaultV = first ? first.getAttribute('data-version') : 'latest';

  function has(v) { return !!document.querySelector('[data-version="' + v + '"]'); }

  function place(v) {
    document.querySelectorAll('[data-version="' + v + '"] [data-slot]').forEach(function (slot) {
      var piece = document.querySelector('[data-piece="' + slot.getAttribute('data-slot') + '"]');
      if (piece && piece.parentNode !== slot) slot.appendChild(piece);
    });
  }

  function show(v, remember) {
    document.querySelectorAll('[data-version]').forEach(function (el) {
      el.hidden = el.getAttribute('data-version') !== v;
    });
    place(v);
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-v') === v ? 'true' : 'false');
    });
    try { window.dispatchEvent(new Event('resize')); } catch (_) {}
    if (remember) {
      try { history.replaceState(null, '', v === defaultV ? location.pathname + location.search : '#' + v); } catch (_) {}
    }
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { show(b.getAttribute('data-v'), true); });
  });
  var h = location.hash.slice(1);
  if (h && h !== defaultV && has(h)) show(h, false);
  /* #original was the first name of the previous version on pages that have no original */
  else if (h === 'original' && !has('original') && has('previous')) show('previous', false);
})();
