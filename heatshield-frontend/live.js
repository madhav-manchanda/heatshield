const API_BASE = window.HEATSHIELD_API_URL || 'http://127.0.0.1:8000';

function replaceTextEverywhere(from, to) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    if (node.nodeValue && node.nodeValue.includes(from)) node.nodeValue = node.nodeValue.split(from).join(to);
  }
}

function formatTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value).slice(11, 16) : date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });
}

function formatUpdated(value) { return `Updated ${formatTime(value)} IST`; }

function riskClass(level) {
  if (level === 'extreme') return 'bg-error-container text-on-error-container';
  if (level === 'high') return 'bg-secondary-fixed text-on-secondary-fixed';
  if (level === 'moderate') return 'bg-secondary-container/20 text-on-secondary-container';
  return 'bg-primary-fixed text-on-primary-fixed';
}

async function get(path) {
  const response = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json();
}

function mountLivePanel(title, subtitle, html) {
  const existing = document.getElementById('heatshield-live-panel');
  if (existing) existing.remove();
  const panel = document.createElement('section');
  panel.id = 'heatshield-live-panel';
  panel.className = 'max-w-7xl w-full mx-auto px-space-md pb-space-lg';
  panel.innerHTML = `<div class="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high overflow-hidden"><div class="p-space-md border-b border-surface-container-high flex items-center justify-between gap-space-sm"><div><div class="font-headline-sm text-headline-sm font-semibold text-on-surface">${title}</div><div class="font-label-sm text-label-sm text-on-surface-variant mt-1">${subtitle}</div></div><span class="px-space-xs py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">LIVE</span></div><div class="p-space-md">${html}</div></div>`;
  document.getElementById('app-content').appendChild(panel);
}

export async function loadLiveDashboard(locationId = 1) {
  try {
    const [data, facilities, alerts] = await Promise.all([
      get(`/api/live/overview?location_id=${locationId}`),
      get('/api/live/facilities'),
      get('/api/live/alerts'),
    ]);
    const current = data.current;
    replaceTextEverywhere('REST Mock Stream', 'LIVE • Open-Meteo');
    replaceTextEverywhere('38.4°C', `${Number(current.temperature).toFixed(1)}°C`);
    replaceTextEverywhere('43.1°C', `${Number(current.apparent_temperature).toFixed(1)}°C`);
    replaceTextEverywhere('61%', `${Math.round(current.humidity)}%`);
    replaceTextEverywhere('78 / 100', `${Number(current.thermal_score).toFixed(0)} / 100`);
    replaceTextEverywhere('11 km/h', `${Number(current.wind_speed).toFixed(1)} km/h`);
    replaceTextEverywhere('CURRENT HEAT RISK: HIGH (Level 3 of 4)', `CURRENT HEAT RISK: ${current.risk_level.toUpperCase()} (${Number(current.final_score).toFixed(0)} / 100)`);
    replaceTextEverywhere('Updated 4 min ago', formatUpdated(data.updated_at));
    replaceTextEverywhere('Target Area: Delhi Central & East Sectors', `Target Area: ${data.location.name}`);

    const forecastRows = data.forecast.filter((_, i) => i % 3 === 0).slice(0, 24).map(item => `<tr class="border-t border-surface-container-high"><td class="py-2 font-label-sm">${formatTime(item.timestamp)}</td><td class="py-2 font-semibold">${Number(item.temperature).toFixed(1)}°C</td><td class="py-2">${Math.round(item.humidity)}%</td><td class="py-2">${Number(item.apparent_temperature).toFixed(1)}°C</td><td class="py-2">${Number(item.thermal_score).toFixed(0)}</td><td class="py-2"><span class="px-2 py-1 rounded-full ${riskClass(item.risk_level)} font-label-sm">${item.risk_level}</span></td></tr>`).join('');
    const facilityCards = facilities.facilities.map(item => `<div class="p-3 rounded-lg bg-surface-container-low border border-surface-container-high"><div class="flex justify-between gap-2"><strong>${item.name}</strong><span class="text-xs font-semibold ${item.status === 'full' ? 'text-error' : 'text-primary'}">${item.status.toUpperCase()}</span></div><div class="mt-2 text-sm text-on-surface-variant">${item.occupancy}/${item.capacity} occupied • ${item.available} available</div></div>`).join('');
    const alertRows = alerts.alerts.map(item => `<div class="p-3 rounded-lg ${riskClass(item.severity)}"><div class="flex justify-between gap-2"><strong>${item.severity.toUpperCase()} • ${item.location}</strong><span class="text-xs">${formatTime(item.created_at)}</span></div><div class="mt-1 text-sm">${item.message}</div></div>`).join('');
    mountLivePanel('Live Forecast, Facilities & Alerts', `${data.location.name} • ${data.source} • ${formatUpdated(data.updated_at)}`, `<div class="overflow-x-auto"><table class="w-full text-left"><thead><tr class="text-on-surface-variant font-label-sm"><th class="py-2">Time</th><th>Temp</th><th>Humidity</th><th>Feels Like</th><th>Thermal</th><th>Risk</th></tr></thead><tbody>${forecastRows}</tbody></table></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6"><div><div class="font-semibold mb-2">Cooling / Relief Facilities</div><div class="grid gap-2">${facilityCards}</div></div><div><div class="font-semibold mb-2">Active Live Alerts</div><div class="grid gap-2">${alertRows}</div></div></div>`);
    document.documentElement.dataset.liveWeather = 'connected';
    return data;
  } catch (error) {
    console.warn('HeatShield live data unavailable:', error);
    document.documentElement.dataset.liveWeather = 'offline';
    return null;
  }
}

export async function loadLiveRiskMap() { return get('/api/live/risk-map'); }

export async function loadLiveRoute(route) {
  if (route === 'dashboard') return loadLiveDashboard(1);
  try {
    if (route === 'risk-map') {
      const data = await loadLiveRiskMap();
      const cards = data.locations.map(item => `<div class="p-3 rounded-lg bg-surface-container-low border border-surface-container-high"><div class="flex items-center justify-between gap-2"><strong>${item.location.name}</strong><span class="px-2 py-1 rounded-full ${riskClass(item.risk.risk_level)} text-xs font-semibold">${item.risk.risk_level.toUpperCase()}</span></div><div class="mt-2 text-2xl font-bold">${Number(item.risk.final_score).toFixed(0)}<span class="text-sm font-normal text-on-surface-variant"> / 100</span></div><div class="mt-1 text-sm text-on-surface-variant">${Number(item.weather.temperature).toFixed(1)}°C • ${Math.round(item.weather.humidity)}% RH • feels ${Number(item.weather.apparent_temperature).toFixed(1)}°C</div><div class="mt-2 grid grid-cols-3 gap-2 text-xs"><span>Thermal ${item.risk.thermal_score}</span><span>Exposure ${item.risk.exposure_score}</span><span>Vulnerability ${item.risk.vulnerability_score}</span></div></div>`).join('');
      mountLivePanel('Live Hyperlocal Risk Map Data', `${data.source} • ${formatUpdated(data.updated_at)}`, `<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">${cards}</div>`);
      return data;
    }
    if (route === 'first-responder') {
      const data = await get('/api/live/responders');
      const rows = data.priorities.map(item => `<div class="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low border border-surface-container-high"><div class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">${item.priority}</div><div class="flex-1"><div class="font-semibold">${item.location.name}</div><div class="text-xs text-on-surface-variant">Score ${item.score} • ${item.risk_level}</div></div><span class="px-2 py-1 rounded-full ${riskClass(item.risk_level)} text-xs font-semibold">${item.action}</span></div>`).join('');
      mountLivePanel('Live First-Responder Priorities', `${data.source} • ${formatUpdated(data.updated_at)}`, `<div class="grid gap-2">${rows}</div>`);
      return data;
    }
    if (route === 'interventions') {
      const data = await get('/api/live/interventions?location_id=1');
      const actions = ['shade', 'water', 'cooling'];
      const buttons = actions.map(action => `<button data-intervention="${action}" class="px-3 py-2 rounded-lg bg-surface-container-low hover:bg-primary-container hover:text-on-primary border border-surface-container-high text-sm font-medium">${action[0].toUpperCase() + action.slice(1)}</button>`).join('');
      mountLivePanel('Live What-If Heat Intervention', `${data.location.name} • baseline derived from current weather`, `<div class="grid grid-cols-1 md:grid-cols-3 gap-3"><div class="p-4 rounded-lg bg-surface-container-low"><div class="text-xs text-on-surface-variant">Current Risk</div><div class="text-3xl font-bold mt-1">${data.baseline.final_score}</div><div class="text-sm mt-1">${data.baseline.risk_level}</div></div><div class="p-4 rounded-lg bg-surface-container-low"><div class="text-xs text-on-surface-variant">Try interventions</div><div class="flex flex-wrap gap-2 mt-3">${buttons}</div></div><div class="p-4 rounded-lg bg-surface-container-low"><div class="text-xs text-on-surface-variant">Projected</div><div id="live-projected-score" class="text-3xl font-bold mt-1">${data.projected_score}</div><div id="live-projected-level" class="text-sm mt-1">${data.projected_level}</div></div></div>`);
      document.querySelectorAll('[data-intervention]').forEach(button => button.addEventListener('click', async () => {
        button.classList.toggle('bg-primary-container'); button.classList.toggle('text-on-primary');
        const params = new URLSearchParams({ location_id: '1' });
        document.querySelectorAll('[data-intervention]').forEach(b => { if (b.classList.contains('bg-primary-container')) params.set(b.dataset.intervention, 'true'); });
        const next = await get(`/api/live/interventions?${params}`);
        document.getElementById('live-projected-score').textContent = next.projected_score;
        document.getElementById('live-projected-level').textContent = next.projected_level;
      }));
      return data;
    }
  } catch (error) { console.warn(`HeatShield live ${route} data unavailable:`, error); }
  return null;
}

export { API_BASE };
