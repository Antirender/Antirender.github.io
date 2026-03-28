// GSGC — version selector + preview
(function () {
  var sel = document.getElementById('ver');
  var link = document.getElementById('openLink');
  var preview = document.getElementById('previewBox');

  function buildHref(v) {
    return '../GSGC/' + v + '/index.html';
  }

  sel.addEventListener('change', function () {
    var href = buildHref(this.value);
    link.href = href;
    link.textContent = 'Open ' + this.value.toUpperCase();
    var iframe = preview.querySelector('iframe');
    if (iframe) iframe.src = href;
    var label = preview.querySelector('.preview-label');
    if (label) label.textContent = 'Live preview — GSGC ' + this.value.toUpperCase();
  });
})();
