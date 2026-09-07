export function renderRiskMap(container) {
  container.innerHTML = `
  <div class="px-space-md py-space-lg flex flex-col gap-space-lg max-w-7xl mx-auto w-full">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
      <div>
        <div class="flex items-center gap-space-2xs text-primary font-label-sm uppercase tracking-widest"><span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span><span>PostGIS Spatial Grid</span></div>
        <h1 class="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">Risk Map — Grid-Level Heat Risk</h1>
        <p class="font-body-md text-body-md text-on-surface-variant">Live spatial grid from the backend PostGIS system. Click any cell to inspect drivers and synchronized history.</p>
      </div>
    </div>

    <div class="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high overflow-hidden">
      <div class="p-space-md border-b border-surface-container-high flex items-center justify-between">
        <div>
          <div class="font-headline-sm text-headline-sm font-semibold text-on-surface">Spatial Grid</div>
          <div class="font-label-sm text-label-sm text-on-surface-variant mt-1">Loading grid from backend...</div>
        </div>
      </div>
      <div class="p-space-lg flex items-center justify-center">
        <div class="flex items-center gap-3 text-on-surface-variant">
          <span class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
          <span class="text-sm">Loading live heat risk...</span>
        </div>
      </div>
    </div>
  </div>
  `;
}
