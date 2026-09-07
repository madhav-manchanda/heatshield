export function renderDashboard(container) {
  container.innerHTML = `
  <div class="max-w-7xl w-full mx-auto p-space-md flex flex-col gap-space-lg">
    <div class="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-lg">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div>
          <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Current Thermal Classification</span>
          <div class="flex items-center gap-space-xs mt-1" id="dashboard-risk-badge"></div>
        </div>
        <div class="flex items-center gap-space-md" id="dashboard-peak-summary"></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
        <div class="lg:col-span-4 flex flex-col justify-center">
          <div class="flex items-baseline gap-space-xs">
            <span class="font-numeric-metric text-[52px] leading-tight font-bold tracking-tight text-on-surface" id="dashboard-temp">--</span>
            <span class="font-body-md text-body-md text-on-surface-variant font-medium">Ambient</span>
          </div>
          <p class="font-body-md text-body-md text-on-surface-variant mt-1" id="dashboard-feels-like">
            Loading live conditions...
          </p>
          <div class="mt-space-sm flex items-center gap-space-xs" id="dashboard-thermal-load"></div>
        </div>

        <div class="lg:col-span-8 flex flex-col gap-space-xs bg-surface-container-low p-space-md rounded-xl">
          <div class="flex items-center justify-between">
            <span class="font-label-sm text-label-sm font-semibold text-on-surface uppercase tracking-wider">Live Conditions & Risk</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant" id="dashboard-status-label">Loading...</span>
          </div>
          <div class="p-4 rounded-lg bg-surface-container-lowest border border-surface-container-high flex items-center justify-center">
            <div class="flex items-center gap-3 text-on-surface-variant">
              <span class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              <span class="text-sm">Loading live heat risk...</span>
            </div>
          </div>
          <div class="flex justify-between text-on-surface-variant font-label-sm text-label-sm pt-1">
            <span>Temperature</span>
            <span>Humidity</span>
            <span>Wind</span>
            <span>Heat Index</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}
