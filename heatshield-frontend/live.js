import { API_BASE, apiGet, saveCache, loadCache, formatCacheAge, formatTimeIST, CONNECTION } from './api.js';

let currentLocationId = 1;
let connectionStatus = CONNECTION.CONNECTING;
let lastUpdateTime = null;

export function getCurrentLocationId() {
  return currentLocationId;
}

export async function setCurrentLocationId(id) {
  currentLocationId = Number(id) || 1;
  updateConnectionStatus(CONNECTION.CONNECTING);
  await loadLiveRoute(getRoute());
}

function getRoute() {
  const hash = window.location.hash.slice(1) || 'dashboard';
  const known = ['dashboard', 'risk-map', 'interventions', 'first-responder', 'forecast-stress', 'cooling-facilities'];
  return known.includes(hash) ? hash : 'dashboard';
}

function updateConnectionStatus(status) {
  connectionStatus = status;
  const badge = document.getElementById('connection-status');
  if (badge) {
    badge.dataset.status = status;
    let html = '';
    if (status === CONNECTION.CONNECTING) {
      html = '<span class="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-pulse inline-block"></span> CONNECTING • HeatShield backend';
    } else if (status === CONNECTION.LIVE) {
      const updated = lastUpdateTime ? ` • Updated ${formatTimeIST(lastUpdateTime)} IST` : '';
      html = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> LIVE • Open-Meteo${updated}`;
    } else if (status === CONNECTION.OFFLINE) {
      const cached = loadCache();
      const age = cached ? formatCacheAge(cached) : '';
      html = `<span class="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span> OFFLINE — Last synchronized ${age}`;
    } else {
      html = '<span class="w-1.5 h-1.5 rounded-full bg-error inline-block"></span> LIVE DATA UNAVAILABLE';
    }
    badge.innerHTML = html;
    badge.className = 'hidden xl:flex items-center gap-space-2xs px-space-xs py-space-2xs rounded-full border border-outline-variant/40 shadow-sm font-label-sm text-label-sm text-on-surface';
  }

  const sidebar = document.getElementById('sidebar-api-status');
  if (sidebar) {
    sidebar.textContent = status === CONNECTION.LIVE ? 'LIVE' : status === CONNECTION.OFFLINE ? 'OFFLINE' : status === CONNECTION.ERROR ? 'Unavailable' : 'Connecting...';
  }
}

export function setStatusLive(updatedAt) {
  if (updatedAt) lastUpdateTime = updatedAt;
  updateConnectionStatus(CONNECTION.LIVE);
}

export function setStatusOffline() {
  updateConnectionStatus(CONNECTION.OFFLINE);
}

export function setStatusError() {
  updateConnectionStatus(CONNECTION.ERROR);
}

export function setStatusConnecting() {
  updateConnectionStatus(CONNECTION.CONNECTING);
}

function mountLivePanel(title, subtitle, htmlContent, { onGps = true } = {}) {
  removeLivePanel();
  const panel = document.createElement('section');
  panel.id = 'heatshield-live-panel';
  panel.className = 'max-w-7xl w-full mx-auto px-space-md pb-space-lg';
  panel.innerHTML = `
    <div class="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high overflow-hidden">
      <div class="p-space-md border-b border-surface-container-high flex items-center justify-between gap-space-sm">
        <div>
          <div class="font-headline-sm text-headline-sm font-semibold text-on-surface">${title}</div>
          <div class="font-label-sm text-label-sm text-on-surface-variant mt-1">${subtitle}</div>
        </div>
        <div class="flex items-center gap-2">
          ${onGps ? '<button id="heatshield-gps" class="px-3 py-2 rounded-full bg-primary-container text-on-primary text-xs font-semibold">Use My Location</button>' : ''}
        </div>
      </div>
      <div class="p-space-md heatshield-panel-body">${htmlContent}</div>
    </div>`;
  const content = document.getElementById('app-content');
  content.appendChild(panel);
  const gps = document.getElementById('heatshield-gps');
  if (gps) gps.addEventListener('click', heatshieldUseMyLocation);
}

function renderLivePanel(title, subtitle, bodyHtml, gps = true) {
  removeLivePanel();
  const panel = document.createElement('section');
  panel.id = 'heatshield-live-panel';
  panel.className = 'max-w-7xl w-full mx-auto px-space-md pb-space-lg';
  panel.innerHTML = `
    <div class="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high overflow-hidden">
      <div class="p-space-md border-b border-surface-container-high flex items-center justify-between gap-space-sm">
        <div>
          <div class="font-headline-sm text-headline-sm font-semibold text-on-surface">${title}</div>
          <div class="font-label-sm text-label-sm text-on-surface-variant mt-1">${subtitle}</div>
        </div>
        <div class="flex items-center gap-2">
          ${gps ? '<button id="heatshield-gps" class="px-3 py-2 rounded-full bg-primary-container text-on-primary text-xs font-semibold">Use My Location</button>' : ''}
        </div>
      </div>
      <div class="p-space-md heatshield-panel-body">${bodyHtml}</div>
    </div>`;
  document.getElementById('app-content').appendChild(panel);
  const gpsBtn = document.getElementById('heatshield-gps');
  if (gpsBtn) gpsBtn.addEventListener('click', heatshieldUseMyLocation);
  return panel;
}

export function removeLivePanel() {
  const existing = document.getElementById('heatshield-live-panel');
  if (existing) existing.remove();
}

function offlinePanel() {
  const cached = loadCache();
  if (!cached) return mountNoLiveData();
  const age = formatCacheAge(cached);
  mountLivePanel('Offline Mode', `No live connection • cached ${age}`, `
    <div class="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
      HeatShield is currently offline. Showing the last successfully synchronized information from this device (saved ${age}).
      Live data will return automatically when the connection is restored.
    </div>
  `, { onGps: false });
}

function mountNoLiveData() {
  removeLivePanel();
  const panel = document.createElement('section');
  panel.id = 'heatshield-live-panel';
  panel.className = 'max-w-7xl w-full mx-auto px-space-md pb-space-lg';
  panel.innerHTML = `
    <div class="bg-surface-container-lowest rounded-xl shadow-sm border border-error/30 overflow-hidden">
      <div class="p-space-md border-b border-surface-container-high">
        <div class="font-headline-sm text-headline-sm font-semibold text-on-surface">Live data unavailable</div>
        <div class="font-label-sm text-label-sm text-on-surface-variant mt-1">Could not reach the HeatShield backend</div>
      </div>
      <div class="p-space-md">
        <div class="p-4 rounded-lg bg-error-container/20 border border-error/20 text-error text-sm">
          The HeatShield backend is not responding and no previously cached data exists on this device.
          Please ensure the backend is running, then refresh the page.
        </div>
      </div>
    </div>`;
  document.getElementById('app-content').appendChild(panel);
}

function loadingPanel() {
  mountLivePanel('HeatShield Command Center', 'Connecting to HeatShield backend...', `
    <div class="flex items-center gap-3 text-on-surface-variant">
      <span class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
      <span class="text-sm">Loading live heat risk...</span>
    </div>
  `, { onGps: false });
}

function formatRiskBadge(level, score) {
  return `<span class="px-2 py-0.5 rounded-full ${riskClassSafe(level)} font-label-sm text-label-sm font-semibold">${(level || '').toUpperCase()}${score != null ? ` (${Math.round(Number(score))})` : ''}</span>`;
}

function riskClassSafe(level) {
  const l = String(level || '').toLowerCase();
  if (['extreme', 'critical', 'severe'].includes(l)) return 'bg-error-container text-on-error-container';
  if (l === 'high') return 'bg-secondary-fixed text-on-secondary-fixed';
  if (l === 'moderate') return 'bg-secondary-container/20 text-on-secondary-container';
  return 'bg-primary-fixed text-on-primary-fixed';
}

function formatDateShort(value) {
  if (!value) return '--';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value).replace('T', ' ').slice(0, 16);
  return d.toLocaleString('en-IN', { weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });
}

export async function loadLiveDashboard(locationId = 1) {
  setStatusConnecting();
  loadingPanel();
  const cache = loadCache();
  try {
    const overview = await apiGet(`/api/live/overview?location_id=${locationId}`);
    let facilities = null;
    let alerts = null;
    try {
      facilities = await apiGet('/api/live/facilities');
      alerts = await apiGet('/api/live/alerts');
    } catch (_) {
      // Facilities/alerts are auxiliary; don't fail the whole dashboard if they fail.
      if (cache && cache.data) {
        facilities = facilities || cache.data.facilities || null;
        alerts = alerts || cache.data.alerts || null;
      }
    }
    saveCache({ overview, facilities, alerts });
    setStatusLive(overview.updated_at);
    renderDashboardLive(overview, facilities, alerts);
    return overview;
  } catch (error) {
    console.warn('HeatShield live dashboard unavailable:', error);
    if (cache && cache.data && cache.data.overview) {
      setStatusOffline();
      renderDashboardLive(cache.data.overview, cache.data.facilities, cache.data.alerts, true);
      return cache.data.overview;
    }
    setStatusError();
    mountNoLiveData();
    return null;
  }
}

function renderDashboardLive(overview, facilities, alerts, isOffline = false) {
  const current = overview.current || {};
  const location = overview.location || {};
  const peak = overview.peak || {};
  const forecast = overview.forecast || [];
  const updatedAt = overview.updated_at || '';
  const source = overview.source || 'Open-Meteo';

  const statusNote = isOffline
    ? `<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-label-sm text-label-sm font-semibold">OFFLINE CACHED DATA</span>`
    : `<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-label-sm text-label-sm font-semibold">LIVE</span>`;

  const peakDateStr = peak.timestamp ? formatDateShort(peak.timestamp) : '--';

  const riskLevel = String(current.risk_level || '').toLowerCase();
  const peakRiskLevel = String(peak.risk_level || '').toLowerCase();

  // Determine main driver from backend data
  const scores = [
    { label: 'thermal stress', value: Number(current.thermal_score) || 0 },
    { label: 'population exposure', value: Number(current.exposure_score) || 0 },
    { label: 'vulnerability', value: Number(current.vulnerability_score) || 0 },
    { label: 'infrastructure', value: Number(current.infrastructure_score) || 0 },
  ];
  scores.sort((a, b) => b.value - a.value);
  const mainDriver = scores.length ? scores[0].label : 'thermal stress';

  // Build forecast table
  const forecastRows = forecast.slice(0, 36).map(item => `
    <tr class="border-t border-surface-container-high">
      <td class="py-2 font-label-sm whitespace-nowrap">${formatDateShort(item.timestamp)}</td>
      <td class="py-2 font-semibold">${Number(item.temperature).toFixed(1)}°C</td>
      <td class="py-2">${Math.round(item.humidity)}%</td>
      <td class="py-2">${Number(item.apparent_temperature).toFixed(1)}°C</td>
      <td class="py-2">${Math.round(Number(item.thermal_score))}</td>
      <td class="py-2">${riskBadgeSafe(item.risk_level)}</td>
    </tr>`).join('');

  // Build facilities
  const facilityCards = facilities && facilities.facilities && facilities.facilities.length
    ? facilities.facilities.map(item => {
        const occupancy = Number(item.occupancy) || 0;
        const capacity = Number(item.capacity) || 0;
        const available = item.available != null ? Number(item.available) : Math.max(0, capacity - occupancy);
        const pct = capacity ? Math.round((occupancy / capacity) * 100) : 0;
        const statusColor = item.status === 'full' ? 'bg-error-container text-on-error-container' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant';
        return `
          <div class="p-3 rounded-lg bg-surface-container-low border border-surface-container-high">
            <div class="flex justify-between gap-2 items-start">
              <strong class="text-sm">${item.name}</strong>
              <span class="text-xs font-semibold px-1.5 py-0.5 rounded ${statusColor}">${String(item.status || '').toUpperCase()}</span>
            </div>
            <div class="mt-2 text-sm text-on-surface-variant">${occupancy}/${capacity} occupied • ${available} available</div>
            <div class="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden mt-1">
              <div class="h-full ${item.status === 'full' ? 'bg-error' : 'bg-primary-container'} rounded-full" style="width:${pct}%"></div>
            </div>
          </div>`;
      }).join('')
    : '<div class="text-sm text-on-surface-variant">Facility data unavailable.</div>';

  // Build alerts
  const alertRows = alerts && alerts.alerts && alerts.alerts.length
    ? alerts.alerts.map(item => `
        <div class="p-3 rounded-lg ${riskClassSafe(item.severity)}">
          <div class="flex justify-between gap-2 items-start">
            <strong class="text-sm">${String(item.severity || '').toUpperCase()} • ${item.location || ''}</strong>
            <span class="text-xs whitespace-nowrap">${formatTimeIST(item.created_at)}</span>
          </div>
          <div class="mt-1 text-sm">${item.message}</div>
        </div>`).join('')
    : '<div class="text-sm text-on-surface-variant">No active alerts.</div>';

  const content = document.createElement('div');
  content.id = 'live-dashboard-content';

  content.innerHTML = `
    <div class="flex flex-col gap-3 mb-5">
      <div class="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant">
        <span>Target Area: <strong class="text-on-surface text-sm">${location.name || '--'}</strong></span>
        <span>•</span>
        <span>Source: <strong class="text-on-surface">${source}</strong></span>
        <span>•</span>
        <span>Updated: <strong class="text-on-surface">${formatTimeIST(updatedAt)} IST</strong></span>
        <span>•</span>
        <span>Timezone: ${overview.timezone || 'Asia/Kolkata'}</span>
        ${statusNote}
      </div>
    </div>

    <!-- Current Conditions & Risk -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      <div class="p-4 rounded-lg bg-surface-container-low">
        <div class="text-xs text-on-surface-variant">Current Temperature</div>
        <div class="text-3xl font-bold mt-1" data-temperature>${Number(current.temperature).toFixed(1)}°C</div>
        <div class="text-sm text-on-surface-variant mt-1">Feels like <strong class="text-secondary" data-apparent-temperature>${Number(current.apparent_temperature).toFixed(1)}°C</strong></div>
      </div>
      <div class="p-4 rounded-lg bg-surface-container-low">
        <div class="text-xs text-on-surface-variant">Humidity</div>
        <div class="text-3xl font-bold mt-1" data-humidity>${Math.round(Number(current.humidity))}%</div>
        <div class="text-sm text-on-surface-variant mt-1">Heat index: <strong>${Number(current.heat_index).toFixed(1)}°C</strong></div>
      </div>
      <div class="p-4 rounded-lg bg-surface-container-low">
        <div class="text-xs text-on-surface-variant">Wind Speed</div>
        <div class="text-3xl font-bold mt-1" data-wind-speed>${Number(current.wind_speed).toFixed(1)} km/h</div>
        <div class="text-sm text-on-surface-variant mt-1">&nbsp;</div>
      </div>
      <div class="p-4 rounded-lg bg-surface-container-low">
        <div class="text-xs text-on-surface-variant">Thermal Score</div>
        <div class="text-3xl font-bold mt-1 text-secondary" data-thermal-score>${Math.round(Number(current.thermal_score))}</div>
        <div class="text-sm text-on-surface-variant mt-1">/ 100</div>
      </div>
      <div class="p-4 rounded-lg bg-surface-container-low">
        <div class="text-xs text-on-surface-variant">Peak Next 24h</div>
        <div class="text-2xl font-bold mt-1 text-error" data-peak-score>${peak.final_score != null ? Math.round(Number(peak.final_score)) : '--'}</div>
        <div class="text-sm text-on-surface-variant mt-1" data-peak-timestamp>${peakDateStr}</div>
      </div>
    </div>

    <!-- Composite Risk -->
    <div class="p-4 rounded-lg ${riskClassSafe(riskLevel)} mb-6">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div class="text-xs font-semibold uppercase tracking-wider">Final Composite Risk</div>
          <div class="text-4xl font-bold mt-1" data-risk-score>${Math.round(Number(current.final_score))} / 100</div>
        </div>
        <div class="text-right">
          <div class="text-xs font-semibold uppercase tracking-wider">Risk Level</div>
          <div class="text-2xl font-bold mt-1" data-risk-level>${String(current.risk_level || '').toUpperCase()}</div>
        </div>
      </div>
      <div class="w-full h-2 bg-black/10 rounded-full overflow-hidden mt-3">
        <div class="h-full ${riskBarColor(riskLevel)} rounded-full" style="width:${Math.min(100, Number(current.final_score) || 0)}%"></div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
        <div><span class="text-xs text-on-surface-variant/80 block">Exposure</span><strong data-exposure-score>${Math.round(Number(current.exposure_score))}</strong></div>
        <div><span class="text-xs text-on-surface-variant/80 block">Vulnerability</span><strong data-vulnerability-score>${Math.round(Number(current.vulnerability_score))}</strong></div>
        <div><span class="text-xs text-on-surface-variant/80 block">Infrastructure</span><strong data-infrastructure-score>${Math.round(Number(current.infrastructure_score))}</strong></div>
        <div><span class="text-xs text-on-surface-variant/80 block">Heat Index</span><strong>${Number(current.heat_index).toFixed(1)}°C</strong></div>
      </div>
    </div>

    <!-- Why risky -->
    <div class="p-4 rounded-lg bg-primary-container text-on-primary mb-6">
      <div class="font-semibold">Why is this area risky?</div>
      <div class="mt-1 text-sm">The HeatShield model identifies <strong>${mainDriver}</strong> as the strongest risk signal. Risk combines thermal stress, population exposure, vulnerability and infrastructure access.</div>
      <div class="mt-2 text-xs opacity-90">Thermal ${Math.round(Number(current.thermal_score))} • Exposure ${Math.round(Number(current.exposure_score))} • Vulnerability ${Math.round(Number(current.vulnerability_score))} • Infrastructure ${Math.round(Number(current.infrastructure_score))}</div>
    </div>

    <!-- Forecast -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-headline-sm text-headline-sm font-semibold text-on-surface">Live Forecast</h3>
        <span class="text-xs text-on-surface-variant">Next ${forecast.length ? Math.min(forecast.length, 36) : 0} hourly readings from backend</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-on-surface-variant font-label-sm">
              <th class="py-2">Time</th>
              <th>Temp</th>
              <th>Humidity</th>
              <th>Feels Like</th>
              <th>Thermal</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>${forecastRows}</tbody>
        </table>
      </div>
    </div>

    <!-- Facilities -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-headline-sm text-headline-sm font-semibold text-on-surface">Live Cooling Facilities</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">${facilityCards}</div>
    </div>

    <!-- Alerts -->
    <div class="mb-2">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-headline-sm text-headline-sm font-semibold text-on-surface">Live Alerts</h3>
      </div>
      <div class="grid gap-2">${alertRows}</div>
    </div>
  `;

  const panel = document.getElementById('heatshield-live-panel');
  if (panel) {
    const contentArea = panel.querySelector('.heatshield-panel-body');
    if (contentArea) contentArea.innerHTML = content.innerHTML;
  }
}

function riskBarColor(level) {
  const l = String(level || '').toLowerCase();
  if (['extreme', 'critical', 'severe'].includes(l)) return 'bg-error';
  if (l === 'high') return 'bg-secondary';
  if (l === 'moderate') return 'bg-secondary-container';
  return 'bg-primary-container';
}

function riskBadgeSafe(level) {
  const l = String(level || '').toLowerCase();
  return `<span class="px-2 py-0.5 rounded-full ${riskClassSafe(l)} font-label-sm text-label-sm">${(level || '--').toUpperCase()}</span>`;
}

export async function loadLiveGridMap() {
  setStatusConnecting();
  loadingPanel();
  const cache = loadCache();
  try {
    const data = await apiGet('/api/spatial/grid');
    saveCache({ grid: data, ...cache?.data });
    setStatusLive(data.updated_at);
    renderGridMap(data);
    return data;
  } catch (error) {
    console.warn('HeatShield grid map unavailable:', error);
    if (cache && cache.data && cache.data.grid) {
      setStatusOffline();
      renderGridMap(cache.data.grid, true);
      return cache.data.grid;
    }
    setStatusError();
    mountNoLiveData();
    return null;
  }
}

function renderGridMap(data, isOffline = false) {
  const grid = data.grid || [];
  const gridSize = data.grid_size || {};
  const statusNote = isOffline ? 'OFFLINE CACHED DATA' : 'LIVE';
  const statusClass = isOffline ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800';

  const cells = grid.map(cell => `
    <button data-cell="${cell.cell_code}" class="text-left p-3 rounded-lg border border-surface-container-high ${riskClassSafe(cell.risk?.risk_level)} hover:shadow-md transition-shadow">
      <div class="flex justify-between gap-2">
        <strong class="text-xs">${cell.cell_code}</strong>
        <span class="text-xs font-semibold">${String(cell.risk?.risk_level || '').toUpperCase()}</span>
      </div>
      <div class="text-2xl font-bold mt-1">${cell.risk?.final_score != null ? Math.round(Number(cell.risk.final_score)) : '--'}</div>
      <div class="text-xs mt-1 text-on-surface-variant/80">${cell.exposure_status || ''} • thermal ${cell.risk?.thermal_score != null ? Math.round(Number(cell.risk.thermal_score)) : '--'}</div>
    </button>`).join('');

  const html = `
    <div class="mb-4 flex flex-wrap items-center gap-3 text-xs text-on-surface-variant">
      <span class="px-2 py-0.5 rounded-full ${statusClass} font-semibold">${statusNote}</span>
      <span><strong>PostGIS Grid</strong> — ${gridSize.cells || grid.length} spatial cells (${gridSize.rows || '--'}×${gridSize.columns || '--'})</span>
      <span>• Source: ${data.source || 'Open-Meteo + PostGIS'}</span>
      <span>• Updated: ${data.updated_at ? formatTimeIST(data.updated_at) + ' IST' : '--'}</span>
    </div>
    <div class="p-3 rounded-lg bg-surface-container-low border border-surface-container-high mb-4 text-xs text-on-surface-variant">
      Data is sourced from the backend PostGIS grid. Live weather from reference locations is assigned to each grid cell; each cell does not have its own independent weather sensor.
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">${cells}</div>
    <div id="grid-explanation" class="mt-5"></div>
  `;

  const panel = document.getElementById('heatshield-live-panel');
  if (panel) {
    const contentArea = panel.querySelector('.heatshield-panel-body');
    if (contentArea) contentArea.innerHTML = html;
  }

  document.querySelectorAll('[data-cell]').forEach(button => {
    button.addEventListener('click', async () => {
      const cellCode = button.dataset.cell;
      const explanation = document.getElementById('grid-explanation');
      if (explanation) explanation.innerHTML = '<div class="text-sm text-on-surface-variant py-2">Loading cell analysis...</div>';
      try {
        const [why, history] = await Promise.all([
          apiGet(`/api/spatial/why-risky?cell_code=${cellCode}`),
          apiGet(`/api/spatial/history?cell_code=${cellCode}&days=7`),
        ]);
        renderCellExplanation(cellCode, why, history);
      } catch (error) {
        console.warn('Cell analysis failed:', error);
        if (explanation) explanation.innerHTML = '<div class="text-sm text-error">Could not load analysis for this cell. Please try again.</div>';
      }
    });
  });
}

function renderCellExplanation(cellCode, why, history) {
  const explanation = document.getElementById('grid-explanation');
  if (!explanation) return;
  const risk = why.risk || {};
  const expl = why.explanation || {};
  const hist = history && history.history ? history.history : [];

  const histRows = hist.length
    ? `<div class="grid gap-1">${hist.slice(0, 10).map(item => `
        <div class="flex justify-between text-xs border-b border-surface-container-high py-1.5">
          <span class="text-on-surface-variant">${String(item.timestamp).replace('T', ' ').slice(0, 16)}</span>
          <span class="font-medium">${Number(item.temperature).toFixed(1)}°C • ${Math.round(Number(item.humidity))}% RH${item.apparent_temperature != null ? ' • feels ' + Number(item.apparent_temperature).toFixed(1) + '°C' : ''}</span>
        </div>`).join('')}</div>`
    : '<div class="text-sm text-on-surface-variant">No historical observations have been synchronized yet.</div>';

  const components = expl.components || {};
  const reasons = expl.reasons && expl.reasons.length ? expl.reasons : [];

  explanation.innerHTML = `
    <div class="p-4 rounded-lg bg-surface-container-low border border-surface-container-high">
      <div class="flex items-center justify-between mb-2">
        <div class="font-semibold text-on-surface">${cellCode}: Why is this area risky?</div>
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded-full ${riskClassSafe(risk.risk_level)} text-xs font-semibold">${String(risk.risk_level || '').toUpperCase()} ${risk.final_score != null ? Math.round(Number(risk.final_score)) : ''}</span>
          <span class="text-xs text-on-surface-variant">PostGIS cell</span>
        </div>
      </div>
      <div class="mt-1 text-sm text-on-surface">${expl.summary || 'No summary available.'}</div>
      <div class="mt-2 text-sm">Main driver: <strong class="text-on-surface">${expl.main_driver || '--'}</strong></div>
      ${reasons.length ? `<div class="mt-1 text-xs text-on-surface-variant">Contributing: ${reasons.join(', ')}</div>` : ''}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-xs">
        <div class="p-2 rounded bg-surface-container-highest"><span class="block text-on-surface-variant">Thermal</span><strong>${Math.round(Number(risk.thermal_score))}</strong></div>
        <div class="p-2 rounded bg-surface-container-highest"><span class="block text-on-surface-variant">Exposure</span><strong>${Math.round(Number(risk.exposure_score))}</strong></div>
        <div class="p-2 rounded bg-surface-container-highest"><span class="block text-on-surface-variant">Vulnerability</span><strong>${Math.round(Number(risk.vulnerability_score))}</strong></div>
        <div class="p-2 rounded bg-surface-container-highest"><span class="block text-on-surface-variant">Infrastructure</span><strong>${Math.round(Number(risk.infrastructure_score))}</strong></div>
      </div>
      ${Object.keys(components).length ? `
        <div class="mt-3 text-xs text-on-surface-variant">
          <span class="font-semibold block mb-1">Driver components:</span>
          ${Object.entries(components).map(([k, v]) => `<span class="inline-block mr-3"><span class="capitalize">${k.replace(/_/g, ' ')}:</span> <strong>${Number(v).toFixed(1)}</strong></span>`).join('')}
        </div>` : ''}
      <div class="mt-5">
        <div class="font-semibold text-sm text-on-surface mb-1">Historical synchronized observations (${history.reference_location || 'reference location'})</div>
        <div class="text-xs text-on-surface-variant mb-2">HISTORICAL SYNCHRONIZED DATA — not live sensor readings</div>
        ${histRows}
      </div>
    </div>
  `;
}

export async function loadLiveFirstResponder() {
  setStatusConnecting();
  loadingPanel();
  const cache = loadCache();
  try {
    const data = await apiGet('/api/live/responders');
    saveCache({ responders: data, ...cache?.data });
    setStatusLive(data.updated_at);
    renderFirstResponderLive(data);
    return data;
  } catch (error) {
    console.warn('HeatShield responders unavailable:', error);
    if (cache && cache.data && cache.data.responders) {
      setStatusOffline();
      renderFirstResponderLive(cache.data.responders, true);
      return cache.data.responders;
    }
    setStatusError();
    mountNoLiveData();
    return null;
  }
}

function renderFirstResponderLive(data, isOffline = false) {
  const priorities = data.priorities || [];
  const statusNote = isOffline ? 'OFFLINE CACHED DATA' : 'LIVE';
  const statusClass = isOffline ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800';

  const rows = priorities.map(item => `
    <div class="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low border border-surface-container-high">
      <div class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shrink-0">${item.priority}</div>
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-on-surface truncate">${item.location && item.location.name ? item.location.name : '--'}</div>
        <div class="text-xs text-on-surface-variant">Score ${Math.round(Number(item.score))} • ${String(item.risk_level || '').toUpperCase()}</div>
      </div>
      <span class="px-2 py-1 rounded-full ${riskClassSafe(item.risk_level)} text-xs font-semibold whitespace-nowrap">${item.action || '--'}</span>
    </div>`).join('');

  const html = `
    <div class="mb-4 flex flex-wrap items-center gap-3 text-xs text-on-surface-variant">
      <span class="px-2 py-0.5 rounded-full ${statusClass} font-semibold">${statusNote}</span>
      <span>Source: ${data.source || 'HeatShield'}</span>
      <span>• Updated: ${data.updated_at ? formatTimeIST(data.updated_at) + ' IST' : '--'}</span>
    </div>
    <div class="grid gap-2">${rows || '<div class="text-sm text-on-surface-variant">No responder priorities available.</div>'}</div>
  `;

  const panel = document.getElementById('heatshield-live-panel');
  if (panel) {
    const contentArea = panel.querySelector('.heatshield-panel-body');
    if (contentArea) contentArea.innerHTML = html;
  }
}

export async function loadLiveInterventions(locationId = 1) {
  setStatusConnecting();
  loadingPanel();
  const cache = loadCache();
  try {
    const data = await apiGet(`/api/live/interventions?location_id=${locationId}`);
    saveCache({ interventions: data, ...cache?.data });
    setStatusLive(new Date().toISOString());
    renderInterventionsLive(data);
    return data;
  } catch (error) {
    console.warn('HeatShield interventions unavailable:', error);
    if (cache && cache.data && cache.data.interventions) {
      setStatusOffline();
      renderInterventionsLive(cache.data.interventions, true);
      return cache.data.interventions;
    }
    setStatusError();
    mountNoLiveData();
    return null;
  }
}

function renderInterventionsLive(data, isOffline = false) {
  const baseline = data.baseline || {};
  const location = data.location || {};
  const statusNote = isOffline ? 'OFFLINE CACHED DATA' : 'LIVE';
  const statusClass = isOffline ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800';

  const actions = ['shade', 'water', 'cooling'];
  let active = new Set(Object.entries(data.interventions || {}).filter(([, v]) => v).map(([k]) => k));

  const buttons = actions.map(action => `
    <button data-intervention-action="${action}" class="px-3 py-2 rounded-lg border border-surface-container-high text-sm font-medium transition-colors ${active.has(action) ? 'bg-primary-container text-on-primary' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'}">
      ${action.charAt(0).toUpperCase() + action.slice(1)}
    </button>`).join('');

  const html = `
    <div class="mb-4 flex flex-wrap items-center gap-3 text-xs text-on-surface-variant">
      <span class="px-2 py-0.5 rounded-full ${statusClass} font-semibold">${statusNote}</span>
      <span>Location: <strong class="text-on-surface">${location.name || '--'}</strong></span>
      <span>• Baseline from current live weather</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div class="p-4 rounded-lg bg-surface-container-low">
        <div class="text-xs text-on-surface-variant">Current Risk (Baseline)</div>
        <div class="text-3xl font-bold mt-1 text-error">${baseline.final_score != null ? Math.round(Number(baseline.final_score)) : '--'}</div>
        <div class="text-sm mt-1">${String(baseline.risk_level || '').toUpperCase()}</div>
      </div>
      <div class="p-4 rounded-lg bg-surface-container-low">
        <div class="text-xs text-on-surface-variant">Try interventions</div>
        <div class="flex flex-wrap gap-2 mt-3">${buttons}</div>
      </div>
      <div class="p-4 rounded-lg bg-surface-container-low">
        <div class="text-xs text-on-surface-variant">Projected Risk</div>
        <div id="live-projected-score" class="text-3xl font-bold mt-1 text-primary" data-projected-score>${data.projected_score != null ? Math.round(Number(data.projected_score)) : '--'}</div>
        <div id="live-projected-level" class="text-sm mt-1" data-projected-level>${String(data.projected_level || '').toUpperCase()}</div>
        <div id="live-projected-reduction" class="text-xs mt-1 text-on-surface-variant">${data.estimated_reduction != null ? 'Est. reduction: ' + Number(data.estimated_reduction).toFixed(1) + ' pts' : ''}</div>
      </div>
    </div>
  `;

  const panel = document.getElementById('heatshield-live-panel');
  if (panel) {
    const contentArea = panel.querySelector('.heatshield-panel-body');
    if (contentArea) contentArea.innerHTML = html;
  }

  document.querySelectorAll('[data-intervention-action]').forEach(button => {
    button.addEventListener('click', async () => {
      const action = button.dataset.interventionAction;
      if (active.has(action)) {
        active.delete(action);
      } else {
        active.add(action);
      }
      button.classList.toggle('bg-primary-container', active.has(action));
      button.classList.toggle('text-on-primary', active.has(action));
      button.classList.toggle('bg-surface-container-low', !active.has(action));
      button.classList.toggle('text-on-surface', !active.has(action));
      button.classList.toggle('hover:bg-surface-container', !active.has(action));

      const params = new URLSearchParams({ location_id: String(currentLocationId) });
      ['shade', 'water', 'cooling'].forEach(a => {
        if (active.has(a)) params.set(a, 'true');
      });
      try {
        const next = await apiGet(`/api/live/interventions?${params}`);
        const scoreEl = document.getElementById('live-projected-score');
        const levelEl = document.getElementById('live-projected-level');
        const redEl = document.getElementById('live-projected-reduction');
        if (scoreEl) scoreEl.textContent = next.projected_score != null ? Math.round(Number(next.projected_score)) : '--';
        if (levelEl) levelEl.textContent = String(next.projected_level || '').toUpperCase();
        if (redEl) redEl.textContent = next.estimated_reduction != null ? 'Est. reduction: ' + Number(next.estimated_reduction).toFixed(1) + ' pts' : '';
        setStatusLive(new Date().toISOString());
      } catch (error) {
        console.warn('Intervention update failed:', error);
      }
    });
  });
}

export async function loadLiveRoute(route) {
  if (route === 'dashboard' || route === 'forecast-stress' || route === 'cooling-facilities') {
    return loadLiveDashboard(currentLocationId);
  }
  if (route === 'risk-map') return loadLiveGridMap();
  if (route === 'first-responder') return loadLiveFirstResponder();
  if (route === 'interventions') return loadLiveInterventions(currentLocationId);
}

export async function useMyLocation() {
  if (!navigator.geolocation) throw new Error('GPS is not available in this browser');
  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 });
  });
  return apiGet(`/api/spatial/nearby?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&radius_km=5`);
}

export const heatshieldUseMyLocation = async function () {
  try {
    const data = await useMyLocation();
    const cards = data.facilities && data.facilities.length
      ? data.facilities.map(item => `
          <div class="p-3 rounded-lg bg-surface-container-low border border-surface-container-high">
            <div class="flex justify-between">
              <strong class="text-sm">${item.name}</strong>
              <span class="text-sm font-semibold">${Number(item.distance_km).toFixed(2)} km</span>
            </div>
            <div class="text-sm text-on-surface-variant mt-1">${item.type || 'facility'} • ${item.available != null ? item.available : (Number(item.capacity) - Number(item.occupancy))} spaces available</div>
            <div class="text-xs text-on-surface-variant mt-0.5">${String(item.status || '').toUpperCase()}</div>
          </div>`).join('')
      : '<div class="text-sm text-on-surface-variant">No registered cooling/relief facility found within 5 km.</div>';
    mountLivePanel('Nearby Cooling Centres / Shelters', 'GPS location • PostGIS proximity search', `
      <div class="mb-3 text-sm text-on-surface-variant">Your location was used only for this proximity lookup.</div>
      <div class="grid gap-2">${cards}</div>
    `, { onGps: false });
  } catch (error) {
    console.warn('GPS lookup failed:', error);
    let message = 'Location lookup failed. Please try again.';
    if (error && error.code === 1) message = 'GPS permission denied. Please allow location access in your browser and try again.';
    else if (error && error.code === 2) message = 'GPS unavailable. Your browser could not determine your location.';
    else if (error && error.code === 3) message = 'GPS timed out. Please try again.';
    else if (error && error.message && error.message.startsWith('API')) message = 'HeatShield backend unavailable for nearby facility lookup.';
    mountLivePanel('Location unavailable', 'GPS permission or browser location failed', `
      <div class="p-4 rounded-lg bg-secondary-container/20 text-on-secondary-container text-sm">${message}</div>
    `, { onGps: false });
  }
};

window.heatshieldUseMyLocation = heatshieldUseMyLocation;

export { API_BASE };
