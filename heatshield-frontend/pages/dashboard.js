export function renderDashboard(container) {
  // The dashboard shell is rendered by live.js after the backend responds.
  // Keeping this route empty prevents duplicate/stale dashboard content from
  // appearing above the live command center.
  container.innerHTML = `
    <div class="max-w-7xl w-full mx-auto p-space-md">
      <div class="heatshield-page-loading" aria-label="Loading HeatShield dashboard">
        <span class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
        <span>Loading HeatShield command center…</span>
      </div>
    </div>
  `;
}
