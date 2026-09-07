import { renderDashboard } from './pages/dashboard.js';
import { renderRiskMap } from './pages/risk-map.js';
import { renderInterventions } from './pages/interventions.js';
import { renderFirstResponder } from './pages/first-responder.js';
import { loadLiveRoute, setCurrentLocationId } from './live.js';
import { apiGet } from './api.js';
import { initLocationControls, openLocationPicker } from './location.js';

const routes = {
  dashboard: renderDashboard,
  'risk-map': renderRiskMap,
  'forecast-stress': renderDashboard,
  'cooling-facilities': renderDashboard,
  interventions: renderInterventions,
  'first-responder': renderFirstResponder,
};

let locationsCache = [];

function getRoute() {
  const hash = window.location.hash.slice(1) || 'dashboard';
  return routes[hash] ? hash : 'dashboard';
}

function updateSidebar(route) {
  document.querySelectorAll('#sidebar-nav .nav-link').forEach(link => {
    const page = link.dataset.page;
    const isActive = page === route;
    link.className = isActive
      ? 'nav-link flex items-center gap-space-xs px-space-sm py-space-xs transition-colors bg-primary-container text-on-primary font-medium rounded-full shadow-sm'
      : 'nav-link flex items-center gap-space-xs px-space-sm py-space-xs rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors';
  });
}

function ensureHeaderLocationActions() {
  const select = document.getElementById('location-select');
  if (!select || document.getElementById('header-location-actions')) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'header-location-actions';
  wrapper.className = 'flex items-center gap-1.5';
  wrapper.innerHTML = `
    <button id="header-change-location" type="button" aria-label="Search for a location" title="Search any city or location" class="h-9 px-3 rounded-full bg-surface-container-low border border-outline-variant/40 text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-xs font-semibold hidden sm:flex items-center gap-1.5">
      <span class="material-symbols-outlined text-[17px]">search</span>
      <span>Location</span>
    </button>
    <button id="header-use-location" type="button" aria-label="Use current location" title="Use my current GPS location" class="h-9 w-9 rounded-full bg-primary-container text-on-primary hover:opacity-90 transition-opacity flex items-center justify-center">
      <span class="material-symbols-outlined text-[18px]">my_location</span>
    </button>`;

  select.parentNode.insertBefore(wrapper, select.nextSibling);

  document.getElementById('header-change-location')?.addEventListener('click', () => {
    openLocationPicker();
  });

  document.getElementById('header-use-location')?.addEventListener('click', () => {
    openLocationPicker();
    setTimeout(() => document.getElementById('location-use-gps')?.click(), 50);
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
  select.title = 'Select a configured Delhi monitoring zone';

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

function bindNavigation() {
  document.querySelectorAll('#sidebar-nav .nav-link').forEach(link => {
    if (link.dataset.bound === 'true') return;
    link.dataset.bound = 'true';
    link.addEventListener('click', event => {
      const page = link.dataset.page;
      if (!routes[page]) return;
      event.preventDefault();
      if (window.location.hash.slice(1) !== page) {
        window.location.hash = page;
      } else {
        navigate();
      }
    });
  });
}

function bindHeaderUtilityButtons() {
  const notificationButton = document.querySelector('button[aria-label="Notifications"]');
  if (notificationButton && notificationButton.dataset.bound !== 'true') {
    notificationButton.dataset.bound = 'true';
    notificationButton.addEventListener('click', () => {
      const alerts = document.querySelector('#heatshield-live-panel');
      if (alerts) {
        alerts.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (window.location.hash.slice(1) !== 'dashboard') {
        window.location.hash = 'dashboard';
      } else {
        document.getElementById('app-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  const settingsButton = document.querySelector('button[aria-label="Settings"]');
  if (settingsButton && settingsButton.dataset.bound !== 'true') {
    settingsButton.dataset.bound = 'true';
    settingsButton.addEventListener('click', openSettingsDialog);
  }

  document.querySelectorAll('header button[type="button"]').forEach(button => {
    const label = button.textContent.trim();
    if (!['Citizen', 'Authority', 'First Responder'].includes(label)) return;
    if (button.dataset.bound === 'true') return;
    button.dataset.bound = 'true';
    button.addEventListener('click', () => {
      window.location.hash = label === 'First Responder' ? 'first-responder' : 'dashboard';
    });
  });

  const profile = document.querySelector('header div.w-8.h-8.rounded-full.bg-primary');
  if (profile && profile.dataset.bound !== 'true') {
    profile.dataset.bound = 'true';
    profile.setAttribute('role', 'button');
    profile.setAttribute('tabindex', '0');
    profile.setAttribute('aria-label', 'Profile');
    profile.title = 'Profile';
    const open = () => openInfoDialog('Profile', 'HeatShield Authority workspace', 'Profile controls are not connected to an authentication service yet.');
    profile.addEventListener('click', open);
    profile.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') open();
    });
  }
}

function openInfoDialog(title, subtitle, message) {
  closeDialog();
  const dialog = document.createElement('div');
  dialog.id = 'heatshield-info-dialog';
  dialog.className = 'fixed inset-0 z-[90] bg-black/45 backdrop-blur-sm p-4 flex items-center justify-center';
  dialog.innerHTML = `
    <div class="w-full max-w-md rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-2xl p-5">
      <div class="flex items-start justify-between gap-4">
        <div>
          <div class="text-lg font-semibold text-on-surface">${title}</div>
          <div class="text-xs text-on-surface-variant mt-1">${subtitle}</div>
        </div>
        <button id="heatshield-dialog-close" type="button" aria-label="Close dialog" class="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container-high">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="mt-4 p-3 rounded-xl bg-surface-container-low text-sm text-on-surface-variant">${message}</div>
    </div>`;
  document.body.appendChild(dialog);
  dialog.querySelector('#heatshield-dialog-close')?.addEventListener('click', closeDialog);
  dialog.addEventListener('click', event => {
    if (event.target === dialog) closeDialog();
  });
}

function openSettingsDialog() {
  openInfoDialog('HeatShield Settings', 'Application status', `Backend API: ${document.getElementById('sidebar-api-status')?.textContent || 'Unknown'} • Location services require explicit browser permission. Live weather is provided by Open-Meteo.`);
}

function closeDialog() {
  document.getElementById('heatshield-info-dialog')?.remove();
}

async function navigate() {
  const route = getRoute();
  const container = document.getElementById('app-content');
  const renderer = routes[route];
  if (!container) return;

  container.innerHTML = '';
  container.style.animation = 'none';
  container.offsetHeight;
  container.style.animation = 'fadeIn 0.15s ease-out';

  if (renderer) renderer(container);
  updateSidebar(route);
  bindNavigation();
  bindHeaderUtilityButtons();
  await loadLiveRoute(route);
  polishLivePanelHeader();
}

window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', () => {
  ensureHeaderLocationActions();

  const locationSelect = document.getElementById('location-select');
  if (locationSelect && locationSelect.dataset.bound !== 'true') {
    locationSelect.dataset.bound = 'true';
    locationSelect.addEventListener('change', async event => {
      const id = event.target.value;
      if (!id || id === '__external__') return;
      locationSelect.dataset.selected = id;
      await setCurrentLocationId(id);
      polishLivePanelHeader();
    });
  }

  initLocationControls();
  bindNavigation();
  bindHeaderUtilityButtons();
  loadLocations();
  navigate();

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
