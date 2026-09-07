export function renderDashboard(container) {
  container.innerHTML = `
  <!-- Advisory Banner -->
  <div class="px-space-md py-space-sm bg-surface-container border-b border-surface-container-high">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-space-xs">
      <div class="flex items-center gap-space-xs">
        <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary-container/20 text-secondary">
          <span class="material-symbols-outlined text-[18px]">info</span>
        </span>
        <div class="flex flex-wrap items-center gap-x-space-xs gap-y-0.5">
          <span class="font-label-sm text-label-sm font-semibold tracking-wider text-secondary uppercase">Active Advisory</span>
          <span class="text-on-surface-variant text-label-sm">•</span>
          <span class="font-body-md text-body-md text-on-surface">Level 3 Heat Wave alert in effect. Peak thermal stress predicted between 14:00 – 17:00 IST.</span>
          <span class="font-label-sm text-label-sm text-on-surface-variant hidden lg:inline">High humidity compounding wet-bulb risk.</span>
        </div>
      </div>
      <div class="flex items-center gap-space-sm text-on-surface-variant font-label-sm text-label-sm shrink-0">
        <span>Target Area: <strong class="text-on-surface font-medium">Delhi Central & East Sectors</strong></span>
        <span class="inline-block w-1 h-1 rounded-full bg-outline-variant"></span>
        <span>Updated 4 min ago</span>
        <span class="px-space-2xs py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-semibold">REST Mock Stream</span>
      </div>
    </div>
  </div>

  <div class="max-w-7xl w-full mx-auto p-space-md flex flex-col gap-space-lg">
    <!-- Hero Telemetry Panel -->
    <div class="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-lg">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-sm border-b border-surface-container-high">
        <div class="flex flex-col sm:flex-row sm:items-center gap-space-md">
          <div class="flex flex-col">
            <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Current Thermal Classification</span>
            <div class="flex items-center gap-space-xs mt-1">
              <span class="inline-flex items-center gap-1.5 px-space-xs py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-semibold">
                <span class="w-2 h-2 rounded-full bg-secondary"></span>
                CURRENT HEAT RISK: HIGH (Level 3 of 4)
              </span>
              <span class="font-label-sm text-label-sm text-on-surface-variant">Protocol Phase C Active</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-space-md">
          <div class="flex flex-col text-right">
            <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Projected Peak Risk Window</span>
            <span class="font-headline-sm text-headline-sm text-on-surface font-semibold">14:00 — 17:00 IST</span>
          </div>
          <div class="h-8 w-px bg-surface-container-high hidden sm:block"></div>
          <div class="flex items-center gap-space-2xs bg-surface-container-low px-space-xs py-space-2xs rounded-lg">
            <span class="material-symbols-outlined text-primary text-[20px]">timelapse</span>
            <span class="font-label-sm text-label-sm font-medium text-primary">T-minus 1h 45m to crest</span>
          </div>
        </div>
      </div>

      <!-- Core Telemetry -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
        <div class="lg:col-span-4 flex flex-col justify-center">
          <div class="flex items-baseline gap-space-xs">
            <span class="font-numeric-metric text-[52px] leading-tight font-bold tracking-tight text-on-surface">38.4°C</span>
            <span class="font-body-md text-body-md text-on-surface-variant font-medium">Ambient</span>
          </div>
          <p class="font-body-md text-body-md text-on-surface-variant mt-1">
            Feels like <span class="font-medium text-secondary">43.1°C</span> with 61% relative humidity. Elevated risk for outdoor workers & elderly.
          </p>
          <div class="mt-space-sm flex items-center gap-space-xs">
            <span class="font-label-sm text-label-sm text-on-surface-variant">Thermal Stress Load:</span>
            <span class="font-label-md text-label-md font-semibold text-secondary">78 / 100</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant">(Physiological strain: Moderate-High)</span>
          </div>
        </div>

        <!-- Diurnal Thermal Progression -->
        <div class="lg:col-span-8 flex flex-col gap-space-xs bg-surface-container-low p-space-md rounded-xl">
          <div class="flex items-center justify-between">
            <span class="font-label-sm text-label-sm font-semibold text-on-surface uppercase tracking-wider">Diurnal Thermal Progression & Risk Envelope</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant">Now: 12:15 IST</span>
          </div>
          <div class="relative w-full h-9 bg-surface-container-high rounded-lg overflow-hidden flex items-center">
            <div class="h-full bg-surface-container-high w-[25%] flex items-center justify-center text-on-surface-variant font-label-sm text-label-sm border-r border-surface/40">Morning (Mod)</div>
            <div class="h-full bg-secondary-fixed/50 w-[35%] flex items-center justify-center text-on-secondary-fixed font-label-sm text-label-sm font-medium border-r border-surface/40">Pre-Peak (High)</div>
            <div class="h-full bg-secondary/20 w-[25%] flex items-center justify-center text-secondary font-label-sm text-label-sm font-bold border-r border-surface/40">Peak Stress Window (14-17h)</div>
            <div class="h-full bg-surface-container-high w-[15%] flex items-center justify-center text-on-surface-variant font-label-sm text-label-sm">Evening</div>
            <div class="absolute left-[38%] top-0 bottom-0 w-0.5 bg-primary z-10 flex flex-col items-center">
              <span class="w-2.5 h-2.5 rounded-full bg-primary -mt-1 shadow-sm"></span>
            </div>
          </div>
          <div class="flex justify-between text-on-surface-variant font-label-sm text-label-sm pt-1">
            <span>08:00 (31°C)</span>
            <span>11:00 (36°C)</span>
            <span class="font-semibold text-on-surface">14:00 (39.5°C)</span>
            <span>17:00 (38.0°C)</span>
            <span>20:00 (33.2°C)</span>
          </div>
        </div>
      </div>

      <!-- 4-Metric Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm pt-space-xs">
        <div class="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1">
          <div class="flex items-center justify-between text-on-surface-variant">
            <span class="font-label-sm text-label-sm">Ambient Temp</span>
            <span class="material-symbols-outlined text-[18px]">thermostat</span>
          </div>
          <div class="font-numeric-metric text-headline-md text-on-surface font-semibold">38.4°C</div>
          <span class="font-label-sm text-label-sm text-secondary font-medium">+4.2°C above seasonal baseline</span>
        </div>
        <div class="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1">
          <div class="flex items-center justify-between text-on-surface-variant">
            <span class="font-label-sm text-label-sm">Relative Humidity</span>
            <span class="material-symbols-outlined text-[18px]">humidity_percentage</span>
          </div>
          <div class="font-numeric-metric text-headline-md text-on-surface font-semibold">61%</div>
          <span class="font-label-sm text-label-sm text-on-surface-variant">Wet-bulb estimated: <strong class="text-on-surface">29.8°C</strong></span>
        </div>
        <div class="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1">
          <div class="flex items-center justify-between text-on-surface-variant">
            <span class="font-label-sm text-label-sm">Thermal Stress Index</span>
            <span class="material-symbols-outlined text-[18px]">warning</span>
          </div>
          <div class="font-numeric-metric text-headline-md text-secondary font-semibold">78 <span class="text-label-md font-normal text-on-surface-variant">/ 100</span></div>
          <span class="font-label-sm text-label-sm text-secondary font-medium">Elevated heat strain in field</span>
        </div>
        <div class="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1">
          <div class="flex items-center justify-between text-on-surface-variant">
            <span class="font-label-sm text-label-sm">Surface Wind & Airflow</span>
            <span class="material-symbols-outlined text-[18px]">air</span>
          </div>
          <div class="font-numeric-metric text-headline-md text-on-surface font-semibold">11 km/h</div>
          <span class="font-label-sm text-label-sm text-error font-medium">Poor urban canopy ventilation</span>
        </div>
      </div>
    </div>

    <!-- GIS Risk Map & Ward Explainability -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
      <!-- Interactive Risk Map -->
      <div class="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div class="p-space-md border-b border-surface-container-high flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
          <div class="flex items-center gap-space-xs">
            <span class="material-symbols-outlined text-primary text-[22px]">map</span>
            <div>
              <h2 class="font-headline-sm text-headline-sm text-on-surface font-semibold">Hyperlocal Municipal Ward Risk</h2>
              <p class="font-label-sm text-label-sm text-on-surface-variant">Click any sector to inspect multi-factor vulnerability score</p>
            </div>
          </div>
          <div class="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg" id="dashboard-layer-toggles">
            <button class="layer-btn px-2.5 py-1 rounded font-label-sm text-label-sm bg-surface-container-lowest text-on-surface font-semibold shadow-xs transition-colors">Composite</button>
            <button class="layer-btn px-2.5 py-1 rounded font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors">Thermal</button>
            <button class="layer-btn px-2.5 py-1 rounded font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors">Vulnerability</button>
            <button class="layer-btn px-2.5 py-1 rounded font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors">Cooling</button>
          </div>
        </div>

        <!-- SVG Map -->
        <div class="relative w-full h-[400px] bg-surface-container-low overflow-hidden">
          <svg class="w-full h-full object-cover select-none" viewBox="0 0 700 400">
            <defs>
              <pattern id="urbanGrid" patternUnits="userSpaceOnUse" width="20" height="20">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#d9dad8" stroke-width="0.75"></path>
              </pattern>
            </defs>
            <rect fill="url(#urbanGrid)" width="700" height="400"></rect>
            <!-- Yamuna River -->
            <path d="M 520 -10 C 510 80, 480 160, 490 230 C 500 300, 470 360, 460 410" fill="none" opacity="0.6" stroke="#9df1f3" stroke-linecap="round" stroke-width="16"></path>
            <path d="M 520 -10 C 510 80, 480 160, 490 230 C 500 300, 470 360, 460 410" fill="none" opacity="0.3" stroke="#005a5c" stroke-dasharray="4,4" stroke-width="2"></path>
            <!-- Ward 14 -->
            <polygon class="cursor-pointer transition-all duration-200 hover:fill-opacity-50" fill="#fe932c" fill-opacity="0.35" points="260,40 450,30 460,130 310,145 250,110"></polygon>
            <text fill="#191c1b" font-family="Inter" font-size="11" font-weight="600" x="340" y="85">Ward 14 • Civil Lines</text>
            <text fill="#3e4949" font-family="Inter" font-size="10" x="340" y="102">Score 58 (Moderate)</text>
            <!-- Ward 37 (Selected) -->
            <polygon class="cursor-pointer transition-all duration-200 hover:fill-opacity-70" fill="#904d00" fill-opacity="0.6" points="310,145 470,130 460,250 350,265 290,220" stroke="#005a5c" stroke-width="3"></polygon>
            <text fill="#ffffff" font-family="Inter" font-size="12" font-weight="700" x="335" y="195">Ward 37 (Selected)</text>
            <text fill="#ffdcc3" font-family="Inter" font-size="10" font-weight="500" x="335" y="212">Score 82 • HIGH RISK</text>
            <!-- Ward 21 -->
            <polygon class="cursor-pointer transition-all duration-200 hover:fill-opacity-65" fill="#fe932c" fill-opacity="0.5" points="130,120 280,120 290,240 180,270 110,210"></polygon>
            <text fill="#191c1b" font-family="Inter" font-size="11" font-weight="600" x="160" y="180">Ward 21 • Karol Bagh</text>
            <text fill="#3e4949" font-family="Inter" font-size="10" x="160" y="197">Score 76 (High)</text>
            <!-- Ward 08 -->
            <polygon class="cursor-pointer transition-all duration-200 hover:fill-opacity-40" fill="#205854" fill-opacity="0.25" points="150,275 350,270 380,380 190,385 130,340"></polygon>
            <text fill="#191c1b" font-family="Inter" font-size="11" font-weight="600" x="210" y="325">Ward 08 • Chanakyapuri</text>
            <text fill="#3e4949" font-family="Inter" font-size="10" x="210" y="342">Score 34 (Low • Green Canopy 42%)</text>
            <!-- Ward 42 -->
            <polygon class="cursor-pointer transition-all duration-200 hover:fill-opacity-55" fill="#ba1a1a" fill-opacity="0.4" points="510,100 660,110 650,240 520,230"></polygon>
            <text fill="#ffffff" font-family="Inter" font-size="11" font-weight="600" x="540" y="165">Ward 42 • Shahdara</text>
            <text fill="#ffdad6" font-family="Inter" font-size="10" x="540" y="182">Score 86 (Severe)</text>
            <!-- Cooling Hub Markers -->
            <g class="cursor-pointer" transform="translate(410, 170)"><circle fill="#005a5c" fill-opacity="0.2" r="12"></circle><circle fill="#005a5c" r="6"></circle><circle fill="#ffffff" r="2.5"></circle></g>
            <g class="cursor-pointer" transform="translate(370, 75)"><circle fill="#005a5c" fill-opacity="0.2" r="12"></circle><circle fill="#005a5c" r="6"></circle><circle fill="#ffffff" r="2.5"></circle></g>
            <g class="cursor-pointer" transform="translate(230, 210)"><circle fill="#005a5c" fill-opacity="0.2" r="12"></circle><circle fill="#005a5c" r="6"></circle><circle fill="#ffffff" r="2.5"></circle></g>
          </svg>
          <!-- Map Controls -->
          <div class="absolute top-space-xs right-space-xs flex flex-col gap-1">
            <button class="w-8 h-8 rounded bg-surface-container-lowest shadow-sm flex items-center justify-center text-on-surface hover:bg-surface-container"><span class="material-symbols-outlined text-[18px]">add</span></button>
            <button class="w-8 h-8 rounded bg-surface-container-lowest shadow-sm flex items-center justify-center text-on-surface hover:bg-surface-container"><span class="material-symbols-outlined text-[18px]">remove</span></button>
            <button class="w-8 h-8 rounded bg-surface-container-lowest shadow-sm flex items-center justify-center text-on-surface hover:bg-surface-container"><span class="material-symbols-outlined text-[18px]">navigation</span></button>
          </div>
          <div class="absolute bottom-space-xs left-space-xs bg-surface-container-lowest/90 backdrop-blur-sm px-space-xs py-1 rounded-lg text-on-surface font-label-sm text-label-sm shadow-xs flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>Focus: <strong>Ward 37 (Central Delhi)</strong></span>
          </div>
        </div>
        <!-- Risk Legend -->
        <div class="p-space-sm bg-surface-container-lowest border-t border-surface-container-high flex flex-wrap items-center justify-between gap-space-xs">
          <div class="flex items-center gap-space-md flex-wrap font-label-sm text-label-sm">
            <span class="text-on-surface-variant font-medium">Risk Index Legend:</span>
            <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-tertiary-container"></span><span class="text-on-surface">Low (0–40)</span></div>
            <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-secondary-container"></span><span class="text-on-surface">Moderate (41–65)</span></div>
            <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-secondary"></span><span class="text-on-surface">High (66–84)</span></div>
            <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-error"></span><span class="text-on-surface">Severe (85–100)</span></div>
          </div>
          <div class="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
            <span class="w-2.5 h-2.5 rounded-full bg-primary"></span><span>Cooling Center Kiosk</span>
          </div>
        </div>
      </div>

      <!-- Ward Explainability Panel -->
      <div class="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col gap-space-md">
        <div class="flex items-start justify-between gap-space-xs pb-space-xs border-b border-surface-container-high">
          <div>
            <div class="flex items-center gap-1.5 text-primary font-label-sm text-label-sm font-semibold uppercase tracking-wider">
              <span class="material-symbols-outlined text-[16px]">pin_drop</span>
              <span>1. Location In Focus (WHERE)</span>
            </div>
            <h3 class="font-headline-sm text-headline-sm font-semibold text-on-surface mt-0.5">Ward 37 — Kashmere Gate / Chandni Chowk</h3>
            <span class="font-label-sm text-label-sm text-on-surface-variant">Zone 03 • High Density Mixed Commercial-Residential</span>
          </div>
          <div class="flex flex-col items-end">
            <span class="px-space-xs py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">82 • HIGH RISK</span>
          </div>
        </div>

        <!-- Contributing Drivers -->
        <div class="flex flex-col gap-space-xs">
          <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">2. Contributing Drivers (WHY & WHO)</span>
          <div class="p-space-xs bg-surface-container-low rounded-lg flex flex-col gap-1">
            <div class="flex justify-between items-center text-on-surface font-label-sm text-label-sm"><span class="font-medium">Thermal Stress (Micro-climate)</span><span class="font-semibold text-secondary">82 / 100</span></div>
            <div class="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden"><div class="h-full bg-secondary rounded-full" style="width: 82%;"></div></div>
            <span class="font-body-sm text-body-sm text-on-surface-variant">Dense concrete envelope, narrow alleys, surface albedo <0.18</span>
          </div>
          <div class="p-space-xs bg-surface-container-low rounded-lg flex flex-col gap-1">
            <div class="flex justify-between items-center text-on-surface font-label-sm text-label-sm"><span class="font-medium">Population Exposure Rate</span><span class="font-semibold text-secondary">74 / 100</span></div>
            <div class="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden"><div class="h-full bg-secondary rounded-full" style="width: 74%;"></div></div>
            <span class="font-body-sm text-body-sm text-on-surface-variant">Extremely high pedestrian density: 34,200/km², transit nodes active</span>
          </div>
          <div class="p-space-xs bg-surface-container-low rounded-lg flex flex-col gap-1">
            <div class="flex justify-between items-center text-on-surface font-label-sm text-label-sm"><span class="font-medium">Vulnerability Index (Demographics)</span><span class="font-semibold text-secondary">68 / 100</span></div>
            <div class="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden"><div class="h-full bg-secondary rounded-full" style="width: 68%;"></div></div>
            <span class="font-body-sm text-body-sm text-on-surface-variant">Elderly (>65) at 14.8%, high count of informal street vendors</span>
          </div>
          <div class="p-space-xs bg-surface-container-low rounded-lg flex flex-col gap-1">
            <div class="flex justify-between items-center text-on-surface font-label-sm text-label-sm"><span class="font-medium">Cooling & Hydration Access Deficit</span><span class="font-semibold text-error">32 / 100 (Severe Deficit)</span></div>
            <div class="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden"><div class="h-full bg-error rounded-full" style="width: 32%;"></div></div>
            <span class="font-body-sm text-body-sm text-on-surface-variant">Only 1 active public cooling center within 1.5 km transit radius</span>
          </div>
        </div>

        <!-- Risk Synthesis -->
        <div class="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-space-2xs">
          <div class="flex items-center gap-1.5 text-on-surface font-label-sm text-label-sm font-semibold">
            <span class="material-symbols-outlined text-primary text-[18px]">psychology</span>
            <span>3. Risk Synthesis & Decision Rationale</span>
          </div>
          <p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Why is Ward 37 critical right now? Compound hazard: Narrow masonry corridors trap outgoing longwave radiation, while high concentration of outdoor daily-wage laborers coincide with a 68% hydration shelter deficit.
          </p>
        </div>

        <!-- Operational Actions -->
        <div class="pt-space-2xs flex flex-col gap-space-xs">
          <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">4. Immediate Operational Actions (WHAT)</span>
          <div class="flex flex-col sm:flex-row gap-space-xs">
            <button class="flex-1 px-space-sm py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 shadow-sm">
              <span class="material-symbols-outlined text-[18px]">water_drop</span><span>Deploy Mobile Mist Kiosk</span>
            </button>
            <button class="px-space-sm py-2 rounded-lg bg-surface-container-highest text-on-surface font-label-md text-label-md font-medium hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5">
              <span class="material-symbols-outlined text-[18px]">broadcast_on_personal</span><span>SMS Cell Broadcast</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 5-Day Forecast -->
    <div class="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
        <div>
          <h2 class="font-headline-sm text-headline-sm text-on-surface font-semibold">5-Day Heat Risk & Wet-Bulb Stress Outlook</h2>
          <p class="font-label-sm text-label-sm text-on-surface-variant">Multi-model ensemble forecast calibrated against IMD weather radar</p>
        </div>
        <div class="flex items-center gap-space-sm text-on-surface-variant font-label-sm text-label-sm">
          <span class="flex items-center gap-1"><span class="w-2.5 h-0.5 bg-primary rounded"></span> WBGT Curve (°C)</span>
          <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-secondary-fixed"></span> Heat Stress Load</span>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-space-sm">
        <div class="bg-surface-container-low p-space-sm rounded-xl flex flex-col justify-between gap-space-xs">
          <div class="flex items-center justify-between"><span class="font-label-md text-label-md font-semibold text-on-surface">Mon (Today)</span><span class="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">High</span></div>
          <div class="my-space-xs"><span class="font-numeric-metric text-headline-lg font-bold text-on-surface">38.4°C</span><div class="font-label-sm text-label-sm text-on-surface-variant">Stress: <strong class="text-secondary font-semibold">78/100</strong></div></div>
          <div class="font-body-sm text-body-sm text-on-surface-variant">Peak: 14:00–17:00 • Heavy humidity</div>
        </div>
        <div class="bg-surface-container-low p-space-sm rounded-xl flex flex-col justify-between gap-space-xs">
          <div class="flex items-center justify-between"><span class="font-label-md text-label-md font-semibold text-on-surface">Tue (Tomorrow)</span><span class="px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold">Severe</span></div>
          <div class="my-space-xs"><span class="font-numeric-metric text-headline-lg font-bold text-on-surface">40.2°C</span><div class="font-label-sm text-label-sm text-on-surface-variant">Stress: <strong class="text-error font-semibold">88/100</strong></div></div>
          <div class="font-body-sm text-body-sm text-on-surface-variant">Extended advisory from 12:00</div>
        </div>
        <div class="bg-surface-container-low p-space-sm rounded-xl flex flex-col justify-between gap-space-xs">
          <div class="flex items-center justify-between"><span class="font-label-md text-label-md font-semibold text-on-surface">Wednesday</span><span class="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">High</span></div>
          <div class="my-space-xs"><span class="font-numeric-metric text-headline-lg font-bold text-on-surface">39.1°C</span><div class="font-label-sm text-label-sm text-on-surface-variant">Stress: <strong class="text-secondary font-semibold">79/100</strong></div></div>
          <div class="font-body-sm text-body-sm text-on-surface-variant">Breezy westerly dry winds</div>
        </div>
        <div class="bg-surface-container-low p-space-sm rounded-xl flex flex-col justify-between gap-space-xs">
          <div class="flex items-center justify-between"><span class="font-label-md text-label-md font-semibold text-on-surface">Thursday</span><span class="px-2 py-0.5 rounded-full bg-secondary-container/30 text-on-surface font-label-sm text-label-sm font-medium">Moderate</span></div>
          <div class="my-space-xs"><span class="font-numeric-metric text-headline-lg font-bold text-on-surface">36.5°C</span><div class="font-label-sm text-label-sm text-on-surface-variant">Stress: <strong class="text-on-surface font-semibold">65/100</strong></div></div>
          <div class="font-body-sm text-body-sm text-on-surface-variant">Slight cloud cover relief</div>
        </div>
        <div class="bg-surface-container-low p-space-sm rounded-xl flex flex-col justify-between gap-space-xs col-span-2 sm:col-span-1">
          <div class="flex items-center justify-between"><span class="font-label-md text-label-md font-semibold text-on-surface">Friday</span><span class="px-2 py-0.5 rounded-full bg-tertiary-container/30 text-tertiary font-label-sm text-label-sm font-medium">Normal</span></div>
          <div class="my-space-xs"><span class="font-numeric-metric text-headline-lg font-bold text-on-surface">34.8°C</span><div class="font-label-sm text-label-sm text-on-surface-variant">Stress: <strong class="text-tertiary font-semibold">52/100</strong></div></div>
          <div class="font-body-sm text-body-sm text-on-surface-variant">Pre-monsoon wind shift</div>
        </div>
      </div>

      <!-- WBGT Trend Chart -->
      <div class="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-xs">
        <div class="flex items-center justify-between">
          <span class="font-label-sm text-label-sm font-semibold text-on-surface">Projected 5-Day Wet-Bulb Globe Temperature (WBGT) Threshold Index</span>
          <span class="font-label-sm text-label-sm text-error font-medium">Critical Danger Threshold: 31.0°C WBGT</span>
        </div>
        <div class="w-full h-28 relative">
          <svg class="w-full h-full overflow-visible" viewBox="0 0 800 110">
            <defs><linearGradient id="wbgtGrad" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#0d7477" stop-opacity="0.3"></stop><stop offset="100%" stop-color="#0d7477" stop-opacity="0.0"></stop></linearGradient></defs>
            <line opacity="0.6" stroke="#ba1a1a" stroke-dasharray="4,4" stroke-width="1.5" x1="0" x2="800" y1="30" y2="30"></line>
            <text fill="#ba1a1a" font-family="Inter" font-size="10" font-weight="600" x="730" y="24">31°C Warning</text>
            <line opacity="0.4" stroke="#6e7979" stroke-dasharray="2,2" stroke-width="1" x1="0" x2="800" y1="75" y2="75"></line>
            <text fill="#6e7979" font-family="Inter" font-size="10" x="735" y="70">28°C Caution</text>
            <path d="M 80 48 Q 240 18, 400 36 T 720 90 L 720 110 L 80 110 Z" fill="url(#wbgtGrad)"></path>
            <path d="M 80 48 Q 240 18, 400 36 T 720 90" fill="none" stroke="#005a5c" stroke-linecap="round" stroke-width="3"></path>
            <g transform="translate(80, 48)"><circle fill="#005a5c" r="4"></circle><text fill="#191c1b" font-family="Inter" font-size="11" font-weight="600" text-anchor="middle" y="-10">29.8°C</text></g>
            <g transform="translate(240, 22)"><circle fill="#ba1a1a" r="5"></circle><text fill="#ba1a1a" font-family="Inter" font-size="11" font-weight="700" text-anchor="middle" y="-10">31.4°C (Exceeds limit)</text></g>
            <g transform="translate(400, 36)"><circle fill="#904d00" r="4"></circle><text fill="#191c1b" font-family="Inter" font-size="11" font-weight="600" text-anchor="middle" y="-10">30.2°C</text></g>
            <g transform="translate(560, 68)"><circle fill="#005a5c" r="4"></circle><text fill="#191c1b" font-family="Inter" font-size="11" font-weight="600" text-anchor="middle" y="-10">28.4°C</text></g>
            <g transform="translate(720, 90)"><circle fill="#205854" r="4"></circle><text fill="#191c1b" font-family="Inter" font-size="11" font-weight="600" text-anchor="middle" y="-10">26.9°C</text></g>
          </svg>
        </div>
      </div>
    </div>

    <!-- Cooling Facilities -->
    <div class="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
        <div>
          <h2 class="font-headline-sm text-headline-sm text-on-surface font-semibold">Active Cooling Facilities & Hydration Depots</h2>
          <p class="font-label-sm text-label-sm text-on-surface-variant">Live telemetry from operational shelters within 3 km of Ward 37</p>
        </div>
        <button class="self-start sm:self-center px-space-sm py-1.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md font-medium hover:bg-surface-container-highest transition-colors flex items-center gap-1">
          <span class="material-symbols-outlined text-[18px]">add_location_alt</span><span>Dispatch Mobile Hub</span>
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <!-- Facility 1 -->
        <div class="bg-surface-container-low p-space-md rounded-xl flex flex-col justify-between gap-space-sm">
          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between"><span class="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-semibold">Operational • 80% Full</span><span class="font-label-sm text-label-sm text-on-surface-variant">1.1 km away</span></div>
            <h4 class="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">Red Cross Civic Cooling Hub A</h4>
            <p class="font-body-sm text-body-sm text-on-surface-variant">Opposite Old Delhi Railway Junction, Gate 4</p>
          </div>
          <div class="flex flex-col gap-space-2xs">
            <div class="flex justify-between items-center font-label-sm text-label-sm"><span class="text-on-surface-variant">Capacity Load</span><span class="font-medium text-on-surface">120 / 150 Persons</span></div>
            <div class="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden"><div class="h-full bg-primary-container rounded-full" style="width: 80%;"></div></div>
          </div>
          <div class="pt-space-2xs border-t border-surface-container-high/60 flex items-center justify-between">
            <div class="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
              <span class="flex items-center gap-0.5"><span class="material-symbols-outlined text-[16px] text-primary">water_drop</span> Misting</span>
              <span class="flex items-center gap-0.5"><span class="material-symbols-outlined text-[16px] text-primary">medical_services</span> First Aid</span>
            </div>
            <button class="font-label-sm text-label-sm text-primary font-semibold hover:underline">Manage</button>
          </div>
        </div>
        <!-- Facility 2 -->
        <div class="bg-surface-container-low p-space-md rounded-xl flex flex-col justify-between gap-space-sm">
          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between"><span class="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">Full • 100% Load</span><span class="font-label-sm text-label-sm text-on-surface-variant">2.1 km away</span></div>
            <h4 class="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">Municipal Community Center B</h4>
            <p class="font-body-sm text-body-sm text-on-surface-variant">Pahar Ganj Marg, Ward 21 Perimeter</p>
          </div>
          <div class="flex flex-col gap-space-2xs">
            <div class="flex justify-between items-center font-label-sm text-label-sm"><span class="text-on-surface-variant">Capacity Load</span><span class="font-medium text-secondary">200 / 200 (Rerouting Active)</span></div>
            <div class="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden"><div class="h-full bg-secondary rounded-full" style="width: 100%;"></div></div>
          </div>
          <div class="pt-space-2xs border-t border-surface-container-high/60 flex items-center justify-between">
            <span class="font-label-sm text-label-sm text-secondary font-medium flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">directions</span> Diverting to Hub A</span>
            <button class="font-label-sm text-label-sm text-primary font-semibold hover:underline">Reroute</button>
          </div>
        </div>
        <!-- Facility 3 -->
        <div class="bg-surface-container-low p-space-md rounded-xl flex flex-col justify-between gap-space-sm">
          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between"><span class="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-semibold">Available • 45%</span><span class="font-label-sm text-label-sm text-on-surface-variant">2.8 km away</span></div>
            <h4 class="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">St. Stephen's Shade Shelter</h4>
            <p class="font-body-sm text-body-sm text-on-surface-variant">Tis Hazari Court Road East</p>
          </div>
          <div class="flex flex-col gap-space-2xs">
            <div class="flex justify-between items-center font-label-sm text-label-sm"><span class="text-on-surface-variant">Capacity Load</span><span class="font-medium text-on-surface">45 / 100 Persons</span></div>
            <div class="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden"><div class="h-full bg-primary-container rounded-full" style="width: 45%;"></div></div>
          </div>
          <div class="pt-space-2xs border-t border-surface-container-high/60 flex items-center justify-between">
            <div class="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
              <span class="flex items-center gap-0.5"><span class="material-symbols-outlined text-[16px] text-primary">local_drink</span> ORS Stock High</span>
              <span class="flex items-center gap-0.5"><span class="material-symbols-outlined text-[16px] text-primary">ac_unit</span> Shaded</span>
            </div>
            <button class="font-label-sm text-label-sm text-primary font-semibold hover:underline">Manage</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  // Layer toggle interactivity
  const layerToggles = container.querySelector('#dashboard-layer-toggles');
  if (layerToggles) {
    layerToggles.querySelectorAll('.layer-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        layerToggles.querySelectorAll('.layer-btn').forEach(b => {
          b.className = 'layer-btn px-2.5 py-1 rounded font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors';
        });
        btn.className = 'layer-btn px-2.5 py-1 rounded font-label-sm text-label-sm bg-surface-container-lowest text-on-surface font-semibold shadow-xs transition-colors';
      });
    });
  }
}
