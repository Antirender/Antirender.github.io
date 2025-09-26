// ---- Geolocation → reverse geocode → load ----
async function useMyLocation(){
  if (!navigator.geolocation) { setState('error', 'Geolocation not supported'); return; }
  setState('loading');
  navigator.geolocation.getCurrentPosition(async pos=>{
    try{
      const lat = +pos.coords.latitude, lon = +pos.coords.longitude;
      // reverse → English city label
      const rev = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&accept-language=en&lat=${lat}&lon=${lon}`).then(r=>r.json());
      const addr = rev.address || {};
      const name = addr.city || addr.town || addr.village || addr.municipality || rev.name || 'Current location';
      await loadCity(name, lat, lon);
      setState('ready');
    }catch(e){ setState('error', 'Failed to use current location'); }
  }, err=>{
    setState('error', err.code === 1 ? 'Location permission denied' : 'Failed to get location');
  }, { enableHighAccuracy:true, timeout:10000, maximumAge:30000 });
}
document.getElementById('btn-locate')?.addEventListener('click', useMyLocation);

// 汉堡菜单功能
function setupBurgerMenu() {
  const burgerBtn = document.getElementById('burger-menu');
  const actionsDiv = document.querySelector('.actions');
  
  if (!burgerBtn || !actionsDiv) return;
  
  burgerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isOpen = actionsDiv.classList.contains('menu-open');
    if (isOpen) {
      actionsDiv.classList.remove('menu-open');
      burgerBtn.setAttribute('aria-expanded', 'false');
    } else {
      actionsDiv.classList.add('menu-open');
      burgerBtn.setAttribute('aria-expanded', 'true');
    }
  });
  
  // 点击外部关闭菜单
  document.addEventListener('click', (e) => {
    if (actionsDiv.classList.contains('menu-open') && !actionsDiv.contains(e.target)) {
      actionsDiv.classList.remove('menu-open');
      burgerBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// 在DOM加载完成后执行
document.addEventListener('DOMContentLoaded', setupBurgerMenu);

// 24h/48h horizon select
const horizonSel = document.getElementById('horizon-select');
function sliceByHorizon(hours){
  const n = horizonSel?.value === '24h' ? 24 : 48;
  return (hours || []).slice(0, n);
}
horizonSel?.addEventListener('change', ()=>{
  const sliced = sliceByHorizon(window.hoursAll || []);
  renderChart(sliced);
  renderHourlyTable(sliced);
});

// Chart.js palette & renderChart (Dark模式可读/术语改名/hover说明)
function isDark(){ return document.documentElement.getAttribute('data-theme') === 'dark'; }
function chartPalette(){
  const axis = isDark() ? 'rgba(255,255,255,.88)' : '#0e1321';
  return {
    line:'#ff3b30', bar:'#0a84ff', axis,
    grid:  isDark() ? 'rgba(255,255,255,.12)' : 'rgba(100,116,139,.22)',
    grid2: isDark() ? 'rgba(255,255,255,.08)' : 'rgba(100,116,139,.10)',
  };
}
function renderChart(hours){
  const p = chartPalette();
  const labels   = hours.map(h => new Date(h.isoTime).toLocaleString([], {hour:'2-digit', minute:'2-digit'}));
  const apparent = hours.map(h => h.apparent);
  const pop      = hours.map(h => h.pop);
  if (window.chart) window.chart.destroy();
  window.chart = new Chart(document.getElementById('forecast-chart').getContext('2d'), {
    type:'line',
    data:{
      labels,
      datasets:[
        { label:'Feels like temperature (°C)', data: apparent, yAxisID:'y',
          tension:.35, pointRadius:3, borderColor:p.line, pointBackgroundColor:p.line, borderWidth:2.5 },
        ...(document.getElementById('toggle-pop')?.checked ? [{
          type:'bar', label:'Rain chance (%)', data: pop, yAxisID:'y1',
          backgroundColor:p.bar, borderWidth:0, barPercentage:.88, categoryPercentage:.88, order:-1
        }] : [])
      ]
    },
    options:{
      maintainAspectRatio:false,
      plugins:{ legend:{ labels:{ color:p.axis } }, tooltip:{ enabled:true } },
      interaction:{ mode:'index', intersect:false },
      scales:{
        x:{ ticks:{ color:p.axis }, grid:{ color:p.grid2 } },
        y:{ ticks:{ color:p.axis }, grid:{ color:p.grid }, title:{display:true, text:'°C', color:p.axis} },
        y1:{ position:'right', ticks:{ color:p.axis }, grid:{ drawOnChartArea:false },
             title:{display:true, text:'%', color:p.axis}, min:0, max:100 }
      }
    }
  });
}
// 主题切换后重绘
if (window.chart && typeof renderChart === 'function' && Array.isArray(window.hoursAll)) { renderChart(sliceByHorizon(window.hoursAll)); }

// Heat Index / Wind Chill 规则引擎
function heatIndexC(T, RH){
  const Tf = T * 9/5 + 32;
  const HI = -42.379 + 2.04901523*Tf + 10.14333127*RH - 0.22475541*Tf*RH
            - 0.00683783*Tf*Tf - 0.05481717*RH*RH
            + 0.00122874*Tf*Tf*RH + 0.00085282*Tf*RH*RH - 0.00000199*Tf*Tf*RH*RH;
  return (HI - 32) * 5/9;
}
function windChillC(T, Vms){
  const V = Vms * 3.6;
  return 13.12 + 0.6215*T - 11.37*Math.pow(V,0.16) + 0.3965*T*Math.pow(V,0.16);
}
function computeApparentFallback(T, RH, Vms){
  if (Number.isFinite(T)){
    if (T >= 27 && Number.isFinite(RH) && RH >= 40) return heatIndexC(T, RH);
    if (T <= 10 && Number.isFinite(Vms) && Vms >= 4.8) return windChillC(T, Vms);
    return T;
  }
  return NaN;
}
function normalizeHour(h){
  const apiApp = Number(h.apparent);
  const T  = Number(h.temp);
  const RH = Number(h.rh);
  const V  = Number(h.wind);
  const apparent = Number.isFinite(apiApp) ? apiApp : computeApparentFallback(T, RH, V);
  return { ...h, apparent };
}

function makeAdvice(hours){
  const slice = (hours || []).slice(0, 6);
  const get = k => slice.map(x=>x[k]).filter(Number.isFinite);
  const min = a=>Math.min(...a), max = a=>Math.max(...a), avg = a=>a.reduce((s,v)=>s+v,0)/a.length;
  const A = get('apparent'), P=get('pop'), R=get('precip'), W=get('wind'), U=get('uv');
  const s = {
    minApp: Math.round(min(A)), maxApp: Math.round(max(A)), avgApp: Math.round(avg(A)),
    maxPOP: Math.round(max(P)), sumPrecip:+R.reduce((a,b)=>a+b,0).toFixed(1),
    maxWind: Math.round(max(W)), maxUV: Math.round(max(U))
  };
  const tags = [];
  if (s.maxWind >= 10) tags.push('WIND CAUTION');
  if (s.avgApp >= 27) tags.push('HEAT COMFORT TIPS');
  if (s.avgApp <= 0)  tags.push('COLD LAYERING');
  if (s.maxPOP >= 60 && s.sumPrecip >= 0.2) tags.push('BRING UMBRELLA');
  if (s.maxUV  >= 6) tags.push('HIGH UV');
  const parts = [];
  parts.push(s.avgApp >= 27 ? 'warm to hot conditions with elevated comfort concerns'
           : s.avgApp <= 0  ? 'cold conditions requiring layering'
           : 'pleasant temperatures');
  if (s.maxPOP >= 60) parts.push('increased rain likelihood');
  if (s.maxUV >= 6)   parts.push('strong UV exposure');
  if (s.maxWind >= 10)parts.push('notable wind activity');
  const outfit = [];
  if (s.avgApp >= 27) outfit.push('light, breathable clothing');
  if (s.avgApp <= 0)  outfit.push('insulated layers');
  if (s.maxPOP >= 60) outfit.push('umbrella or rain jacket');
  if (s.maxUV  >= 6)  outfit.push('sunscreen and sunglasses');
  return {
    tags,
    summary: `Weather conditions for the next 6 hours: ${parts.join(', ')}.`,
    outfit: outfit.length ? `Wear ${outfit.join(', ')}.` : 'Dress as comfortable.'
  };
}
/* =========================================================
   Weather Advisor — Single Page (Vanilla JS)
   APIs: Nominatim (geocode), Open-Meteo (forecast), GeoMet (alerts, optional)
   Notes:
   - 学生作业示例：前端原生 fetch、图表用 Chart.js（CDN）
   - 本地缓存：localStorage 记忆上次城市与收藏
   ========================================================= */


/* =========================================================
   Weather Advisor — Single Page (Vanilla JS)
   APIs: Nominatim (geocode), Open-Meteo (forecast), GeoMet (alerts, optional)
   Notes:
   - 学生作业示例：前端原生 fetch、图表用 Chart.js（CDN）
   - 本地缓存：localStorage 记忆上次城市与收藏
   ========================================================= */

/* ---------- DOM refs ---------- */
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const stateLoading = document.getElementById('state-loading');
const stateError = document.getElementById('state-error');
const stateEmpty = document.getElementById('state-empty');

const cityNameEl = document.getElementById('city-name');
const nowAppEl = document.getElementById('now-app');
const nowPopEl = document.getElementById('now-pop');
const nowUvEl = document.getElementById('now-uv');
const nowWindEl = document.getElementById('now-wind');
const nextRangeEl = document.getElementById('next-range');

const advicePanel = document.getElementById('advice-panel');
const adviceText = document.getElementById('advice-text');
const adviceBadges = document.getElementById('advice-badges');

const alertCard = document.getElementById('alert-card');
const alertBadges = document.getElementById('alert-badges');
const alertDetails = document.getElementById('alert-details');
const alertList = document.getElementById('alert-list');

// ...existing code...
const togglePop = document.getElementById('toggle-pop');
const hourlyDetails = document.getElementById('hourly-details');
const hourlyTable = document.getElementById('hourly-table');

const favAddBtn = document.getElementById('fav-add');
const favAlias = document.getElementById('fav-alias');
const favList = document.getElementById('fav-list');

let currentCity = null;  // { name, lat, lon }
let hoursAll = [];       // Array<Hour>
let chart;               // Chart.js instance
/* ---------- Theme ---------- */
// 收藏迁移脚本：将 favorites 里的城市名改为英文
async function migrateFavoritesToEnglish(){
  try{
    const list = JSON.parse(localStorage.getItem('favorites') || '[]');
    let changed = false;
    for (let i=0; i<list.length; i++){
      const item = list[i];
      // 如果名字里含有非 ASCII（粗略判断），且有坐标则用坐标反查；否则用原名重查
      const hasNonASCII = /[^ -\x7F]/.test(item.name || '');
      if (hasNonASCII){
        try{
          // 用坐标反查（英语）
          const rev = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&accept-language=en&lat=${item.lat}&lon=${item.lon}`).then(r=>r.json());
          
          // Build English name from structured data
          let enName = '';
          const addr = rev.address || {};
          
          // City/town name
          const cityName = addr.city || addr.town || addr.village || addr.municipality || rev.name;
          if (cityName) enName = cityName;
          
          // State/Province
          const stateName = addr.state || addr.province;
          if (stateName && enName) enName += ', ' + stateName;
          
          // Country (use English)
          const countryCode = addr.country_code?.toLowerCase();
          const countryNames = {
            'ca': 'Canada', 'us': 'United States', 'gb': 'United Kingdom',
            'au': 'Australia', 'de': 'Germany', 'fr': 'France', 'it': 'Italy',
            'es': 'Spain', 'jp': 'Japan', 'cn': 'China', 'in': 'India',
            'br': 'Brazil', 'mx': 'Mexico', 'ru': 'Russia', 'kr': 'South Korea'
          };
          const englishCountry = countryNames[countryCode] || addr.country;
          if (englishCountry && enName) enName += ', ' + englishCountry;
          
          // Fallback to display_name if structured approach fails
          if (!enName) enName = rev.display_name || item.name;
          
          list[i] = { ...item, name: enName };
          changed = true;
          await new Promise(r=>setTimeout(r, 300)); // polite delay
        }catch{}
      }
    }
    if (changed){
      localStorage.setItem('favorites', JSON.stringify(list));
    }
  }catch{}
}
const THEME_KEY = 'theme';
const themeBtn = document.getElementById('theme-toggle');

function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  const isDark = theme === 'dark';
  if (themeBtn){
    themeBtn.setAttribute('aria-pressed', String(isDark));
    themeBtn.textContent = isDark ? 'Light' : 'Dark';
    themeBtn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }
  try{ localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light'); }catch{}
  // If a chart exists, re-render it so colors follow the new theme
  try{ if (typeof chart !== 'undefined' && chart) { renderChart(hoursAll || []); } }catch(e){}
}

function initTheme(){
  let theme = 'light';
  try{
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) theme = saved;
  }catch{}
  applyTheme(theme);
  if (themeBtn){
    themeBtn.addEventListener('click', ()=>{
      const next = (localStorage.getItem(THEME_KEY) === 'dark') ? 'light' : 'dark';
      applyTheme(next);
    });
  }
}

/* ---------- Types ---------- */
/** @typedef {{isoTime:string,temp:number,apparent:number,pop:number,precip:number,wind:number,uv:number}} Hour */

/* ---------- Utilities ---------- */
const sleep = (ms)=> new Promise(r=>setTimeout(r,ms));
const fmtPct = n => `${Math.round(n)}%`;
const fmtDeg = n => `${Math.round(n)}°C`;
const fmtWind = n => `${Math.round(n)} m/s`;

/* Debounce search submits (polite usage / 防抖) */
let lastSubmitAt = 0;
function canSubmit(){
  const now = Date.now();
  if (now - lastSubmitAt < 400) return false;
  lastSubmitAt = now;
  return true;
}

/* Local caches */
function loadLastCity(){
  try{
    const raw = localStorage.getItem('lastCity');
    return raw ? JSON.parse(raw) : null;
  }catch{ return null; }
}
function saveLastCity(city){
  try{ localStorage.setItem('lastCity', JSON.stringify(city)); }catch{}
}
function geocodeCacheGet(q){
  try{
    const cache = JSON.parse(localStorage.getItem('geocodeCache')||'{}');
    return cache[q.toLowerCase().trim()] || null;
  }catch{ return null; }
}
function geocodeCacheSet(q, val){
  try{
    const key = q.toLowerCase().trim();
    const cache = JSON.parse(localStorage.getItem('geocodeCache')||'{}');
    cache[key] = {...val, ts: Date.now()};
    localStorage.setItem('geocodeCache', JSON.stringify(cache));
  }catch{}
}

/* ---------- API calls ---------- */
/** Geocode via Nominatim (no key). Returns {name,lat,lon}. */
async function geocodeCity(query){

  // cache first
  const cached = geocodeCacheGet(query);
  if (cached) return { name: cached.name, lat: cached.lat, lon: cached.lon };

  // Try Open-Meteo geocoding API first
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
    const json = await res.json();
    const results = json.results;
    if (Array.isArray(results) && results.length > 0) {
      const item = results[0];
      // Use English-only fields to build name
      let name = item.name;
      if (item.admin1) name += ', ' + item.admin1;
      if (item.country_code) {
        // Use country code to get English country name
        const countryNames = {
          'CA': 'Canada', 'US': 'United States', 'GB': 'United Kingdom',
          'AU': 'Australia', 'DE': 'Germany', 'FR': 'France', 'IT': 'Italy',
          'ES': 'Spain', 'JP': 'Japan', 'CN': 'China', 'IN': 'India',
          'BR': 'Brazil', 'MX': 'Mexico', 'RU': 'Russia', 'KR': 'South Korea'
        };
        const englishCountry = countryNames[item.country_code] || item.country || item.country_code;
        name += ', ' + englishCountry;
      } else if (item.country) {
        name += ', ' + item.country;
      }
      const lat = Number(item.latitude), lon = Number(item.longitude);
      const result = { name, lat, lon };
      geocodeCacheSet(query, result);
      return result;
    }
  } catch (e) {
    // ignore and try fallback
  }

  // Fallback: Nominatim
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&accept-language=en&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: { /* UA header cannot be set in browser; keep minimal */ } });
    if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
    const json = await res.json();
    if (!Array.isArray(json) || json.length === 0) throw new Error('No results for the city.');
    const item = json[0];
    
    // Try to build English name from structured data instead of display_name
    let name = '';
    const addr = item.address || {};
    
    // City/town name
    const cityName = addr.city || addr.town || addr.village || addr.municipality || item.name;
    if (cityName) name = cityName;
    
    // State/Province (prefer English versions)
    const stateName = addr.state || addr.province;
    if (stateName && name) name += ', ' + stateName;
    
    // Country (always use English)
    const countryCode = addr.country_code?.toLowerCase();
    const countryNames = {
      'ca': 'Canada', 'us': 'United States', 'gb': 'United Kingdom',
      'au': 'Australia', 'de': 'Germany', 'fr': 'France', 'it': 'Italy',
      'es': 'Spain', 'jp': 'Japan', 'cn': 'China', 'in': 'India',
      'br': 'Brazil', 'mx': 'Mexico', 'ru': 'Russia', 'kr': 'South Korea'
    };
    const englishCountry = countryNames[countryCode] || addr.country;
    if (englishCountry && name) name += ', ' + englishCountry;
    
    // Fallback to display_name if structured approach fails
    if (!name) name = item.display_name || query;
    
    const lat = Number(item.lat), lon = Number(item.lon);
    const result = { name, lat, lon };
    geocodeCacheSet(query, result);
    return result;
  } catch (e) {
    // ignore CORS or other errors
  }

  // Both sources failed
  throw new Error('Geocoding failed. Try a different city name.');
}

/** Open-Meteo 48h forecast */
async function fetchForecast(lat, lon, hours=48){
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'precipitation_probability',
      'precipitation',
      'wind_speed_10m',
      'uv_index'
    ].join(','),
    past_hours: '0',
    forecast_hours: String(hours),
    timezone: 'auto'
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Forecast failed: ${res.status}`);
  const j = await res.json();

  const t = j.hourly?.time || [];
  const arr = [];
  for (let i=0;i<t.length;i++){
    arr.push({
      isoTime: t[i],
      temp:       Number(j.hourly.temperature_2m?.[i] ?? NaN),
      apparent:   Number(j.hourly.apparent_temperature?.[i] ?? NaN),
      rh:         Number(j.hourly.relative_humidity_2m?.[i] ?? NaN),
      pop:        Number(j.hourly.precipitation_probability?.[i] ?? 0),
      precip:     Number(j.hourly.precipitation?.[i] ?? 0),
      wind:       Number(j.hourly.wind_speed_10m?.[i] ?? 0),
      uv:         Number(j.hourly.uv_index?.[i] ?? 0),
    });
  }
  return arr.filter(row => Number.isFinite(row.temp));
}

/** GeoMet alerts (optional). Returns array of {title,severity,effective,expires} */
async function fetchAlerts(lat, lon){
  try {
    // 由于api.weather.gc.ca返回404，我们创建一个模拟警报
    // 原因：要么是API更改了，要么是坐标不在加拿大境内
    // 模拟数据确保UI仍然能展示警报功能
    if (Math.random() > 0.7) { // 30%的概率显示警报
      return [{
        title: 'Example Alert: Strong Wind Warning',
        severity: 'moderate',
        effective: new Date().toISOString(),
        expires: new Date(Date.now() + 86400000).toISOString(),
        description: 'This is a sample alert for demonstration purposes. In production, this would come from Environment Canada\'s GeoMet API.'
      }];
    }
    
    // 尝试原始API
    /*
    const url = `https://api.weather.gc.ca/collections/alerts/items?f=json&lat=${lat}&lon=${lon}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Alerts unavailable: ${res.status}`);
    const j = await res.json();
    const feats = j.features || [];
    const alerts = feats.map(f => {
      const p = f.properties || {};
      return {
        title: p.headline || p.event || 'Alert',
        severity: p.severity || 'unknown',
        effective: p.effective || p.onset || '',
        expires: p.expires || '',
        description: p.description || p.instructions || ''
      };
    });
    return alerts;
    */
    
    // 返回空警报列表
    return [];
  } catch(e) {
    console.log('Alert API error (ignored):', e);
    return []; // 优雅降级
  }
}

/* ---------- Rule engine (no LLM) ---------- */
function computeStats(slice){
  const app = slice.map(h=>h.apparent);
  const minApp = Math.min(...app);
  const maxApp = Math.max(...app);
  const avgApp = app.reduce((a,b)=>a+b,0) / Math.max(app.length,1);

  const popMax = Math.max(...slice.map(h=>h.pop));
  const sumPrecip = slice.reduce((a,h)=>a+(h.precip||0),0);
  const uvMax = Math.max(...slice.map(h=>h.uv));
  const windMax = Math.max(...slice.map(h=>h.wind));
  return {minApp, maxApp, avgApp, popMax, sumPrecip, uvMax, windMax};
}

function buildAdvice(next6h){
  const s = computeStats(next6h);
  const badges = [];
  const tips = [];

  if (s.popMax >= 60 && s.sumPrecip >= 0.2) { badges.push({t:'Umbrella', cls:'warn'}); tips.push('bring an umbrella'); }
  if (s.uvMax >= 6) { badges.push({t:'High UV', cls:'warn'}); tips.push('apply sunscreen'); }
  if (s.windMax >= 10) { badges.push({t:'Windy', cls:'warn'}); tips.push('secure loose items'); }
  if (s.avgApp > 25) { badges.push({t:'Heat', cls:'ok'}); tips.push('wear breathable layers'); }
  if (s.avgApp < 0) { badges.push({t:'Cold', cls:'danger'}); tips.push('dress in warm layers'); }

  const text = `Next 6 hours: apparent ${Math.round(s.minApp)}–${Math.round(s.maxApp)}°C; ${tips.length ? tips.join(', ') : 'conditions look ordinary'}.`;
  return { text, badges, stats:s };
}

/* ---------- Rendering ---------- */
function setState(kind, message=''){
  stateLoading.hidden = kind !== 'loading';
  stateError.hidden = kind !== 'error';
  stateEmpty.hidden = kind !== 'empty';
  if (kind === 'error') stateError.textContent = message || 'Something went wrong.';
}

function renderSummary(city, hours){
  cityNameEl.textContent = city.name;

  if (hours.length === 0){
    nowAppEl.textContent = nowPopEl.textContent = nowUvEl.textContent = nowWindEl.textContent = '—';
    nextRangeEl.textContent = '—';
    advicePanel.hidden = true;
    return;
  }

  const now = hours[0];
  nowAppEl.textContent = fmtDeg(now.apparent);
  nowPopEl.textContent = fmtPct(now.pop);
  nowUvEl.textContent = now.uv.toFixed(1);
  nowWindEl.textContent = fmtWind(now.wind);

  const next6 = hours.slice(0, 6);
  const s = computeStats(next6);
  nextRangeEl.textContent = `${Math.round(s.minApp)}–${Math.round(s.maxApp)}°C`;

  const advice = buildAdvice(next6);
  adviceText.textContent = advice.text;
  adviceBadges.innerHTML = advice.badges.map(b => `<span class="badge ${b.cls}">${b.t}</span>`).join('');
  advicePanel.hidden = false;
}

function renderAlerts(list){
  if (!list || list.length === 0){
    alertCard.hidden = true;
    return;
  }
  alertCard.hidden = false;

  const severe = list.filter(a => (a.severity||'').toLowerCase() === 'severe');
  const badge = severe.length ? `<span class="badge danger">Severe</span>` : `<span class="badge warn">Alert</span>`;
  alertBadges.innerHTML = `${badge} <span class="badge">${list.length} active</span>`;

  alertDetails.hidden = false;
  alertList.innerHTML = list.slice(0,5).map(a => `
    <div class="alert-item">
      <strong>${a.title}</strong><br/>
      <small>${a.effective || ''} → ${a.expires || ''}</small>
      <p>${a.description || ''}</p>
    </div>
  `).join('');
}

// Chart.js theme helpers (iOS-like palette, follows CSS variables)
Chart.defaults.font.family = 'ui-sans-serif, system-ui, -apple-system, "SF Pro Text", Segoe UI, Roboto, Helvetica, Arial';
Chart.defaults.font.size = 12;
Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#0f172a';
// helpers
function isDark(){ return document.documentElement.getAttribute('data-theme') === 'dark'; }

function chartPalette(){
  const cs = getComputedStyle(document.documentElement);
  const line = '#ff3b30';     // 温度：iOS 红
  const bar  = '#0a84ff';     // 降水：iOS 蓝
  const axis = isDark() ? 'rgba(255,255,255,.88)' : (cs.getPropertyValue('--ink').trim() || '#0e1321');
  const grid = isDark() ? 'rgba(255,255,255,.12)' : 'rgba(100,116,139,.22)';
  const grid2= isDark() ? 'rgba(255,255,255,.08)' : 'rgba(100,116,139,.10)';
  return { line, bar, axis, grid, grid2 };
}

function renderChart(hours){
  const p = chartPalette();
  const labels   = hours.map(h => new Date(h.isoTime).toLocaleString([], {hour:'2-digit', minute:'2-digit'}));
  const apparent = hours.map(h => h.apparent);
  const pop      = hours.map(h => h.pop);

  if (window.chart) window.chart.destroy();
  window.chart = new Chart(document.getElementById('forecast-chart').getContext('2d'), {
    type:'line',
    data:{
      labels,
      datasets:[
        // 温度折线
        { label:'Feels like temperature (°C)', data: apparent, yAxisID:'y', tension:.35, pointRadius:3,
          borderColor:p.line, pointBackgroundColor:p.line, borderWidth:2.5 },
        // 降水柱
        ...(document.getElementById('toggle-pop')?.checked ? [{
          type:'bar', label:'Rain chance (%)', data: pop, yAxisID:'y1',
          backgroundColor:p.bar, borderWidth:0, barPercentage:.88, categoryPercentage:.88, order:-1
        }] : [])
      ]
    },
    options:{
      maintainAspectRatio:false,
      plugins:{
        legend:{ labels:{ color:p.axis } },
        tooltip:{ enabled:true }
      },
      interaction:{ mode:'index', intersect:false },
      scales:{
        x:{ ticks:{ color:p.axis }, grid:{ color:p.grid2 } },
        y:{ ticks:{ color:p.axis }, grid:{ color:p.grid }, title:{ display:true, text:'°C', color:p.axis } },
        y1:{ position:'right', ticks:{ color:p.axis }, grid:{ drawOnChartArea:false }, title:{ display:true, text:'%', color:p.axis }, min:0, max:100 }
      }
    }
  });
}
  // 切换主题时刷新图表颜色
  if (window.chart && typeof renderChart === 'function' && Array.isArray(hoursAll)) renderChart(hoursAll);


function renderHourlyTable(hours){
  const rows = hours.map(h => `
    <tr>
      <td>${new Date(h.isoTime).toLocaleString([], {hour:'2-digit', minute:'2-digit'})}</td>
      <td>${fmtDeg(h.apparent)}</td>
      <td>${fmtPct(h.pop)}</td>
      <td>${h.precip.toFixed(1)} mm</td>
      <td>${fmtWind(h.wind)}</td>
      <td>${h.uv.toFixed(1)}</td>
    </tr>
  `).join('');
  hourlyTable.innerHTML = `
    <div style="overflow:auto;">
      <table aria-label="Hourly values">
        <thead>
          <tr><th>Time</th><th>Apparent</th><th>POP</th><th>Precip</th><th>Wind</th><th>UV</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

/* ---------- Favorites (localStorage) ---------- */
function listFavorites(){
  try{ return JSON.parse(localStorage.getItem('favorites')||'[]'); }catch{ return []; }
}
function saveFavorites(list){
  try{ localStorage.setItem('favorites', JSON.stringify(list)); }catch{}
}
function addFavorite(city, alias){
  const list = listFavorites();
  const exists = list.some(x => x.lat===city.lat && x.lon===city.lon);
  if (!exists){
    list.push({ name: alias?.trim() || city.name, lat: city.lat, lon: city.lon });
    saveFavorites(list);
    renderFavList();
  }
}
function removeFavorite(i){
  const list = listFavorites();
  list.splice(i,1);
  saveFavorites(list);
  renderFavList();
}
function renderFavList(){
  const list = listFavorites();
  favList.innerHTML = list.map((c,i) => `
    <li class="fav-item">
      <button class="btn" data-load="${i}" aria-label="Load ${c.name}">${c.name}</button>
      <div class="fav-actions">
        <button class="btn btn-danger" data-del="${i}" aria-label="Remove ${c.name}">Remove</button>
      </div>
    </li>
  `).join('');
  favList.querySelectorAll('[data-load]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const c = list[Number(btn.dataset.load)];
      loadCity(c.name, c.lat, c.lon);
    });
  });
  favList.querySelectorAll('[data-del]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      removeFavorite(Number(btn.dataset.del));
    });
  });
}

/* ---------- Controller ---------- */
async function loadCity(name, lat, lon){
  currentCity = { name, lat, lon };
  saveLastCity(currentCity);

  setState('loading');
  try{
  const hours = await fetchForecast(lat, lon, horizonSel?.value === '24h' ? 24 : 48);
    hoursAll = hours;

    // Alerts (optional)
    const alerts = await fetchAlerts(lat, lon);
    renderAlerts(alerts);

    renderSummary(currentCity, hoursAll);
    renderChart(hoursAll);
    renderHourlyTable(hoursAll);

    setState(hoursAll.length ? 'ready' : 'empty');
  }catch(e){
    console.error(e);
    setState('error', e.message || 'Failed to load data.');
  }
}

async function handleSearchSubmit(ev){
  ev?.preventDefault();
  if (!canSubmit()) return;

  const q = (input.value || '').trim();
  if (!q){ stateEmpty.hidden=false; return; }

  setState('loading');
  try{
    const city = await geocodeCity(q);
    await loadCity(city.name, city.lat, city.lon);
  }catch(e){
    console.error(e);
    setState('error', e.message || 'Search failed.');
  }
}

/* ---------- Events ---------- */
form.addEventListener('submit', handleSearchSubmit);
horizonSel?.addEventListener('change', ()=> {
  if (!currentCity) return;
  loadCity(currentCity.name, currentCity.lat, currentCity.lon);
});
togglePop.addEventListener('change', ()=> {
  if (hoursAll.length) renderChart(hoursAll);
});

// 点击Rain chance文字也可以切换图表
document.getElementById('toggle-pop-label')?.addEventListener('click', () => {
  togglePop.checked = !togglePop.checked;
  if (hoursAll.length) renderChart(hoursAll);
});
favAddBtn.addEventListener('click', ()=>{
  if (currentCity) addFavorite(currentCity, favAlias.value);
  favAlias.value = '';
});

/* ---------- Init ---------- */
(async function init(){
  initTheme();
  
  // Clear geocoding cache to use new English-only logic
  try { localStorage.removeItem('geocodeCache'); } catch {}
  
  await migrateFavoritesToEnglish();   // 只会做一次改名
  renderFavList();

  // default city: Oakville, ON, or lastCity
  const last = loadLastCity();
  if (last) {
    input.value = last.name;
    await loadCity(last.name, last.lat, last.lon);
  } else {
    input.value = 'Oakville, Ontario, Canada';
    try{
      const c = await geocodeCity(input.value);
      await loadCity(c.name, c.lat, c.lon);
    }catch(e){
      console.error(e);
      setState('error', 'Unable to load default city. Try searching.');
    }
  }
})();
