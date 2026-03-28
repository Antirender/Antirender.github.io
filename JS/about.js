/* About page — persona swap */
(function(){
  var heroWord=document.getElementById('heroWord');
  var heroLabel=document.getElementById('heroLabel');
  var heroTitle=document.getElementById('heroTitle');
  var heroSubtitle=document.getElementById('heroSubtitle');
  var figPrimary=document.getElementById('heroFigPrimary');
  var figSecondary=document.getElementById('heroFigSecondary');
  var imgPrimary=document.getElementById('heroImgPrimary');
  var imgSecondary=document.getElementById('heroImgSecondary');
  var heroText=document.querySelector('.hero-text');
  var swapping=false;

  var identities={
    outer:{img:'image/outer.png',alt:'Yiyang Zhang',word:'YIYANG',label:'Interaction Design',title:'Yiyang Zhang',subtitle:'I design from the real \u2014 prototyping, testing, and iterating until the thing works.'},
    inner:{img:'image/inner.png',alt:'Antirender',word:'ANTIRENDER',label:'Creative Alter Ego',title:'Antirender',subtitle:'Music, experiments, and the things that don\u2019t fit neatly into a portfolio.'}
  };

  var primaryId='outer';
  function secondaryId(){return primaryId==='outer'?'inner':'outer';}

  function applyState(){
    var p=identities[primaryId];
    var s=identities[secondaryId()];
    heroWord.textContent=p.word;
    heroLabel.textContent=p.label;
    heroTitle.textContent=p.title;
    heroSubtitle.textContent=p.subtitle;
    imgPrimary.src=p.img;
    imgPrimary.alt=p.alt;
    imgSecondary.src=s.img;
    imgSecondary.alt=s.alt;
  }

  function doSwap(){
    if(swapping)return;
    swapping=true;
    heroText.classList.add('swapping');

    /* read current CSS vars for figure positions */
    var figContainer=document.getElementById('heroFigures');
    var cs=getComputedStyle(figPrimary);
    var priLeft=cs.left, priH=cs.height;
    cs=getComputedStyle(figSecondary);
    var secLeft=cs.left, secH=cs.height;

    figPrimary.style.left=secLeft;figPrimary.style.height=secH;figPrimary.style.opacity='.38';figPrimary.style.filter='grayscale(.45)';figPrimary.style.zIndex='1';
    figSecondary.style.left=priLeft;figSecondary.style.height=priH;figSecondary.style.opacity='1';figSecondary.style.filter='none';figSecondary.style.zIndex='2';

    setTimeout(function(){
      figPrimary.style.cssText='transition:none';
      figSecondary.style.cssText='transition:none';
      primaryId=secondaryId();
      applyState();
      heroText.classList.remove('swapping');
      requestAnimationFrame(function(){
        figPrimary.style.cssText='';
        figSecondary.style.cssText='';
        swapping=false;
      });
    },420);
  }

  figPrimary.addEventListener('click',doSwap);
  figSecondary.addEventListener('click',doSwap);
  figPrimary.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();doSwap();}});
  figSecondary.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();doSwap();}});

  applyState();
})();
