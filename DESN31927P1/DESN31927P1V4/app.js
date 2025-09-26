/* ---------- boot ---------- */
window.hoursAll = [];
window.weatherAlerts = []; // Global variable to store weather alerts

/**
 * Weather API Configuration
 * 
 * We use Visual Crossing Weather API for weather alerts:
 * - Documentation: https://www.visualcrossing.com/resources/documentation/weather-api/timeline-wfunction renderAdvice(hours){
  const { s, tags, summary, wear } = makeAdvice(hours);
  const tagBox = document.getElementById('advice-tags');
  tagBox.innerHTML = tags.map(t=>`<span class="chip">${t}</span>`).join('') || '<span class="muted">No special flags</span>';
  document.getElementById('advice-text').textContent = summary;
  document.getElementById('wear-text').textContent = wear;
  document.getElementById('comfort-text').textContent = (s.maxUV>=6?'Sunscreen and sunglasses recommended. Stay hydrated.':'Stay comfortable with appropriate layers.');
  document.getElementById('stat-range').textContent = `${s.minApp}° – ${s.maxApp}°`;
  document.getElementById('stat-pop').textContent = `${s.maxPOP}% chance`;
  document.getElementById('stat-uv').textContent = `${s.maxUV}`;
  document.getElementById('stat-wind').textContent = `${s.maxWind} km/h`;
  
  // Update "Why Does It Feel This Way?" section
  updateFeelExplanation(hours);
}

function updateFeelExplanation(hours) {
  if (!hours || hours.length === 0) return;
  
  // Get the current hour data
  const currentHour = hours[0];
  const temp = Math.round(currentHour.temp || 0);
  const feelsLike = Math.round(apparentWithFallback(currentHour));
  const humidity = Math.round(currentHour.humidity || 0);
  const wind = Math.round(currentHour.wind || 0);
  
  // Calculate temperature difference
  const tempDiff = Math.abs(feelsLike - temp);
  const diffText = feelsLike > temp ? "warmer" : "cooler";
  
  // Update the feel explanation elements
  const feelExplEl = document.getElementById('feel-explanation');
  if (feelExplEl) {
    feelExplEl.textContent = `The real feel temperature is ${feelsLike}°C compared to the actual temperature of ${temp}°C. The conditions are ${getComfortLevel(tempDiff, humidity, wind)}.`;
  }
  
  // Update the detailed factor descriptions
  const tempVsFeelEl = document.getElementById('temp-vs-feel');
  if (tempVsFeelEl) {
    if (tempDiff <= 2) {
      tempVsFeelEl.textContent = `The actual and perceived temperatures are very close, meaning atmospheric conditions have minimal impact on how the temperature feels.`;
    } else {
      tempVsFeelEl.textContent = `It feels ${tempDiff}°C ${diffText} than the actual temperature due to the combined effects of humidity, wind, and other atmospheric conditions.`;
    }
  }
  
  const humidityEffectEl = document.getElementById('humidity-effect');
  if (humidityEffectEl) {
    if (humidity > 70) {
      humidityEffectEl.textContent = `The high humidity (${humidity}%) reduces your body's ability to cool through sweating, making it feel warmer than it actually is.`;
    } else if (humidity < 30) {
      humidityEffectEl.textContent = `The low humidity (${humidity}%) allows for effective evaporation of sweat, helping your body maintain a comfortable temperature.`;
    } else {
      humidityEffectEl.textContent = `The moderate humidity (${humidity}%) has a balanced effect on how the temperature feels.`;
    }
  }
  
  const windEffectEl = document.getElementById('wind-effect');
  if (windEffectEl) {
    if (wind > 15) {
      windEffectEl.textContent = `The strong wind (${wind} km/h) increases heat transfer from your body, making it feel significantly cooler in these windy conditions.`;
    } else if (wind > 5) {
      windEffectEl.textContent = `The moderate breeze (${wind} km/h) helps with cooling by moving air across your skin.`;
    } else {
      windEffectEl.textContent = `The low wind speed (${wind} km/h) has minimal effect on how the temperature feels.`;
    }
  }
}

// Helper function to determine comfort level description
function getComfortLevel(tempDiff, humidity, wind) {
  if (tempDiff <= 2 && humidity < 70 && humidity > 30 && wind < 10) {
    return "fairly comfortable with minimal impact on how the temperature feels";
  } else if (tempDiff > 5 || humidity > 80 || wind > 20) {
    return "notably different from the thermometer reading due to current weather conditions";
  } else {
    return "moderately affected by atmospheric conditions";
  }
} * - Provides weather alerts data along with standard weather information
 */

// Visual Crossing Weather API key
const VISUALCROSSING_API_KEY = 'FAF34XM2P3EJ5A7ARARHWQP2X';

function setStatus(s){ document.body.dataset.status = s; }
function showError(msg){ console.error(msg); alert(msg); }
// 静默日志功能
function debugLog(msg) {
  // 开发环境可以解除注释
  // console.log(msg);
}

/* ---------- services (APIs) ---------- */
// 地点缓存
const locationCache = (() => {
  const CACHE_KEY = 'weather_location_cache';
  const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
  
  let cache = {};
  
  try {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // 过滤掉过期的缓存
      const now = Date.now();
      cache = Object.fromEntries(
        Object.entries(parsed)
          .filter(([_, value]) => (now - value.timestamp) < MAX_AGE)
      );
    }
  } catch (e) {
    // 如果加载缓存失败，使用空缓存
    console.warn('Failed to load location cache', e);
  }
  
  return {
    get(query) {
      const normalizedQuery = query.toLowerCase().trim();
      const cachedResult = cache[normalizedQuery];
      if (cachedResult && (Date.now() - cachedResult.timestamp < MAX_AGE)) {
        return cachedResult.data;
      }
      return null;
    },
    set(query, data) {
      const normalizedQuery = query.toLowerCase().trim();
      cache[normalizedQuery] = {
        data,
        timestamp: Date.now()
      };
      
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      } catch (e) {
        console.warn('Failed to save location cache', e);
      }
    }
  };
})();

async function geocodeCity(query){
  // 先检查缓存
  const cachedLocation = locationCache.get(query);
  if (cachedLocation) {
    return cachedLocation;
  }
  
  // 尝试使用 Open-Meteo geocoding API
  try {
    const openMeteoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
    const response = await fetch(openMeteoUrl);
    
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const locationData = { 
          name: result.name + (result.admin1 ? `, ${result.admin1}` : '') + (result.country ? `, ${result.country}` : ''), 
          lat: result.latitude, 
          lon: result.longitude 
        };
        
        // 保存到缓存
        locationCache.set(query, locationData);
        return locationData;
      }
    }
  } catch (error) {
    // 失败时继续尝试下一个API
  }
  
  // 备用方案：尝试使用Nominatim API
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&accept-language=en&q=${encodeURIComponent(query)}`;
    const r = await fetch(nominatimUrl, { 
      headers: {'User-Agent':'weather-advisor-app'},
      mode: 'cors'  // 明确指定CORS模式
    });
    
    if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
    const j = await r.json();
    if (!j?.length) throw new Error('City not found');
    const it = j[0];
    const locationData = { 
      name: englishLabelFromAddress(it.address) || toAsciiEnglish(it.display_name), 
      lat: +it.lat, 
      lon: +it.lon 
    };
    
    // 保存到缓存
    locationCache.set(query, locationData);
    return locationData;
  } catch (error) {
    throw new Error('Location search failed. Please try again later.');
  }
}

async function fetchForecast(lat, lon){
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
      + `&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,precipitation,wind_speed_10m,uv_index,surface_pressure`
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
        uv: +H.uv_index[i],
        pressure: +H.surface_pressure[i]
      });
    }
    return out;
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
}

/* ---------- Weather Alert API ---------- */
async function fetchWeatherAlerts(lat, lon) {
  try {
    // Visual Crossing Weather API for alerts
    const locationParam = `${lat},${lon}`;
    
    const visualCrossingUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(locationParam)}?unitGroup=metric&key=${VISUALCROSSING_API_KEY}&include=alerts&contentType=json`;
    console.log('Fetching weather alerts from Visual Crossing:', visualCrossingUrl);
    
    const response = await fetch(visualCrossingUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    
    const data = await response.json();
    console.log('Visual Crossing weather data:', data);
    
    // Extract and format alerts to match our expected format
    const alerts = (data.alerts || []).map(alert => {
      return {
        event: alert.event,
        description: alert.description || alert.headline || alert.title,
        start: new Date(alert.onset || alert.start || Date.now()).getTime() / 1000,
        end: new Date(alert.ends || alert.end || (Date.now() + 86400000)).getTime() / 1000,
        sender: alert.sender || 'Visual Crossing Weather',
        source: 'Visual Crossing Weather'
      };
    });
    
    window.weatherAlerts = alerts;
    return alerts;
  } catch (error) {
    console.error('Weather alert service failed:', error);
    window.weatherAlerts = [];
    // Don't throw error here - we want the app to continue working even if alerts fail
    return [];
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
  
  // Temperature-based clothing recommendations with specific items
  if (s.avgApp >= 30) {
    outfit.push('very light clothing (t-shirt, shorts, sandals)');
  } else if (s.avgApp >= 25) {
    outfit.push('light, breathable clothing (t-shirt, light pants or shorts)');
  } else if (s.avgApp >= 20) {
    outfit.push('comfortable clothing (t-shirt, light long sleeves, pants)');
  } else if (s.avgApp >= 15) {
    outfit.push('light layers (t-shirt with light jacket or sweater)');
  } else if (s.avgApp >= 10) {
    outfit.push('medium layers (long sleeve shirt, light jacket)');
  } else if (s.avgApp >= 5) {
    outfit.push('warmer clothing (sweater, jacket, jeans)');
  } else if (s.avgApp >= 0) {
    outfit.push('winter clothing (jacket, sweater, warm pants, hat)');
  } else {
    outfit.push('heavy winter clothing (insulated coat, thermal layers, hat, gloves)');
  }
  
  // Add rain protection if needed
  if (s.maxPOP >= 60) {
    outfit.push('umbrella or rain jacket');
    if (s.sumPrecip >= 5) outfit.push('waterproof shoes');
  }
  
  // Add sun protection if needed
  if (s.maxUV >= 6) {
    outfit.push('sunscreen and sunglasses');
    if (s.maxUV >= 8) outfit.push('wide-brimmed hat');
  }
  
  // Add wind protection if needed
  if (s.maxWind >= 20) {
    outfit.push('windproof outer layer');
  }

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
  const appNow = slice[0]?.apparent; const windNow=slice[0]?.wind; 
  const uvNow=slice[0]?.uv; const popNow=slice[0]?.pop;
  const pressureNow = slice[0]?.pressure;
  const min = Math.min(...slice.map(h=>h.apparent)), max=Math.max(...slice.map(h=>h.apparent));
  document.getElementById('city-name').textContent = cityLabel;
  document.getElementById('app-now').textContent = Number.isFinite(appNow)?`${Math.round(appNow)}°C`:'—';
  document.getElementById('wind-now').textContent = Number.isFinite(windNow)?`${Math.round(windNow)} km/h`:'—';
  document.getElementById('uv-now').textContent = Number.isFinite(uvNow)?`${Math.round(uvNow)}`:'—';
  document.getElementById('pop-now').textContent = Number.isFinite(popNow)?`${Math.round(popNow)}%`:'—';
  document.getElementById('pressure-now').textContent = Number.isFinite(pressureNow)?`${Math.round(pressureNow)} hPa`:'—';
  document.getElementById('next6-range').textContent = (Number.isFinite(min)&&Number.isFinite(max))?`${Math.round(min)}–${Math.round(max)}°C`:'—';
  
  // Generate summary text
  let summaryText = `Currently ${Math.round(appNow)}°C (feels like), with `;
  if (popNow <= 10) {
    summaryText += `low chance of precipitation (${Math.round(popNow)}%)`;
  } else if (popNow <= 30) {
    summaryText += `slight chance of precipitation (${Math.round(popNow)}%)`;
  } else if (popNow <= 60) {
    summaryText += `moderate chance of precipitation (${Math.round(popNow)}%)`;
  } else {
    summaryText += `high chance of precipitation (${Math.round(popNow)}%)`;
  }
  
  summaryText += ` and ${uvNow >= 6 ? 'high' : 'moderate'} UV (${Math.round(uvNow)}). `;
  summaryText += `Sun protection ${uvNow >= 6 ? 'recommended' : 'suggested'}.`;
  
  document.getElementById('summary-text').textContent = Number.isFinite(appNow) ? summaryText : 'Weather data loading...';
  
  // Update summary badges
  const badgesContainer = document.getElementById('summary-badges');
  if (badgesContainer) {
    badgesContainer.innerHTML = '';
    
    if (uvNow >= 6) {
      const badge = document.createElement('span');
      badge.className = 'tag';
      badge.textContent = 'HIGH UV';
      badgesContainer.appendChild(badge);
    }
    
    if (popNow >= 40) {
      const badge = document.createElement('span');
      badge.className = 'tag';
      badge.textContent = 'RAIN LIKELY';
      badgesContainer.appendChild(badge);
    }
    
    if (windNow >= 10) {
      const badge = document.createElement('span');
      badge.className = 'tag';
      badge.textContent = 'WINDY';
      badgesContainer.appendChild(badge);
    }
  }
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
  
  // Format time labels to avoid overlapping
  const isMobile = window.innerWidth <= 768;
  
  // Create time formatter function that returns shorter labels
  const formatTimeLabel = (isoTime, index, total) => {
    const date = new Date(isoTime);
    
    // Always show first and last label
    if (index === 0 || index === total - 1) {
      return date.toLocaleString([], {hour:'numeric'}) + ' ' + 
             (date.getHours() >= 12 ? 'PM' : 'AM');
    }
    
    // On mobile, show fewer labels
    if (isMobile) {
      // For mobile: show only every 3-4 hours
      if (index % 4 !== 0) {
        return '';
      }
    } else {
      // For desktop: show every 2 hours
      if (index % 2 !== 0) {
        return '';
      }
    }
    
    // Simplified time format to reduce overlap
    return date.getHours() + (date.getHours() >= 12 ? 'PM' : 'AM');
  };
  
  // Create labels array with simplified formatting
  const labels = hours.map((h, index) => formatTimeLabel(h.isoTime, index, hours.length));
  
  const apparent = hours.map(h=>apparentWithFallback(h));
  const pop = hours.map(h=>h.pop);

  if (window.chart && typeof window.chart.destroy === 'function') {
    try {
      window.chart.destroy();
    } catch(e) {
      console.warn('Chart destroy error:', e);
    }
  }
  
  // Adjust point radius and line thickness based on screen size
  const pointRadius = isMobile ? 2 : 3;
  const borderWidth = isMobile ? 2 : 2.5;
  
  window.chart = new Chart(chartCanvas.getContext('2d'), {
    type:'line',
    data:{ labels,
      datasets:[
        { 
          label:'Feels like (°C)', 
          data:apparent, 
          yAxisID:'y', 
          tension:.35, 
          pointRadius: pointRadius,
          borderColor:p.line, 
          pointBackgroundColor:p.line, 
          borderWidth: borderWidth 
        },
        ...(document.getElementById('toggle-pop')?.checked?[{
          type:'bar', 
          label:'Rain chance (%)', 
          data:pop, 
          yAxisID:'y1',
          backgroundColor:p.bar, 
          borderWidth:0, 
          barPercentage: isMobile ? 0.7 : 0.88, 
          categoryPercentage: isMobile ? 0.7 : 0.88, 
          order:-1
        }]:[])
      ]},
    options:{ 
      maintainAspectRatio:false,
      responsive: true,
      plugins:{ 
        legend:{ 
          labels:{ color:p.axis },
          display: !isMobile // Hide legend on mobile to save space
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false
        }
      },
      interaction:{ mode:'index', intersect:false },
      scales:{
        x:{ 
          ticks:{ 
            color:p.axis,
            maxRotation: 45, // Always rotate labels to avoid overlap
            minRotation: isMobile ? 45 : 0,
            autoSkip: true,
            autoSkipPadding: 15, // Ensure there's enough space between labels
            font: {
              size: isMobile ? 10 : 12
            },
            align: 'start'
          }, 
          grid:{ color:p.grid2 } 
        },
        y:{ 
          ticks:{ color:p.axis },
          grid:{ color:p.grid }, 
          title:{display: !isMobile, text:'°C', color:p.axis} 
        },
        y1:{ 
          position:'right', 
          ticks:{ color:p.axis }, 
          grid:{ drawOnChartArea:false }, 
          title:{display: !isMobile, text:'%', color:p.axis}, 
          min:0, 
          max:100 
        }
      }
    }
  });
}

function renderHourlyList(hours){
  const tbody = document.getElementById('hourly-data'); 
  if (!tbody) return;
  tbody.innerHTML = '';
  
  // Take the first 12 hours for the table
  hours.slice(0, 12).forEach(h => {
    const time = new Date(h.isoTime);
    const temp = Math.round(h.temp || 0);
    const apparent = Math.round(apparentWithFallback(h));
    const wind = Math.round(h.wind || 0);
    const pop = Math.round(h.pop || 0);
    const uv = Math.round(h.uv || 0);
    
    // Format time as "12 PM", "1 PM", etc.
    const formattedTime = time.toLocaleTimeString([], {hour: 'numeric', hour12: true}).replace(':00', '');
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formattedTime}</td>
      <td class="hourly-temp">${temp}°</td>
      <td class="hourly-feels">${apparent}°</td>
      <td class="hourly-wind">${wind}</td>
      <td class="hourly-rain">${pop}%</td>
      <td class="hourly-uv">${uv}</td>
    `;
    
    tbody.appendChild(row);
  });
}

/* ---------- events & app flow ---------- */
function sliceByHorizon(hours){ 
  const sel = document.getElementById('horizon-select');
  if (!sel) return hours.slice(0, 24); // Default to 24h
  
  switch (sel.value) {
    case '48h':
      return hours.slice(0, 48);
    case '12h':
      return hours.slice(0, 12);
    case '6h':
      return hours.slice(0, 6);
    case '24h':
    default:
      return hours.slice(0, 24);
  }
}

async function loadCity({name,lat,lon}){
  setStatus('loading');
  try {
    // 保存最后查询的城市
    try {
      localStorage.setItem('last_city', JSON.stringify({name, lat, lon}));
    } catch (e) {
      // 如果保存失败，继续加载
    }
    
    // Fetch weather forecast data
    const hours = await fetchForecast(lat,lon);
    window.hoursAll = hours;
    
    // Fetch weather alerts (this runs in parallel with forecast)
    fetchWeatherAlerts(lat, lon)
      .then(alerts => {
        renderWeatherAlerts(alerts);
      })
      .catch(error => {
        console.error('Failed to fetch weather alerts:', error);
        // Show no alerts if there's an error
        renderWeatherAlerts([]);
      });
    
    // Render all the weather components
    renderSummary(hours, name);
    renderAdvice(hours);
    const sliced = sliceByHorizon(hours);
    renderChart(sliced); 
    renderHourlyList(hours);
    
    // Update chart title based on current horizon selection
    const horizonSelect = document.getElementById('horizon-select');
    if (horizonSelect) {
      updateChartTitle(horizonSelect.value);
    }
    
    setStatus('ready');
  } catch(err) {
    showError(`Failed to load weather data: ${err.message || 'Unknown error'}`);
    setStatus('error');
    showEmptyState();
  }
}

// Theme toggle
// Function to update chart title based on selected horizon
function updateChartTitle(horizonValue) {
  const chartTitle = document.querySelector('#chart .card-title');
  if (chartTitle) {
    // Update chart title based on selected horizon
    switch (horizonValue) {
      case '48h':
        chartTitle.textContent = '48-Hour Forecast';
        break;
      case '12h':
        chartTitle.textContent = '12-Hour Forecast';
        break;
      case '6h':
        chartTitle.textContent = '6-Hour Forecast';
        break;
      case '24h':
      default:
        chartTitle.textContent = '24-Hour Forecast';
        break;
    }
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  
  // Update both desktop and mobile theme toggle buttons
  const btn = document.getElementById('theme-toggle');
  const mobileBtn = document.getElementById('mobile-theme-toggle');
  
  const btnText = newTheme === 'dark' ? 'Light' : 'Dark';
  if (btn) btn.textContent = btnText;
  if (mobileBtn) mobileBtn.textContent = btnText;
  
  // Re-render chart with new colors
  if (window.hoursAll?.length) {
    const sliced = sliceByHorizon(window.hoursAll);
    renderChart(sliced);
    
    // Ensure chart title reflects the correct horizon after theme change
    const horizonSelect = document.getElementById('horizon-select');
    if (horizonSelect) {
      updateChartTitle(horizonSelect.value);
    }
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
      
      // Update chart title to reflect selected horizon
      updateChartTitle(horizonSelect.value);
    });
    
    // Initialize chart title on page load
    updateChartTitle(horizonSelect.value);
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

  // Toggle mobile search form
  const mobileSearchBtn = document.getElementById('mobile-search-btn');
  const mobileSearchContainer = document.getElementById('mobile-search-container');
  if (mobileSearchBtn && mobileSearchContainer) {
    mobileSearchBtn.addEventListener('click', () => {
      const isVisible = mobileSearchContainer.style.display === 'block';
      mobileSearchContainer.style.display = isVisible ? 'none' : 'block';
    });
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
        closeDrawer();
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
          closeDrawer();
        }catch(e){ showError('Failed to load current location'); }
      }, err=>showError('Location error'));
    });
  }

  // Mobile theme toggle
  const mobileThemeBtn = document.getElementById('mobile-theme-toggle');
  if (mobileThemeBtn) {
    mobileThemeBtn.addEventListener('click', () => {
      toggleTheme();
      // Don't close drawer after theme toggle
    });
  }

  // Helper function to close drawer
  function closeDrawer() {
    const drawer = document.getElementById('drawer');
    const navToggle = document.getElementById('nav-toggle');
    if (drawer && navToggle) {
      drawer.classList.remove('drawer-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  /* 汉堡菜单：打开/关闭抽屉 */
  const navBtn = document.getElementById('nav-toggle');
  const drawer = document.getElementById('drawer');
  if (navBtn && drawer) {
    navBtn.addEventListener('click', ()=>{
      // Fix the class toggle - use drawer-open class as per CSS
      const open = drawer.classList.toggle('drawer-open');
      navBtn.setAttribute('aria-expanded', open?'true':'false');
    });
  }

  // Close drawer with X button
  const drawerClose = document.getElementById('drawer-close');
  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  // Close drawer when clicking on navigation links
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
  if (mobileNavLinks.length) {
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // Initialize theme toggle buttons text based on current theme
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const themeButtonText = currentTheme === 'dark' ? 'Light' : 'Dark';
  if (themeBtn) themeBtn.textContent = themeButtonText;
  if (mobileThemeBtn) mobileThemeBtn.textContent = themeButtonText;

  // Favorites functionality
  setupFavorites();

  // Default city load with fallback to URL ?q= and a built-in city
  (async function init() {
    try {
      setStatus('loading');

      // 1) 用上次的城市
      const last = localStorage.getItem('last_city');
      if (last) {
        await loadCity(JSON.parse(last));
        return;
      }

      // 2) 支持 URL ?q=Toronto, ON 这种写法
      const params = new URL(location.href).searchParams;
      const q = params.get('q') || 'Oakville, Ontario, Canada'; // 你可以换成任何默认城市
      const city = await geocodeCity(q);
      await loadCity(city);
    } catch (e) {
      setStatus('error');
      showError('Could not initialize app. Please try again.');
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

// 空状态处理
function showEmptyState() {
  setStatus('empty');
  document.getElementById('city-name').textContent = '—';
  document.getElementById('app-now').textContent = '—';
  document.getElementById('wind-now').textContent = '—';
  document.getElementById('uv-now').textContent = '—';
  document.getElementById('pop-now').textContent = '—';
  document.getElementById('pressure-now').textContent = '—';
  document.getElementById('next6-range').textContent = '—';
  document.getElementById('summary-badges').innerHTML = '';
  document.getElementById('summary-text').textContent = 'Search for a city or use your location to see weather data.';
  
  // Clear alerts
  const alertsContainer = document.getElementById('alerts-container');
  if (alertsContainer) {
    alertsContainer.innerHTML = '<p class="no-alerts-message">No active weather alerts for this location.</p>';
  }
  
  // Reset "Why Does It Feel This Way?" section
  const feelExplanation = document.getElementById('feel-explanation');
  if (feelExplanation) {
    feelExplanation.textContent = 'The real feel temperature is calculated based on multiple factors beyond just the thermometer reading.';
  }
  
  const tempVsFeel = document.getElementById('temp-vs-feel');
  if (tempVsFeel) {
    tempVsFeel.textContent = 'The difference between actual and perceived temperature is influenced by humidity, wind, and other atmospheric conditions.';
  }
  
  const humidityEffect = document.getElementById('humidity-effect');
  if (humidityEffect) {
    humidityEffect.textContent = 'High humidity reduces your body\'s ability to cool through sweating, while low humidity allows for better heat dissipation.';
  }
  
  const windEffect = document.getElementById('wind-effect');
  if (windEffect) {
    windEffect.textContent = 'Moving air increases heat transfer from your body, making you feel cooler in windy conditions.';
  }
}

/* ---------- Alert Rendering ---------- */
function renderWeatherAlerts(alerts) {
  const container = document.getElementById('alerts-container');
  if (!container) return;
  
  // Clear previous content
  container.innerHTML = '';
  
  // If no alerts, show the default message
  if (!alerts || alerts.length === 0) {
    container.innerHTML = '<p class="no-alerts-message">No active weather alerts for this location.</p>';
    return;
  }
  
  // Sort alerts by severity - severe first
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityOrder = { 'severe': 0, 'warning': 1, 'advisory': 2, 'watch': 3 };
    const severityA = determineSeverity(a.event);
    const severityB = determineSeverity(b.event);
    return severityOrder[severityA] - severityOrder[severityB];
  });
  
  // Add each alert to the container
  sortedAlerts.forEach(alert => {
    const severity = determineSeverity(alert.event);
    
    // Format dates - ensure we have valid timestamps
    let timeStr = '';
    try {
      const start = new Date(typeof alert.start === 'number' ? alert.start * 1000 : alert.start);
      const end = new Date(typeof alert.end === 'number' ? alert.end * 1000 : alert.end);
      timeStr = `${formatDateTime(start)} - ${formatDateTime(end)}`;
    } catch (e) {
      console.warn('Invalid date in alert:', alert, e);
      timeStr = 'Active alert';
    }
    
    // Extract source information for display
    const source = alert.source || alert.sender || 'Weather Alert';
    
    // Create alert element
    const alertEl = document.createElement('div');
    alertEl.className = `alert-item ${severity}`;
    
    alertEl.innerHTML = `
      <div class="alert-header">
        <h4 class="alert-title">${formatEventTitle(alert.event)}</h4>
        <span class="alert-badge ${severity}">${severity.toUpperCase()}</span>
      </div>
      <p class="alert-time">${timeStr}</p>
      <p class="alert-description">${truncateDescription(alert.description || alert.headline || '')}</p>
      <p class="alert-source">Source: ${source}</p>
    `;
    
    container.appendChild(alertEl);
  });
}

// Helper functions for alerts
function determineSeverity(eventName) {
  const eventLower = eventName.toLowerCase();
  if (eventLower.includes('severe') || eventLower.includes('emergency') || 
      eventLower.includes('extreme') || eventLower.includes('danger')) {
    return 'severe';
  } else if (eventLower.includes('warning')) {
    return 'warning';
  } else if (eventLower.includes('advisory') || eventLower.includes('statement')) {
    return 'advisory';
  } else {
    return 'watch';
  }
}

function formatEventTitle(event) {
  // Capitalize first letter of each word
  return event
    .replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
    .replace(/([A-Z])/g, ' $1')
    .trim();
}

function formatDateTime(date) {
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function truncateDescription(description) {
  // Limit the description to a reasonable length
  if (description.length > 200) {
    return description.substring(0, 200) + '...';
  }
  return description;
}

/* utils */
function toAsciiEnglish(s){ return (s||'').normalize('NFKD').replace(/[^\x00-\x7F]/g,'').replace(/\s+/g,' ').trim(); }
function englishLabelFromAddress(a){
  if (!a) return '';
  const parts = [a.city||a.town||a.village||a.county, a.state, a.country].filter(Boolean);
  return toAsciiEnglish(parts.join(', '));
}
