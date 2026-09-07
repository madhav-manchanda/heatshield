import { renderDashboard } from './pages/dashboard.js';
import { renderRiskMap } from './pages/risk-map.js';
import { renderInterventions } from './pages/interventions.js';
import { renderFirstResponder } from './pages/first-responder.js';
import { loadLiveRoute } from './live.js';

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

window.triggerToast = function(msg) {
  const toast = document.getElementById('toast');
  const text = document.getElementById('toast-message');
  text.innerText = msg;
  toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3200);
};

window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', navigate);

// Refresh live data without rebuilding the page every five minutes.
setInterval(() => {
  if (document.visibilityState === 'visible') loadLiveRoute(getRoute());
}, 300000);
