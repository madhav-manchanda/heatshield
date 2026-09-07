import { renderDashboard } from './pages/dashboard.js';
import { renderRiskMap } from './pages/risk-map.js';
import { renderInterventions } from './pages/interventions.js';
import { renderFirstResponder } from './pages/first-responder.js';
import { loadLiveRoute, setCurrentLocationId } from './live.js';
import { API_BASE, apiGet, formatTimeIST } from './api.js';

const routes = {
  'dashboard': renderDashboard,
  'risk-map': renderRiskMap,
  'interventions': renderInterventions,
  'first-responder': renderFirstResponder,
};

const navPageMap = {
  'dashboard': 'dashboard',
  'risk-map': 'risk-map',
  'forecast-stress': 'dashboard',
  'cooling-facilities': 'dashboard',
  'interventions': 'interventions',
  'first-responder': 'first-responder',
};

let locationsCache = [];

function getRoute() {
  const hash = window.location.hash.slice(1) || 'dashboard';
  return routes[hash] ? hash : 'dashboard';
}

function updateSidebar(route) {
  document.querySelectorAll('#sidebar-nav .nav-link').forEach(link => {
    const page = link.dataset.page;
    const isActive = navPageMap[page] === route || page === route;
    link.className = isActive
      ? 'nav-link flex items-center gap-space-xs px-space-sm py-space-xs transition-colors bg-primary-container text-on-primary font-medium rounded-full shadow-sm'
      : 'nav-link flex items-center gap-space-xs px-space-sm py-space-xs rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors';
  });
}

async function loadLocations() {
  const select = document.getElementById('location-select');
  if (!select) return;
  try {
    const locations = await apiGet('/api/live/locations');
    locationsCache = locations || [];
    select.innerHTML = '<option value="" disabled>Select location...</option>' +
      locationsCache.map(loc => `<option value="${loc.id}" ${Number(loc.id) === Number(select.dataset.selected) ? 'selected' : ''}>${loc.name}</option>`).join('');
    select.disabled = false;
  } catch (_) {
    select.innerHTML = '<option value="" disabled selected>Locations unavailable</option>';
    select.disabled = true;
  }
}

async function navigate() {
  const route = getRoute();
  const container = document.getElementById('app-content');
  const renderer = routes[route];

  container.innerHTML = '';
  container.style.animation = 'none';
  container.offsetHeight;
  container.style.animation = 'fadeIn 0.15s ease-out';

  if (renderer) renderer(container);
  updateSidebar(route);
  await loadLiveRoute(route);
}

window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', () => {
  // Wire up location selector
  const locationSelect = document.getElementById('location-select');
  if (locationSelect) {
    locationSelect.addEventListener('change', async (e) => {
      const id = e.target.value;
      if (id) {
        locationSelect.dataset.selected = id;
        await setCurrentLocationId(id);
      }
    });
  }
  loadLocations();
  navigate();
});

// Refresh live data without rebuilding the page every five minutes.
setInterval(() => {
  if (document.visibilityState === 'visible') loadLiveRoute(getRoute());
}, 300000);
