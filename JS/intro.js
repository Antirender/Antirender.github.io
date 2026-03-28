/* intro.js — Scrollama for the standalone intro page */
(function() {
  if (typeof scrollama === 'undefined') return;
  var scroller = scrollama();
  var visual = document.querySelector('.scroll-visual');
  if (!visual) return;

  scroller.setup({
    step: '#scroll-intro .scroll-step',
    offset: 0.5,
    progress: false
  })
  .onStepEnter(function(response) {
    visual.setAttribute('data-step', response.index + 1);
  })
  .onStepExit(function(response) {
    if (response.direction === 'up' && response.index === 0) {
      visual.setAttribute('data-step', '0');
    }
  });

  window.addEventListener('resize', scroller.resize);
})();
