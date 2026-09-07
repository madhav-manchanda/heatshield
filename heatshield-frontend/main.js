import { renderDashboard } from './pages/dashboard.js';
import { renderRiskMap } from './pages/risk-map.js';
import { renderInterventions } from './pages/interventions.js';
import { renderFirstResponder } from './pages/first-responder.js';
import { loadLiveRoute, setCurrentLocationId } from './live.js';
import { apiGet } from './api.js';
import { initLocationControls, openLocationPicker } from './location.js';

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

function polishLivePanelHeader() {
  const status = document.getElementById('connection-status')?.dataset.status;
  if (status !== 'live') return;
  const body = document.querySelector('#heatshield-live-panel .heatshield-panel-body');
  const subtitle = body?.previousElementSibling?.querySelector('.mt-1');
  if (subtitle) subtitle.textContent = 'Live municipal heat intelligence • refreshed from HeatShield backend';
}

async function loadLocations() {
  const select = document.getElementById('location-select');
  if (!select) return;
  select.setAttribute('aria-label', 'Delhi monitoring zone');
  select.title = 'Select a monitoring zone within Delhi';

  try {
    const locations = await apiGet('/api/live/locations');
    locationsCache = locations || [];
    select.innerHTML = '<option value="" disabled>Select Delhi zone...</option>' +
      locationsCache.map(loc => `<option value="${loc.id}" ${Number(loc.id) === Number(select.dataset.selected) ? 'selected' : ''}>Delhi · ${loc.name}</option>`).join('');
    select.disabled = false;
  } catch (_) {
    select.innerHTML = '<option value="" disabled selected>Delhi zones unavailable</option>';
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
  polishLivePanelHeader();
}

window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', () => {
  const locationSelect = document.getElementById('location-select');
  if (locationSelect) {
    locationSelect.addEventListener('change', async (e) => {
      const id = e.target.value;
      if (id === '__external__') return;
      if (id) {
        locationSelect.dataset.selected = id;
        await setCurrentLocationId(id);
        polishLivePanelHeader();
      }
    });
  }

  initLocationControls();
  loadLocations();
  navigate();

  // Offer GPS once when the dashboard first opens; the user must explicitly approve it.
  setTimeout(() => {
    if (getRoute() === 'dashboard' && !sessionStorage.getItem('heatshield-location-prompt-seen')) {
      sessionStorage.setItem('heatshield-location-prompt-seen', '1');
      openLocationPicker();
    }
  }, 1200);
});

setInterval(() => {
  if (document.visibilityState === 'visible') {
    loadLiveRoute(getRoute()).then(polishLivePanelHeader);
  }
}, 300000);
