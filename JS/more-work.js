/* more-work.js — standalone script for more-work.html */

/* year */
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

/* jump from <select> */
function jump(sel) {
  if (sel.value) window.open(sel.value, '_blank');
  sel.selectedIndex = 0;
}

/* view toggle (overview / detailed) — persisted in localStorage */
(function () {
  const wrap = document.getElementById('moreViewToggle');
  if (!wrap) return;
  const btns = wrap.querySelectorAll('button[data-view]');
  const views = { overview: document.getElementById('moreOverview'), detailed: document.getElementById('moreDetailed') };
  const hint = document.getElementById('moreViewHint');
  const KEY = 'mw-view';

  function show(mode) {
    Object.entries(views).forEach(function (pair) {
      pair[1].classList.toggle('active', pair[0] === mode);
    });
    btns.forEach(function (b) { b.classList.toggle('active', b.dataset.view === mode); });
    if (hint) hint.textContent = mode === 'overview'
      ? 'Pick a project from any dropdown to open it.'
      : 'Read what each project does, then open the page.';
    try { localStorage.setItem(KEY, mode); } catch (_) {}
  }

  btns.forEach(function (b) {
    b.addEventListener('click', function () { show(b.dataset.view); });
  });

  try { var saved = localStorage.getItem(KEY); if (saved && views[saved]) show(saved); } catch (_) {}
})();
