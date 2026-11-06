/* Theme change: colours fade over a fixed 0.3 s on every page.
   Only what is on screen animates. Animating every element on the page is what made
   long pages stutter; anything off screen simply changes at once, unseen. */
(function () {
  var MS = 300;
  var LARGE = 60; /* A container with more elements than this is split into its children. */
  var root = document.documentElement;
  var btn = document.getElementById('themeToggle');
  if (!btn) return;

  var rule = 'transition:' + ['background-color', 'color', 'border-color', 'box-shadow', 'fill', 'stroke'].map(function (p) {
    return p + ' ' + MS + 'ms ease';
  }).join(',') + '!important';
  var style = document.createElement('style');
  style.textContent = '.tf-self,.tf-tree,.tf-tree *{' + rule + '}';
  document.head.appendChild(style);

  var marked = [];
  var timer;
  function add(el, name) {
    el.classList.add(name);
    marked.push([el, name]);
  }
  function clear() {
    marked.forEach(function (m) { m[0].classList.remove(m[1]); });
    marked = [];
  }
  function onScreen(el) {
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
  }
  function mark(parent) {
    for (var i = 0; i < parent.children.length; i++) {
      var el = parent.children[i];
      if (!onScreen(el)) continue;
      if (el.getElementsByTagName('*').length > LARGE) {
        add(el, 'tf-self');
        mark(el);
      } else {
        add(el, 'tf-tree');
      }
    }
  }

  /* Runs just before the page's own click handler, which does the actual theme change. */
  btn.addEventListener('click', function () {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    clearTimeout(timer);
    clear();
    add(root, 'tf-self');
    add(document.body, 'tf-self');
    mark(document.body);
    timer = setTimeout(clear, MS + 50);
  }, true);
})();
