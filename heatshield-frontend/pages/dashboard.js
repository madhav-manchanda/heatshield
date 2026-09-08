export function renderDashboard(container) {
  
  
  
  container.innerHTML = `
    <div class="max-w-7xl w-full mx-auto p-space-md">
      <div class="heatshield-page-loading" aria-label="Loading HeatShield dashboard">
        <span class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
        <span>Loading HeatShield command center…</span>
      </div>
    </div>
  `;
}
