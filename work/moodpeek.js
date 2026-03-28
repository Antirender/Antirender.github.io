// MoodPeek — demo selector + preview
(function () {
  var sel = document.getElementById('ver');
  var link = document.getElementById('openLink');
  var preview = document.getElementById('previewBox');

  var demoMap = {
    pro:  { url: 'https://moodpeek-pro.vercel.app', label: 'MoodPeek Pro' },
    v1:   { url: 'https://moodpeek1.vercel.app/',   label: 'MoodPeek v1' }
  };

  sel.addEventListener('change', function () {
    var d = demoMap[this.value];
    link.href = d.url;
    link.textContent = 'Open ' + d.label;
    var iframe = preview.querySelector('iframe');
    if (iframe) iframe.src = d.url;
    var lbl = preview.querySelector('.preview-label');
    if (lbl) lbl.textContent = 'Live preview — ' + d.label;
  });
})();
