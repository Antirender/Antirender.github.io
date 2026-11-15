/* Chapter nav on case study pages: highlight the chapter on screen and keep its link in view */
(function () {
  var links = [].slice.call(document.querySelectorAll('.chapter-nav a'));
  if (!links.length || !('IntersectionObserver' in window)) return;
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) {
        var on = a === byId[e.target.id];
        a.classList.toggle('on', on);
        if (on) {
          a.setAttribute('aria-current', 'true');
          var nav = a.parentNode;
          if (nav.scrollWidth > nav.clientWidth) nav.scrollLeft = a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2;
        } else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
})();
