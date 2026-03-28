/* ===== Main page scripts ===== */

/* Year */
document.getElementById('year').textContent = new Date().getFullYear();

/* Print resume */
var printBtn = document.getElementById('printResume');
if (printBtn) printBtn.addEventListener('click', function() { window.print(); });

/* Jump select */
function jump(sel) {
  var v = sel.value;
  sel.selectedIndex = 0;
  if (v) location.href = v;
}

/* More Work view toggle */
(function() {
  var toggle = document.getElementById('moreViewToggle');
  var hint = document.getElementById('moreViewHint');
  var views = { overview: document.getElementById('moreOverview'), detailed: document.getElementById('moreDetailed') };
  var hints = { overview: 'Quick-jump to a specific version or page.', detailed: 'Read what each project does, then open the page.' };
  if (!toggle) return;
  var saved = localStorage.getItem('moreWorkView') || 'detailed';
  function activate(name) {
    toggle.querySelectorAll('button').forEach(function(b) { b.classList.toggle('active', b.dataset.view === name); });
    Object.keys(views).forEach(function(k) { if (views[k]) views[k].classList.toggle('active', k === name); });
    if (hint) hint.textContent = hints[name] || '';
    localStorage.setItem('moreWorkView', name);
  }
  toggle.addEventListener('click', function(e) { var btn = e.target.closest('button[data-view]'); if (btn) activate(btn.dataset.view); });
  activate(saved);
})();

/* ===== Section-reveal (IntersectionObserver) ===== */
(function() {
  var sections = document.querySelectorAll('main section');
  if (!sections.length || !('IntersectionObserver' in window)) {
    sections.forEach(function(s) { s.classList.add('is-visible'); });
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  sections.forEach(function(s) { obs.observe(s); });
})();

/* ===== Client Work version switching ===== */
(function() {
  var iframe = document.getElementById('cwPreview');
  var label = document.getElementById('cwLabel');
  if (!iframe) return;
  var vers = document.querySelectorAll('.cw-ver[data-src]');
  vers.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      if (e.target.closest('.cw-open')) return; /* let the link open naturally */
      vers.forEach(function(b) { b.classList.remove('cw-ver-primary'); });
      btn.classList.add('cw-ver-primary');
      iframe.src = btn.dataset.src;
      if (label) label.textContent = 'Live preview — ' + btn.dataset.label;
    });
  });
})();

/* ===== Sticky header: shadow on scroll + active section highlight ===== */
(function() {
  var header = document.getElementById('siteHeader');
  if (!header) return;

  /* Shadow on scroll */
  var onScroll = function() {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Highlight active nav link based on scroll position */
  var links = header.querySelectorAll('nav.primary a[href^="#"]');
  var sections = [];
  links.forEach(function(a) {
    var id = a.getAttribute('href').slice(1);
    var el = document.getElementById(id);
    if (el) sections.push({ el: el, link: a });
  });
  if (!sections.length) return;

  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      var match = sections.find(function(s) { return s.el === e.target; });
      if (match) match.link.classList.toggle('active', e.isIntersecting);
    });
  }, { rootMargin: '-20% 0px -60% 0px' });
  sections.forEach(function(s) { io.observe(s.el); });
})();
