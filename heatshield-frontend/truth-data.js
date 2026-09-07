const UNAVAILABLE = 'Not published';

function patchRiskComponents(root = document) {
  root.querySelectorAll('*').forEach(element => {
    if (element.children.length > 0) return;
    const label = element.textContent.trim().toLowerCase();
    if (!['exposure', 'vulnerability', 'infrastructure'].includes(label)) return;
    const parent = element.parentElement;
    if (!parent) return;
    const value = parent.querySelector('strong, [data-value], .text-3xl, .text-2xl');
    if (value && value.textContent.trim() === '0') value.textContent = UNAVAILABLE;
  });
}

function patchFacilityCards(root = document) {
  root.querySelectorAll('*').forEach(element => {
    if (element.children.length > 0) return;
    const text = element.textContent.trim();
    if (text === 'VERIFIED_LOCATION_LIVE_STATUS_UNAVAILABLE') {
      element.textContent = 'VERIFIED • LIVE STATUS UNAVAILABLE';
    }
    if (text === '0/0 occupied • 0 available') {
      element.textContent = 'Occupancy not publicly published';
    }
  });
}

function patchUnavailableScenario(root = document) {
  root.querySelectorAll('*').forEach(element => {
    if (element.children.length > 0) return;
    if (element.textContent.trim() !== '0') return;
    const parentText = element.parentElement?.textContent?.toLowerCase() || '';
    if (parentText.includes('projected') || parentText.includes('estimated reduction')) {
      element.textContent = UNAVAILABLE;
    }
  });
}

function applyTruthfulRendering(root = document) {
  patchRiskComponents(root);
  patchFacilityCards(root);
  patchUnavailableScenario(root);
}

const observer = new MutationObserver(() => applyTruthfulRendering(document));

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    applyTruthfulRendering(document);
    observer.observe(document.body, { childList: true, subtree: true });
  }, { once: true });
} else {
  applyTruthfulRendering(document);
  observer.observe(document.body, { childList: true, subtree: true });
}
