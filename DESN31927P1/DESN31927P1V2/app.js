/* ---------- boot ---------- */
window.hoursAll = [];
function setStatus(s){ document.body.dataset.status = s; }
function showError(msg){ console.error(msg); alert(msg); }
function debugLog(msg) {
  console.log(msg);
  const debug = document.getElementById('debug-info');
  if (debug) {
    debug.innerHTML += '<div>' + new Date().toLocaleTimeString() + ': ' + msg + '</div>';
  }
}

/* ---------- services (APIs) ---------- */
async function geocodeCity(query){
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&accept-language=en&q=${encodeURIComponent(query)}`;
    console.log('Geocoding:', query);
    const r = await fetch(url, { headers:{'User-Agent':'student-weather-demo'} });
    if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
    const j = await r.json();
    if (!j?.length) throw new Error('City not found');
    const it = j[0];
    return { name: englishLabelFromAddress(it.address) || toAsciiEnglish(it.display_name), lat:+it.lat, lon:+it.lon };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

async function fetchForecast(lat, lon){
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
      + `&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,precipitation,wind_speed_10m,uv_index`
      + `&past_hours=0&forecast_hours=48&timezone=auto`;
    console.log('Fetching weather data from:', url);
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
    const j = await r.json();
    console.log('Weather API response:', j);
    if (!j.hourly) throw new Error('Invalid API response format');
    const H = j.hourly;
    const n = Math.min(48, H.time.length);
    const out = [];
    for (let i=0;i<n;i++){
      out.push({
        isoTime: H.time[i],
        temp: +H.temperature_2m[i],
        apparent: +H.apparent_temperature[i],
        rh: +H.relative_humidity_2m[i],
        pop: +H.precipitation_probability[i],
        precip: +H.precipitation[i],
        wind: +H.wind_speed_10m[i],
        uv: +H.uv_index[i]
      });
    }
    return out;
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
}

/* ---------- transform & fallbacks ---------- */
function heatIndexC(T, RH){
  const Tf = T*9/5+32;
  const HI = -42.379 + 2.04901523*Tf + 10.14333127*RH - 0.22475541*Tf*RH
           - 0.00683783*Tf*Tf - 0.05481717*RH*RH + 0.00122874*Tf*Tf*RH
           + 0.00085282*Tf*RH*RH - 0.00000199*Tf*Tf*RH*RH;
  return (HI-32)*5/9;
}
function windChillC(T, Vms){ const V=Vms*3.6; return 13.12+0.6215*T-11.37*Math.pow(V,.16)+0.3965*T*Math.pow(V,.16); }
function apparentWithFallback(h){
  if (Number.isFinite(h.apparent)) return h.apparent;
  if (h.temp>=27 && h.rh>=40) return heatIndexC(h.temp,h.rh);
  if (h.temp<=10 && h.wind>=4.8) return windChillC(h.temp,h.wind);
  return h.temp;
}
function nextN(hours,n=6){ const now=Date.now(); return hours.filter(h=>new Date(h.isoTime).getTime()>=now).slice(0,n); }

/* ---------- rules (expert system) ---------- */
function makeAdvice(hours){
  const slice = nextN(hours,6).map(h=>({...h, apparent:apparentWithFallback(h)}));
  const get = k => slice.map(x=>x[k]).filter(Number.isFinite);
  const min=a=>Math.min(...a), max=a=>Math.max(...a), avg=a=>a.reduce((s,v)=>s+v,0)/a.length;
  const A=get('apparent'), P=get('pop'), R=get('precip'), W=get('wind'), U=get('uv');
  const s = {
    minApp:Math.round(min(A)), maxApp:Math.round(max(A)), avgApp:Math.round(avg(A)),
    maxPOP:Math.round(max(P)), sumPrecip:+R.reduce((a,b)=>a+b,0).toFixed(1),
    maxWind:Math.round(max(W)), maxUV:Math.round(max(U))
  };

  const tags=[];
  if (s.maxWind>=10) tags.push('WIND CAUTION');
  if (s.avgApp>=27) tags.push('HEAT COMFORT TIPS');
  if (s.avgApp<=0)  tags.push('COLD LAYERING');
  if (s.maxPOP>=60 && s.sumPrecip>=0.2) tags.push('BRING UMBRELLA');
  if (s.maxUV>=6)  tags.push('HIGH UV');

  const parts=[];
  parts.push(s.avgApp>=27?'warm to hot conditions with elevated comfort concerns'
    : s.avgApp<=0?'cold conditions requiring layering'
    : 'pleasant temperatures');
  if (s.maxPOP>=60) parts.push('increased rain likelihood');
  if (s.maxUV>=6)  parts.push('strong UV exposure');
  if (s.maxWind>=10)parts.push('notable wind activity');

  const outfit=[];
  if (s.avgApp>=27) outfit.push('light, breathable clothing');
  if (s.avgApp<=0)  outfit.push('insulated layers');
  if (s.maxPOP>=60) outfit.push('umbrella or rain jacket');
  if (s.maxUV>=6)  outfit.push('sunscreen and sunglasses');

  return { s, tags,
    summary:`Weather conditions for the next 6 hours: ${parts.join(', ')}.`,
    wear: outfit.length?`Wear ${outfit.join(', ')}.`:'Dress as comfortable.' };
}

/* ---------- UI (render) ---------- */
function isDark(){ return document.documentElement.getAttribute('data-theme')==='dark'; }
function palette(){
  const axis=isDark()?'rgba(255,255,255,.88)':'#0e1321';
  return {line:'#ff3b30', bar:'#0a84ff', axis,
          grid:isDark()?'rgba(255,255,255,.12)':'rgba(100,116,139,.22)',
          grid2:isDark()?'rgba(255,255,255,.08)':'rgba(100,116,139,.10)'};
}
function renderSummary(hours, cityLabel){
  const slice = nextN(hours,6).map(h=>({...h, apparent:apparentWithFallback(h)}));
  const appNow = slice[0]?.apparent; const windNow=slice[0]?.wind; const uvNow=slice[0]?.uv; const popNow=slice[0]?.pop;
  const min = Math.min(...slice.map(h=>h.apparent)), max=Math.max(...slice.map(h=>h.apparent));
  document.getElementById('city-name').textContent = cityLabel;
  document.getElementById('app-now').textContent = Number.isFinite(appNow)?`${Math.round(appNow)}°C`:'—';
  document.getElementById('wind-now').textContent = Number.isFinite(windNow)?`${Math.round(windNow)} km/h`:'—';
  document.getElementById('uv-now').textContent = Number.isFinite(uvNow)?`${Math.round(uvNow)}`:'—';
  document.getElementById('pop-now').textContent = Number.isFinite(popNow)?`${Math.round(popNow)}%`:'—';
  document.getElementById('next6-range').textContent = (Number.isFinite(min)&&Number.isFinite(max))?`${Math.round(min)}–${Math.round(max)}°C`:'—';
}

function renderAdvice(hours){
  const { s, tags, summary, wear } = makeAdvice(hours);
  const tagBox = document.getElementById('advice-tags');
  tagBox.innerHTML = tags.map(t=>`<span class="chip">${t}</span>`).join('') || '<span class="muted">No special flags</span>';
  document.getElementById('advice-text').textContent = summary;
  document.getElementById('wear-text').textContent = wear;
  document.getElementById('comfort-text').textContent = (s.maxUV>=6?'Sunscreen and sunglasses recommended. Stay hydrated.':'Stay comfortable with appropriate layers.');
  document.getElementById('stat-range').textContent = `${s.minApp}° – ${s.maxApp}°`;
  document.getElementById('stat-pop').textContent = `${s.maxPOP}% chance`;
  document.getElementById('stat-uv').textContent = `UV ${s.maxUV}`;
  document.getElementById('stat-wind').textContent = `${s.maxWind} km/h`;
}

function renderChart(hours){
  if (!window.Chart) {
    console.error('Chart.js not loaded');
    return;
  }
  
  const chartCanvas = document.getElementById('forecast-chart');
  if (!chartCanvas) {
    console.error('Chart canvas not found');
    return;
  }

  const p = palette();
  const labels = hours.map(h=>new Date(h.isoTime).toLocaleString([], {hour:'2-digit', minute:'2-digit'}));
  const apparent = hours.map(h=>apparentWithFallback(h));
  const pop = hours.map(h=>h.pop);

  if (window.chart && typeof window.chart.destroy === 'function') {
    try {
      window.chart.destroy();
    } catch(e) {
      console.warn('Chart destroy error:', e);
    }
  }
  window.chart = new Chart(chartCanvas.getContext('2d'), {
    type:'line',
    data:{ labels,
      datasets:[
        { label:'Feels like (°C)', data:apparent, yAxisID:'y', tension:.35, pointRadius:3,
          borderColor:p.line, pointBackgroundColor:p.line, borderWidth:2.5 },
        ...(document.getElementById('toggle-pop')?.checked?[{
          type:'bar', label:'Rain chance (%)', data:pop, yAxisID:'y1',
          backgroundColor:p.bar, borderWidth:0, barPercentage:.88, categoryPercentage:.88, order:-1
        }]:[])
      ]},
    options:{ maintainAspectRatio:false,
      plugins:{ legend:{ labels:{ color:p.axis } } },
      interaction:{ mode:'index', intersect:false },
      scales:{
        x:{ ticks:{ color:p.axis }, grid:{ color:p.grid2 } },
        y:{ ticks:{ color:p.axis }, grid:{ color:p.grid }, title:{display:true, text:'°C', color:p.axis} },
        y1:{ position:'right', ticks:{ color:p.axis }, grid:{ drawOnChartArea:false }, title:{display:true, text:'%', color:p.axis}, min:0, max:100 }
      }
    }
  });
}

function renderHourlyList(hours){
  const host = document.getElementById('hourly-grid'); 
  if (!host) return;
  host.innerHTML='';
  hours.slice(0,12).forEach(h=>{
    const el=document.createElement('article'); el.className='hour';
    const time = new Date(h.isoTime);
    const apparent = apparentWithFallback(h);
    el.innerHTML = `
      <div class="row"><h4>${time.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</h4>
        <span class="muted">${time.toLocaleDateString([], {weekday:'short'})}</span></div>
      <div class="sep"></div>
      <div class="row">
        <div class="t">${Math.round(apparent)}°C</div>
        <div class="feel">Feels ${Math.round(apparent)}°C</div>
      </div>
      <div class="row">
        <div class="pop">${Math.round(h.pop)}% rain</div>
        <div class="wind">${Math.round(h.wind)} km/h</div>
      </div>
      <div class="row">
        <div class="uv">UV ${Math.round(h.uv)}</div>
        <div></div>
      </div>`;
    host.appendChild(el);
  });
}

/* ---------- events & app flow ---------- */
function sliceByHorizon(hours){ 
  const sel = document.getElementById('horizon-select');
  return (sel && sel.value==='24h')? hours.slice(0,24) : hours.slice(0,48); 
}

async function loadCity({name,lat,lon}){
  console.log('Loading city:', name, lat, lon);
  setStatus('loading');
  try {
    const hours = await fetchForecast(lat,lon);
    console.log('Fetched hours:', hours.length);
    window.hoursAll = hours;
    renderSummary(hours, name);
    renderAdvice(hours);
    const sliced = sliceByHorizon(hours);
    renderChart(sliced); 
    renderHourlyList(hours);
    setStatus('ready');
    console.log('City loaded successfully');
  } catch(err) {
    console.error('LoadCity error:', err);
    showError(`Failed to load weather data: ${err.message}`);
    setStatus('error');
  }
}

// Theme toggle
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = newTheme === 'dark' ? 'Light' : 'Dark';
  // Re-render chart with new colors
  if (window.hoursAll?.length) {
    const sliced = sliceByHorizon(window.hoursAll);
    renderChart(sliced);
  }
}

// Events
document.addEventListener('DOMContentLoaded', function() {
  // Search form
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const query = document.getElementById('q')?.value?.trim();
      if (!query) return;
      try{ 
        const city = await geocodeCity(query); 
        await loadCity(city); 
      }
      catch(err){ showError(err.message || 'Search failed'); }
    });
  }

  // Location button
  const locateBtn = document.getElementById('btn-locate');
  if (locateBtn) {
    locateBtn.addEventListener('click', async ()=>{
      if (!navigator.geolocation) return showError('Geolocation not supported');
      navigator.geolocation.getCurrentPosition(async pos=>{
        try{
          await loadCity({ name:'Current location', lat:+pos.coords.latitude, lon:+pos.coords.longitude });
        }catch(e){ showError('Failed to load current location'); }
      }, err=>showError('Location error'));
    });
  }

  // Horizon select
  const horizonSelect = document.getElementById('horizon-select');
  if (horizonSelect) {
    horizonSelect.addEventListener('change', ()=>{
      const sliced = sliceByHorizon(window.hoursAll||[]);
      renderChart(sliced); 
      renderHourlyList(window.hoursAll||[]);
    });
  }

  // Toggle precipitation
  const togglePop = document.getElementById('toggle-pop');
  if (togglePop) {
    togglePop.addEventListener('change', ()=> renderChart(sliceByHorizon(window.hoursAll||[])));
  }

  // Theme toggle
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  // Mobile search form
  const mobileSearchForm = document.getElementById('mobile-search-form');
  if (mobileSearchForm) {
    mobileSearchForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const query = document.getElementById('mobile-q')?.value?.trim();
      if (!query) return;
      try{ 
        const city = await geocodeCity(query); 
        await loadCity(city); 
        // Close mobile menu after search
        const drawer = document.getElementById('drawer');
        const navToggle = document.getElementById('nav-toggle');
        if (drawer && navToggle) {
          drawer.classList.remove('drawer-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
      catch(err){ showError(err.message || 'Search failed'); }
    });
  }

  // Mobile location button
  const mobileLocateBtn = document.getElementById('mobile-btn-locate');
  if (mobileLocateBtn) {
    mobileLocateBtn.addEventListener('click', async ()=>{
      if (!navigator.geolocation) return showError('Geolocation not supported');
      navigator.geolocation.getCurrentPosition(async pos=>{
        try{
          await loadCity({ name:'Current location', lat:+pos.coords.latitude, lon:+pos.coords.longitude });
          // Close mobile menu after location
          const drawer = document.getElementById('drawer');
          const navToggle = document.getElementById('nav-toggle');
          if (drawer && navToggle) {
            drawer.classList.remove('drawer-open');
            navToggle.setAttribute('aria-expanded', 'false');
          }
        }catch(e){ showError('Failed to load current location'); }
      }, err=>showError('Location error'));
    });
  }

  // Mobile theme toggle
  const mobileThemeBtn = document.getElementById('mobile-theme-toggle');
  if (mobileThemeBtn) {
    mobileThemeBtn.addEventListener('click', toggleTheme);
  }

  /* 汉堡菜单：打开/关闭抽屉 */
  const navBtn = document.getElementById('nav-toggle');
  const drawer = document.getElementById('drawer');
  if (navBtn && drawer) {
    navBtn.addEventListener('click', ()=>{
      const open = drawer.classList.toggle('open');
      navBtn.setAttribute('aria-expanded', open?'true':'false');
    });
  }

  // Favorites functionality
  setupFavorites();

  // Default city load with fallback to demo data
  (async function init(){ 
    try{
      debugLog('Initializing app...');
      setStatus('loading');
      
      // Try real API first
      try {
        debugLog('Attempting to geocode Toronto...');
        const oak = await geocodeCity('Toronto, Ontario, Canada');
        debugLog('Geocoded city: ' + JSON.stringify(oak));
        await loadCity(oak);
        debugLog('App initialized successfully with real data');
      } catch (apiError) {
        debugLog('API failed: ' + apiError.message + ', using demo data');
        // Fallback to demo data
        loadDemoData();
      }
      
    } catch(e){ 
      debugLog('Initialization failed: ' + e.message);
      setStatus('error');
      showError(`Init failed: ${e.message}`); 
    } 
  })();
});

// Favorites system
function setupFavorites() {
  const favForm = document.getElementById('fav-form');
  const favAdd = document.getElementById('fav-add');
  const favList = document.getElementById('fav-list');
  const favAlias = document.getElementById('fav-alias');

  if (!favAdd || !favList) return;

  favAdd.addEventListener('click', () => {
    const cityName = document.getElementById('city-name')?.textContent;
    if (!cityName || cityName === '—') {
      alert('Load a city first');
      return;
    }
    
    const alias = favAlias ? favAlias.value.trim() : '';
    const favorites = JSON.parse(localStorage.getItem('weather-favorites') || '[]');
    
    const newFav = {
      id: Date.now(),
      name: cityName,
      alias: alias || cityName,
      timestamp: new Date().toISOString()
    };
    
    favorites.push(newFav);
    localStorage.setItem('weather-favorites', JSON.stringify(favorites));
    
    if (favAlias) favAlias.value = '';
    renderFavorites();
  });

  renderFavorites();
}

function renderFavorites() {
  const favList = document.getElementById('fav-list');
  if (!favList) return;

  const favorites = JSON.parse(localStorage.getItem('weather-favorites') || '[]');
  
  favList.innerHTML = favorites.map(fav => `
    <li class="fav-item">
      <button class="btn" onclick="loadFavoriteCity('${fav.name}')">${fav.alias}</button>
      <button class="btn btn-danger" onclick="removeFavorite(${fav.id})">Remove</button>
    </li>
  `).join('');
}

async function loadFavoriteCity(cityName) {
  try {
    const city = await geocodeCity(cityName);
    await loadCity(city);
  } catch(err) {
    showError('Failed to load favorite city');
  }
}

function removeFavorite(id) {
  const favorites = JSON.parse(localStorage.getItem('weather-favorites') || '[]');
  const updated = favorites.filter(fav => fav.id !== id);
  localStorage.setItem('weather-favorites', JSON.stringify(updated));
  renderFavorites();
}

// Demo data fallback
function loadDemoData() {
  console.log('Loading demo data...');
  const now = new Date();
  const demoHours = [];
  
  for (let i = 0; i < 48; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    demoHours.push({
      isoTime: time.toISOString(),
      temp: 15 + Math.sin(i / 24 * Math.PI * 2) * 8 + Math.random() * 3,
      apparent: 16 + Math.sin(i / 24 * Math.PI * 2) * 8 + Math.random() * 3,
      rh: 50 + Math.random() * 30,
      pop: Math.max(0, Math.sin(i / 12 * Math.PI) * 60 + Math.random() * 20),
      precip: Math.random() * 2,
      wind: 5 + Math.random() * 10,
      uv: Math.max(0, Math.sin((i - 6) / 12 * Math.PI) * 8)
    });
  }
  
  window.hoursAll = demoHours;
  renderSummary(demoHours, 'Demo City, Ontario, Canada');
  renderAdvice(demoHours);
  const sliced = sliceByHorizon(demoHours);
  renderChart(sliced);
  renderHourlyList(demoHours);
  setStatus('ready');
  console.log('Demo data loaded successfully');
}

/* utils */
function toAsciiEnglish(s){ return (s||'').normalize('NFKD').replace(/[^\x00-\x7F]/g,'').replace(/\s+/g,' ').trim(); }
function englishLabelFromAddress(a){
  if (!a) return '';
  const parts = [a.city||a.town||a.village||a.county, a.state, a.country].filter(Boolean);
  return toAsciiEnglish(parts.join(', '));
}
