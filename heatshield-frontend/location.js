import { API_BASE, apiGet, formatTimeIST } from './api.js';

let currentCoordinates = null;
let modalReady = false;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function formatLocationName(location) {
  const parts = [location.name, location.admin1, location.country].filter(Boolean);
  return [...new Set(parts)].join(', ');
}

function ensureModal() {
  if (modalReady || document.getElementById('location-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'location-modal';
  modal.className = 'hidden fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm p-4 items-center justify-center';
  modal.innerHTML = `
    <div class="w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-2xl">
      <div class="p-5 border-b border-surface-container-high flex items-start justify-between gap-4">
        <div>
          <div class="text-lg font-semibold text-on-surface">Choose monitoring location</div>
          <div class="text-sm text-on-surface-variant mt-1">Search any city worldwide or use your device's current location.</div>
        </div>
        <button id="location-modal-close" type="button" aria-label="Close location dialog" class="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      <div class="p-5">
        <div class="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
          <input id="location-search-input" type="search" autocomplete="off" placeholder="Search city, district or country…" class="min-w-0 rounded-xl border border-outline-variant/50 bg-surface-container-low px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <button id="location-search-button" type="button" class="rounded-xl bg-primary-container text-on-primary px-5 py-3 text-sm font-semibold hover:opacity-90">Search</button>
        </div>
        <button id="location-use-gps" type="button" class="mt-3 w-full rounded-xl border border-primary/30 bg-primary-fixed/40 px-4 py-3 text-left hover:bg-primary-fixed transition-colors">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">my_location</span>
            <div>
              <div class="text-sm font-semibold text-on-surface">Use my current location</div>
              <div class="text-xs text-on-surface-variant mt-0.5">Fetch live weather and thermal risk for your GPS coordinates.</div>
            </div>
          </div>
        </button>
        <div id="location-search-status" class="min-h-5 mt-4 text-xs text-on-surface-variant" aria-live="polite"></div>
        <div id="location-search-results" class="mt-2 grid gap-2 max-h-72 overflow-y-auto"></div>
      </div>
    </div>`;
  document.body.appendChild(modal);

  const close = () => closeLocationPicker();
  document.getElementById('location-modal-close').addEventListener('click', close);
  modal.addEventListener('click', event => {
    if (event.target === modal) close();
  });
  document.getElementById('location-search-button').addEventListener('click', searchLocations);
  document.getElementById('location-search-input').addEventListener('keydown', event => {
    if (event.key === 'Enter') searchLocations();
    if (event.key === 'Escape') close();
  });
  document.getElementById('location-use-gps').addEventListener('click', useCurrentLocation);
  modalReady = true;
}

export function openLocationPicker() {
  ensureModal();
  const modal = document.getElementById('location-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  const input = document.getElementById('location-search-input');
  if (input) setTimeout(() => input.focus(), 0);
}

export function closeLocationPicker() {
  const modal = document.getElementById('location-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

async function searchLocations() {
  const input = document.getElementById('location-search-input');
  const status = document.getElementById('location-search-status');
  const results = document.getElementById('location-search-results');
  const query = input?.value.trim() || '';
  if (!query || query.length < 2) {
    if (status) status.textContent = 'Enter at least 2 characters.';
    return;
  }
  if (status) status.textContent = 'Searching global locations…';
  if (results) results.innerHTML = '';
  try {
    const data = await apiGet(`/api/live/search?query=${encodeURIComponent(query)}`);
    const locations = data.results || [];
    if (!locations.length) {
      if (status) status.textContent = 'No matching locations found.';
      return;
    }
    if (status) status.textContent = `${locations.length} locations found`;
    results.innerHTML = locations.map((location, index) => `
      <button type="button" data-location-index="${index}" class="w-full text-left p-3 rounded-xl border border-surface-container-high bg-surface-container-low hover:bg-surface-container transition-colors">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-primary">location_on</span>
          <div class="min-w-0">
            <div class="text-sm font-semibold text-on-surface truncate">${escapeHtml(location.name)}</div>
            <div class="text-xs text-on-surface-variant truncate">${escapeHtml([location.admin1, location.country].filter(Boolean).join(', '))}</div>
          </div>
        </div>
      </button>`).join('');
    results.querySelectorAll('[data-location-index]').forEach(button => {
      button.addEventListener('click', () => {
        const location = locations[Number(button.dataset.locationIndex)];
        if (location) loadGlobalLocation(location);
      });
    });
  } catch (error) {
    console.warn('Location search failed:', error);
    if (status) status.textContent = 'Location search is unavailable. Check that the HeatShield backend is running.';
  }
}

async function useCurrentLocation() {
  const status = document.getElementById('location-search-status');
  if (!navigator.geolocation) {
    if (status) status.textContent = 'Geolocation is not available in this browser.';
    return;
  }
  if (status) status.textContent = 'Requesting your current location…';
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 300000,
      });
    });
    const { latitude, longitude } = position.coords;
    currentCoordinates = { latitude, longitude };
    await loadCurrentCoordinates(latitude, longitude);
  } catch (error) {
    console.warn('GPS lookup failed:', error);
    const message = error?.code === 1
      ? 'Location permission was denied. Allow location access and try again.'
      : error?.code === 2
        ? 'Your browser could not determine your location.'
        : error?.code === 3
          ? 'Location request timed out. Try again.'
          : 'Could not read your current location.';
    if (status) status.textContent = message;
  }
}

async function loadCurrentCoordinates(latitude, longitude) {
  const status = document.getElementById('location-search-status');
  if (status) status.textContent = 'Fetching live conditions for your location…';
  try {
    const data = await apiGet(`/api/live/current?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`);
    closeLocationPicker();
    renderExternalLocation(data, 'current');
  } catch (error) {
    console.warn('Current-location weather failed:', error);
    if (status) status.textContent = 'Could not fetch live weather for this location.';
  }
}

async function loadGlobalLocation(location) {
  closeLocationPicker();
  currentCoordinates = { latitude: Number(location.latitude), longitude: Number(location.longitude) };
  try {
    const data = await apiGet(`/api/live/current?latitude=${encodeURIComponent(location.latitude)}&longitude=${encodeURIComponent(location.longitude)}`);
    data.location = {
      ...(data.location || {}),
      name: formatLocationName(location),
      district: location.admin2 || location.admin1 || location.country || 'Selected location',
      latitude: location.latitude,
      longitude: location.longitude,
    };
    renderExternalLocation(data, 'search');
  } catch (error) {
    console.warn('Selected-location weather failed:', error);
    renderExternalLocationError(formatLocationName(location));
  }
}

function renderExternalLocation(data, sourceMode) {
  const app = document.getElementById('app-content');
  if (!app) return;
  const current = data.current || {};
  const location = data.location || {};
  const forecast = data.forecast || [];
  const peak = data.peak || {};
  const risk = String(current.risk_level || 'low').toLowerCase();
  const riskClass = risk === 'extreme' ? 'bg-error-container text-on-error-container' : risk === 'high' ? 'bg-secondary-fixed text-on-secondary-fixed' : risk === 'moderate' ? 'bg-secondary-container/20 text-on-secondary-container' : 'bg-primary-fixed text-on-primary-fixed';
  const forecastRows = forecast.slice(0, 24).map(item => `
    <tr class="border-t border-surface-container-high">
      <td class="py-2 whitespace-nowrap">${escapeHtml(formatForecastTime(item.timestamp, data.timezone))}</td>
      <td class="py-2 font-semibold">${Number(item.temperature).toFixed(1)}°C</td>
      <td class="py-2">${Math.round(Number(item.humidity))}%</td>
      <td class="py-2">${Number(item.apparent_temperature).toFixed(1)}°C</td>
      <td class="py-2">${Math.round(Number(item.thermal_score))}</td>
      <td class="py-2"><span class="px-2 py-0.5 rounded-full ${riskBadgeClass(item.risk_level)} text-[11px] font-semibold">${escapeHtml(String(item.risk_level || '').toUpperCase())}</span></td>
    </tr>`).join('');

  app.innerHTML = `
    <div class="max-w-7xl w-full mx-auto p-space-md flex flex-col gap-4">
      <div class="rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-sm overflow-hidden">
        <div class="p-5 border-b border-surface-container-high flex flex-wrap items-center justify-between gap-4">
          <div class="min-w-0">
            <div class="flex items-center gap-2 text-xs text-primary font-semibold uppercase tracking-wider">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              ${sourceMode === 'current' ? 'Current location' : 'Selected location'} • LIVE
            </div>
            <h1 class="text-2xl font-semibold text-on-surface mt-1 truncate">${escapeHtml(location.name || 'Selected location')}</h1>
            <div class="text-sm text-on-surface-variant mt-1">${escapeHtml(data.timezone || 'Local timezone')} • ${Number(location.latitude).toFixed(4)}, ${Number(location.longitude).toFixed(4)}</div>
          </div>
          <div class="flex flex-wrap gap-2">
            <button id="external-change-location" type="button" class="px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-low text-on-surface text-sm font-semibold hover:bg-surface-container-high">Change location</button>
            <button id="external-use-gps" type="button" class="px-4 py-2.5 rounded-xl bg-primary-container text-on-primary text-sm font-semibold hover:opacity-90"><span class="material-symbols-outlined text-[17px] align-middle mr-1">my_location</span>Use my location</button>
          </div>
        </div>
        <div class="p-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div class="metric-card p-4 rounded-xl bg-surface-container-low">
              <div class="text-xs text-on-surface-variant">Temperature</div>
              <div class="text-3xl font-bold mt-1">${Number(current.temperature).toFixed(1)}°C</div>
              <div class="text-sm text-on-surface-variant mt-1">Feels like ${Number(current.apparent_temperature).toFixed(1)}°C</div>
            </div>
            <div class="metric-card p-4 rounded-xl bg-surface-container-low">
              <div class="text-xs text-on-surface-variant">Humidity</div>
              <div class="text-3xl font-bold mt-1">${Math.round(Number(current.humidity))}%</div>
              <div class="text-sm text-on-surface-variant mt-1">Heat index ${Number(current.heat_index).toFixed(1)}°C</div>
            </div>
            <div class="metric-card p-4 rounded-xl bg-surface-container-low">
              <div class="text-xs text-on-surface-variant">Wind</div>
              <div class="text-3xl font-bold mt-1">${Number(current.wind_speed).toFixed(1)} <span class="text-base font-medium">km/h</span></div>
              <div class="text-sm text-on-surface-variant mt-1">Live weather</div>
            </div>
            <div class="metric-card p-4 rounded-xl bg-surface-container-low">
              <div class="text-xs text-on-surface-variant">Thermal risk</div>
              <div class="text-3xl font-bold mt-1">${Math.round(Number(current.thermal_score))}<span class="text-base font-medium">/100</span></div>
              <div class="mt-2"><span class="px-2 py-1 rounded-full ${riskClass} text-xs font-semibold">${escapeHtml(risk.toUpperCase())}</span></div>
            </div>
          </div>

          <div class="mt-4 p-4 rounded-xl border border-surface-container-high bg-surface-container-low">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Next 24h peak thermal risk</div>
                <div class="text-2xl font-bold mt-1">${peak.final_score != null ? Math.round(Number(peak.final_score)) : Math.round(Number(current.final_score))}<span class="text-sm font-medium text-on-surface-variant">/100</span></div>
              </div>
              <div class="text-sm text-on-surface-variant">${escapeHtml(formatForecastTime(peak.timestamp, data.timezone))}</div>
            </div>
            <div class="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden mt-3"><div class="h-full bg-primary-container rounded-full" style="width:${Math.min(100, Math.max(0, Number(current.final_score) || 0))}%"></div></div>
          </div>

          <div class="mt-4 p-4 rounded-xl bg-primary-container text-on-primary">
            <div class="font-semibold">Risk interpretation</div>
            <div class="text-sm mt-1">This arbitrary location is evaluated using live thermal conditions. Municipal exposure, vulnerability and infrastructure scores are not fabricated when they are unavailable.</div>
            <div class="text-xs mt-2 opacity-90">${escapeHtml(data.risk_note || 'Thermal stress is the available live risk signal for this location.')}</div>
          </div>

          <div class="mt-6">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-lg font-semibold">24-hour live forecast</h2>
              <span class="text-xs text-on-surface-variant">Open-Meteo • ${escapeHtml(formatTimeIST(data.updated_at))}</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead><tr class="text-xs uppercase tracking-wider text-on-surface-variant"><th class="py-2">Time</th><th>Temp</th><th>Humidity</th><th>Feels like</th><th>Thermal</th><th>Risk</th></tr></thead>
                <tbody>${forecastRows}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  document.getElementById('external-change-location')?.addEventListener('click', openLocationPicker);
  document.getElementById('external-use-gps')?.addEventListener('click', useCurrentLocationFromExternal);

  updateHeaderLocation(location, sourceMode);
}

function renderExternalLocationError(name) {
  const app = document.getElementById('app-content');
  if (!app) return;
  app.innerHTML = `
    <div class="max-w-7xl w-full mx-auto p-space-md">
      <div class="p-6 rounded-2xl bg-surface-container-lowest border border-error/30 shadow-sm">
        <div class="text-lg font-semibold">Live data unavailable for ${escapeHtml(name)}</div>
        <div class="text-sm text-on-surface-variant mt-1">The location was found, but live weather could not be fetched. Please try again.</div>
        <button id="location-error-change" type="button" class="mt-4 px-4 py-2.5 rounded-xl bg-primary-container text-on-primary text-sm font-semibold">Choose another location</button>
      </div>
    </div>`;
  document.getElementById('location-error-change')?.addEventListener('click', openLocationPicker);
}

function updateHeaderLocation(location, sourceMode) {
  const select = document.getElementById('location-select');
  if (!select) return;
  const value = '__external__';
  let option = select.querySelector(`option[value="${value}"]`);
  if (!option) {
    option = document.createElement('option');
    option.value = value;
    select.appendChild(option);
  }
  option.textContent = sourceMode === 'current' ? '📍 Current location' : `🌐 ${location.name || 'Selected location'}`;
  select.value = value;
  select.dataset.selected = value;
  select.disabled = false;
}

function formatForecastTime(value, timezone) {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).replace('T', ' ').slice(0, 16);
  return date.toLocaleString('en-IN', { weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: timezone || 'UTC' });
}

function riskBadgeClass(level) {
  const l = String(level || '').toLowerCase();
  if (['extreme', 'critical', 'severe'].includes(l)) return 'bg-error-container text-on-error-container';
  if (l === 'high') return 'bg-secondary-fixed text-on-secondary-fixed';
  if (l === 'moderate') return 'bg-secondary-container/20 text-on-secondary-container';
  return 'bg-primary-fixed text-on-primary-fixed';
}

async function useCurrentLocationFromExternal() {
  await useCurrentLocation();
}

export function initLocationControls() {
  ensureModal();
  const gpsButton = document.getElementById('header-use-location');
  const changeButton = document.getElementById('header-change-location');
  if (gpsButton && !gpsButton.dataset.bound) {
    gpsButton.dataset.bound = '1';
    gpsButton.addEventListener('click', useCurrentLocation);
  }
  if (changeButton && !changeButton.dataset.bound) {
    changeButton.dataset.bound = '1';
    changeButton.addEventListener('click', openLocationPicker);
  }
}

export function getExternalCoordinates() {
  return currentCoordinates;
}
