export function renderRiskMap(container) {
  container.innerHTML = `
  <!-- Map Workspace Header & Controls -->
  <div class="px-space-md py-space-sm bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm z-30">
    <div class="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-space-sm">
      <div class="flex items-center gap-space-xs flex-1 max-w-2xl">
        <div class="relative flex-1">
          <span class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]">search</span>
          <input class="w-full pl-10 pr-10 py-2 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container shadow-inner transition-colors" placeholder="Search by Ward, Sector, or Pincode..." type="text" value="Ward 37 - Chandni Chowk / Old Delhi Central" />
          <button class="absolute right-3 top-2.5 text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined text-[18px]">tune</span></button>
        </div>
        <div class="hidden sm:flex items-center gap-space-2xs bg-surface-container-low px-space-sm py-2 rounded-xl">
          <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Zone:</span>
          <span class="font-label-md text-label-md font-semibold text-primary">City-Sadar Paharganj</span>
        </div>
      </div>
      <div class="flex items-center bg-surface-container p-1 rounded-xl shadow-inner gap-1" id="time-horizon-scrubber">
        <button class="time-step-btn active px-space-sm py-1.5 rounded-lg bg-surface-container-lowest text-primary font-label-sm text-label-sm font-semibold shadow-sm transition-all flex items-center gap-1.5" data-time="live">
          <span class="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>Live Current
        </button>
        <button class="time-step-btn px-space-sm py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-all" data-time="+2h">+2 Hours</button>
        <button class="time-step-btn px-space-sm py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-all" data-time="+4h">+4 Hours (Peak 15:00)</button>
        <button class="time-step-btn px-space-sm py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-all" data-time="tomorrow">Tomorrow</button>
      </div>
      <div class="hidden lg:flex items-center gap-space-xs">
        <button class="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" title="Export GeoJSON"><span class="material-symbols-outlined text-[20px]">file_download</span></button>
        <button class="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" title="Split Compare"><span class="material-symbols-outlined text-[20px]">view_column</span></button>
        <button class="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" title="Fullscreen"><span class="material-symbols-outlined text-[20px]">fullscreen</span></button>
      </div>
    </div>
    <!-- Layer Chips -->
    <div class="flex items-center gap-space-xs overflow-x-auto pb-1" id="layer-chips">
      <span class="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase shrink-0">Map Layers:</span>
      <button class="layer-chip active px-space-sm py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm flex items-center gap-1.5 shadow-sm transition-all"><span class="w-1.5 h-1.5 rounded-full bg-primary-fixed"></span>Composite Heat Risk</button>
      <button class="layer-chip px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-label-sm text-label-sm flex items-center gap-1.5 transition-all"><span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>Land Surface Temp (LST)</button>
      <button class="layer-chip px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-label-sm text-label-sm flex items-center gap-1.5 transition-all"><span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span>Wet-Bulb Stress</button>
      <button class="layer-chip px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-label-sm text-label-sm flex items-center gap-1.5 transition-all"><span class="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>Vulnerability Index (Socio-Econ & Age)</button>
      <button class="layer-chip px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-label-sm text-label-sm flex items-center gap-1.5 transition-all"><span class="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim"></span>Infrastructure & Water ATMs (28)</button>
      <button class="layer-chip px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-label-sm text-label-sm flex items-center gap-1.5 transition-all"><span class="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>Cooling Centers (12 Active)</button>
    </div>
  </div>

  <!-- Map Canvas & Side Panel -->
  <div class="relative w-full h-[calc(100vh-12rem)] flex overflow-hidden bg-surface-container-high">
    <!-- Vector Map -->
    <div class="relative flex-1 h-full w-full bg-[#eef1ed] overflow-hidden select-none cursor-grab active:cursor-grabbing">
      <svg class="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="gis-grid" patternUnits="userSpaceOnUse" width="80" height="80"><path d="M 80 0 L 0 0 0 80" fill="none" stroke="#d5dbd5" stroke-dasharray="2,4" stroke-width="0.75"></path></pattern>
          <linearGradient id="yamunaRiver" x1="0%" x2="100%" y1="0%" y2="100%"><stop offset="0%" stop-color="#b8e2e4" stop-opacity="0.7"></stop><stop offset="100%" stop-color="#9bd0d3" stop-opacity="0.5"></stop></linearGradient>
          <filter id="focus-glow" width="140%" height="140%" x="-20%" y="-20%"><feDropShadow dx="0" dy="4" flood-color="#005a5c" flood-opacity="0.3" stdDeviation="6"></feDropShadow></filter>
        </defs>
        <rect fill="url(#gis-grid)" width="100%" height="100%"></rect>
        <path d="M 940 -20 C 880 120, 850 240, 810 380 C 780 500, 790 620, 820 740 C 840 820, 890 920, 930 1060" fill="none" stroke="url(#yamunaRiver)" stroke-linecap="round" stroke-width="48"></path>
        <text fill="#005a5c" font-family="Inter" font-size="11" font-weight="600" letter-spacing="0.2em" opacity="0.4" transform="rotate(76 830 280)" x="830" y="280">YAMUNA WATER CORRIDOR</text>
        <path d="M 50 340 L 420 370 L 610 395 L 820 380 L 1100 410" fill="none" opacity="0.9" stroke="#ffffff" stroke-width="6"></path>
        <path d="M 50 340 L 420 370 L 610 395 L 820 380 L 1100 410" fill="none" stroke="#bac2ba" stroke-dasharray="6,4" stroke-width="2"></path>
        <path d="M 320 80 C 450 180, 540 320, 550 560 C 555 690, 480 820, 360 920" fill="none" opacity="0.8" stroke="#ffffff" stroke-width="5"></path>
      </svg>
      <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <g>
          <polygon class="transition-all duration-300 cursor-pointer fill-[#a8dab5]/40 hover:fill-[#a8dab5]/70 stroke-[#5e966e] stroke-[1.5]" points="380,80 510,95 560,190 490,260 370,220 340,140"></polygon>
          <text fill="#205854" font-family="Geist" font-size="12" font-weight="600" x="430" y="170">Ward 04</text>
          <text fill="#3e4949" font-family="Inter" font-size="10" x="430" y="185">Risk: 31 • Low</text>
          <polygon class="transition-all duration-300 cursor-pointer fill-[#fed976]/45 hover:fill-[#fed976]/75 stroke-[#d49e24] stroke-[1.5]" points="370,220 490,260 520,360 410,380 320,330"></polygon>
          <text fill="#663500" font-family="Geist" font-size="12" font-weight="600" x="410" y="300">Ward 14</text>
          <text fill="#3e4949" font-family="Inter" font-size="10" x="410" y="315">Risk: 58 • Mod</text>
          <polygon class="transition-all duration-300 cursor-pointer fill-[#fd8d3c]/50 hover:fill-[#fd8d3c]/75 stroke-[#d95f02] stroke-[1.5]" points="490,260 620,230 730,280 690,390 520,360"></polygon>
          <text fill="#904d00" font-family="Geist" font-size="12" font-weight="600" x="590" y="310">Ward 21</text>
          <text fill="#3e4949" font-family="Inter" font-size="10" x="590" y="325">Risk: 76 • High</text>
          <polygon class="transition-all duration-300 cursor-pointer fill-[#bd0026]/55 stroke-[#ba1a1a] stroke-[2.5]" points="520,360 690,390 710,510 590,560 480,480 470,390" filter="url(#focus-glow)"></polygon>
          <circle class="animate-spin" cx="595" cy="455" fill="none" r="32" stroke="#ba1a1a" stroke-dasharray="4,3" stroke-width="1.5" style="animation-duration: 24s;"></circle>
          <text fill="#ffffff" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))" font-family="Geist" font-size="14" font-weight="700" x="560" y="445">Ward 37</text>
          <text fill="#ffffff" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))" font-family="Inter" font-size="11" font-weight="600" x="548" y="465">Risk 82 • CRITICAL</text>
          <polygon class="transition-all duration-300 cursor-pointer fill-[#fd8d3c]/50 hover:fill-[#fd8d3c]/75 stroke-[#d95f02] stroke-[1.5]" points="590,560 710,510 770,620 680,710 570,670"></polygon>
          <text fill="#904d00" font-family="Geist" font-size="12" font-weight="600" x="650" y="615">Ward 52</text>
          <text fill="#3e4949" font-family="Inter" font-size="10" x="650" y="630">Risk: 79 • High</text>
          <polygon class="transition-all duration-300 cursor-pointer fill-[#fed976]/45 hover:fill-[#fed976]/75 stroke-[#d49e24] stroke-[1.5]" points="390,520 480,480 570,670 480,760 360,680"></polygon>
          <text fill="#663500" font-family="Geist" font-size="12" font-weight="600" x="440" y="615">Ward 68</text>
          <text fill="#3e4949" font-family="Inter" font-size="10" x="440" y="630">Risk: 49 • Mod</text>
          <polygon class="transition-all duration-300 cursor-pointer fill-[#feb24c]/50 hover:fill-[#feb24c]/75 stroke-[#d95f02] stroke-[1.5]" points="230,360 320,330 410,380 390,520 260,510"></polygon>
          <text fill="#904d00" font-family="Geist" font-size="12" font-weight="600" x="300" y="435">Ward 12</text>
          <text fill="#3e4949" font-family="Inter" font-size="10" x="300" y="450">Risk: 64 • Mod-High</text>
          <polygon class="transition-all duration-300 cursor-pointer fill-[#a8dab5]/45 hover:fill-[#a8dab5]/75 stroke-[#5e966e] stroke-[1.5]" points="810,380 940,320 990,470 870,550 820,470"></polygon>
          <text fill="#205854" font-family="Geist" font-size="12" font-weight="600" x="880" y="440">Ward 89</text>
          <text fill="#3e4949" font-family="Inter" font-size="10" x="880" y="455">Risk: 24 • Low</text>
        </g>
      </svg>
      <!-- Facility Pins -->
      <div class="absolute top-[48%] left-[49%] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20">
        <div class="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-md ring-2 ring-surface-container-lowest hover:scale-110 transition-transform"><span class="material-symbols-outlined text-[18px]">ac_unit</span></div>
        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col bg-inverse-surface text-inverse-on-surface px-2.5 py-1.5 rounded-lg shadow-xl text-xs whitespace-nowrap z-50"><span class="font-semibold">Town Hall Cooling Center</span><span class="text-inverse-primary">Status: Open • 28 beds left</span></div>
      </div>
      <div class="absolute top-[43%] left-[46%] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20">
        <div class="w-7 h-7 rounded-full bg-[#0284c7] text-white flex items-center justify-center shadow-md ring-2 ring-surface-container-lowest hover:scale-110 transition-transform"><span class="material-symbols-outlined text-[16px]">water_drop</span></div>
        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col bg-inverse-surface text-inverse-on-surface px-2.5 py-1.5 rounded-lg shadow-xl text-xs whitespace-nowrap z-50"><span class="font-semibold">Water ATM #09 - Metro Gate 3</span><span class="text-[#38bdf8]">Output: 480L / hr • Functional</span></div>
      </div>
      <div class="absolute top-[54%] left-[43%] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20">
        <div class="w-7 h-7 rounded-full bg-[#dc2626] text-white flex items-center justify-center shadow-md ring-2 ring-surface-container-lowest hover:scale-110 transition-transform animate-bounce"><span class="material-symbols-outlined text-[16px]">emergency</span></div>
        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col bg-inverse-surface text-inverse-on-surface px-2.5 py-1.5 rounded-lg shadow-xl text-xs whitespace-nowrap z-50"><span class="font-semibold">Rapid Response Van 04</span><span class="text-rose-200">On Patrol: Fatehpuri Sector</span></div>
      </div>
      <div class="absolute top-[36%] left-[54%] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20">
        <div class="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-md ring-2 ring-surface-container-lowest hover:scale-110 transition-transform"><span class="material-symbols-outlined text-[18px]">ac_unit</span></div>
      </div>
      <div class="absolute top-[34%] left-[37%] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20">
        <div class="w-7 h-7 rounded-full bg-[#0284c7] text-white flex items-center justify-center shadow-md ring-2 ring-surface-container-lowest hover:scale-110 transition-transform"><span class="material-symbols-outlined text-[16px]">water_drop</span></div>
      </div>
      <div class="absolute top-[68%] left-[59%] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20">
        <div class="w-7 h-7 rounded-full bg-[#0284c7] text-white flex items-center justify-center shadow-md ring-2 ring-surface-container-lowest hover:scale-110 transition-transform"><span class="material-symbols-outlined text-[16px]">water_drop</span></div>
      </div>
      <!-- Floating Controls -->
      <div class="absolute top-4 left-4 flex flex-col gap-2 z-30">
        <div class="bg-surface-container-lowest rounded-xl shadow-md p-1 flex flex-col">
          <button class="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors rounded-lg"><span class="material-symbols-outlined text-[20px]">add</span></button>
          <div class="h-px bg-surface-container w-full"></div>
          <button class="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors rounded-lg"><span class="material-symbols-outlined text-[20px]">remove</span></button>
          <div class="h-px bg-surface-container w-full"></div>
          <button class="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors rounded-lg"><span class="material-symbols-outlined text-[18px]">my_location</span></button>
        </div>
        <div class="bg-surface-container-lowest rounded-xl shadow-md px-2.5 py-1.5 flex items-center gap-1.5 text-on-surface-variant"><span class="material-symbols-outlined text-[18px]">map</span><span class="font-label-sm text-label-sm font-medium">Carto Light</span></div>
      </div>
      <div class="absolute top-4 right-4 z-20 hidden md:flex items-center gap-2 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm">
        <span class="w-2 h-2 rounded-full bg-[#10b981] animate-ping"></span>
        <span class="font-label-sm text-label-sm text-on-surface font-medium">INSAT-3DR LST Calibration: Optimal (RMS 0.38K)</span>
      </div>
      <!-- Legend -->
      <div class="absolute bottom-4 left-4 z-30 bg-surface-container-lowest/95 backdrop-blur-md p-space-sm rounded-xl shadow-lg max-w-xs flex flex-col gap-2.5">
        <div class="flex items-center justify-between"><span class="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">Vulnerability Scale</span><span class="font-label-sm text-label-sm text-on-surface-variant">Score 0–100</span></div>
        <div class="w-full flex flex-col gap-1">
          <div class="h-2.5 w-full rounded-full bg-gradient-to-r from-[#a8dab5] via-[#fed976] via-[#fd8d3c] to-[#bd0026]"></div>
          <div class="flex justify-between font-label-sm text-[10px] text-on-surface-variant font-semibold"><span>0-30 Low</span><span>31-60 Mod</span><span>61-80 High</span><span>81-100 Crit</span></div>
        </div>
        <div class="h-px bg-surface-container w-full"></div>
        <div class="grid grid-cols-2 gap-x-2 gap-y-1.5 font-label-sm text-label-sm text-on-surface">
          <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-primary-container inline-block"></span><span>Cooling Center</span></div>
          <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-[#0284c7] inline-block"></span><span>Water ATM</span></div>
          <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-[#dc2626] inline-block"></span><span>First Responder</span></div>
          <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-[#205854] inline-block"></span><span>Forest Canopy</span></div>
        </div>
      </div>
    </div>

    <!-- Ward Detail Panel -->
    <div class="w-full md:w-[480px] h-full bg-surface-container-lowest shadow-2xl flex flex-col z-40 overflow-y-auto shrink-0 transition-all duration-300">
      <div class="p-space-md bg-surface-container-low flex flex-col gap-space-xs sticky top-0 z-10">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5"><span class="material-symbols-outlined text-primary text-[18px]">location_city</span><span class="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Ward Intelligence Dossier</span></div>
          <button class="p-1 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"><span class="material-symbols-outlined text-[20px]">close</span></button>
        </div>
        <div class="flex items-start justify-between gap-2 mt-1">
          <div><h2 class="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">Ward 37 - Chandni Chowk</h2><p class="font-body-sm text-body-sm text-on-surface-variant">Old Delhi Central • Zone 02 Sadar Paharganj</p></div>
          <span class="px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold tracking-tight shadow-sm flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-error"></span>RISK 82 • CRITICAL</span>
        </div>
      </div>
      <!-- Synthesis Callout -->
      <div class="p-space-md">
        <div class="p-space-sm rounded-xl bg-secondary-fixed/30 text-on-secondary-fixed flex flex-col gap-1.5 shadow-sm">
          <div class="flex items-center gap-1.5 text-secondary font-label-sm text-label-sm font-bold uppercase tracking-wider"><span class="material-symbols-outlined text-[18px]">bolt</span>Recommended Municipal Dispatch</div>
          <p class="font-body-sm text-body-sm text-on-surface leading-relaxed">Deploy mobile misting truck to <span class="font-semibold">Chandni Chowk transit plaza</span> and resupply ORS sachets at <span class="font-semibold">Fatehpuri kiosk</span>. Canopy deficit elevates localized pavement temperatures above 47°C.</p>
          <div class="flex items-center justify-between pt-1 mt-1 border-t border-secondary-fixed/50"><span class="font-label-sm text-[11px] text-on-surface-variant">Recommended Action Priority: Immediate</span><button class="px-2.5 py-1 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm">Trigger Dispatch</button></div>
        </div>
      </div>
      <!-- Diagnostic Tabs -->
      <div class="px-space-md flex gap-2 overflow-x-auto pb-1" id="diagnostic-tabs">
        <button class="diagnostic-tab active px-3 py-1.5 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm font-semibold whitespace-nowrap transition-colors" data-target="tab-thermal">1. Thermal Metrics</button>
        <button class="diagnostic-tab px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm whitespace-nowrap transition-colors" data-target="tab-exposure">2. Population Exposure</button>
        <button class="diagnostic-tab px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm whitespace-nowrap transition-colors" data-target="tab-vulnerability">3. Structural Factors</button>
        <button class="diagnostic-tab px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm whitespace-nowrap transition-colors" data-target="tab-infrastructure">4. Facility Gaps</button>
      </div>
      <div class="p-space-md flex flex-col gap-space-md flex-1">
        <!-- Tab 1: Thermal -->
        <div class="tab-content flex flex-col gap-space-sm" id="tab-thermal">
          <div class="grid grid-cols-2 gap-space-xs">
            <div class="p-space-sm rounded-xl bg-surface-container-low flex flex-col"><span class="font-label-sm text-label-sm text-on-surface-variant">Ambient Air Temp</span><span class="font-numeric-metric text-numeric-metric text-on-surface font-bold">38.8°C</span><span class="font-body-sm text-[11px] text-error font-medium">+3.2°C above city avg</span></div>
            <div class="p-space-sm rounded-xl bg-surface-container-low flex flex-col"><span class="font-label-sm text-label-sm text-on-surface-variant">LST (Satellite Landsat)</span><span class="font-numeric-metric text-numeric-metric text-error font-bold">44.2°C</span><span class="font-body-sm text-[11px] text-error font-medium">Asphalt & Metal Roof Heat</span></div>
            <div class="p-space-sm rounded-xl bg-surface-container-low flex flex-col"><span class="font-label-sm text-label-sm text-on-surface-variant">Tree Canopy Cover</span><span class="font-numeric-metric text-numeric-metric text-secondary font-bold">4.2%</span><span class="font-body-sm text-[11px] text-secondary font-medium">Critically Deficient (<15%)</span></div>
            <div class="p-space-sm rounded-xl bg-surface-container-low flex flex-col"><span class="font-label-sm text-label-sm text-on-surface-variant">Surface Albedo Index</span><span class="font-numeric-metric text-numeric-metric text-on-surface font-bold">0.12</span><span class="font-body-sm text-[11px] text-on-surface-variant">High solar radiation trapping</span></div>
          </div>
          <div class="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-2">
            <div class="flex items-center justify-between"><span class="font-label-sm text-label-sm font-semibold text-on-surface">24h Diurnal Heat Trapping Cycle</span><span class="font-label-sm text-label-sm text-primary font-medium">Night Cooling Failure</span></div>
            <svg class="w-full h-16" fill="none" viewBox="0 0 380 64">
              <defs><linearGradient id="thermalGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#ba1a1a"></stop><stop offset="100%" stop-color="#005a5c" stop-opacity="0"></stop></linearGradient></defs>
              <path d="M0,50 Q60,48 120,38 T240,12 T320,18 T380,30" fill="none" stroke="#005a5c" stroke-width="2.5"></path>
              <path d="M0,50 Q60,48 120,38 T240,12 T320,18 T380,30 L380,64 L0,64 Z" fill="url(#thermalGradient)" opacity="0.25"></path>
              <circle cx="240" cy="12" fill="#ba1a1a" r="4"></circle>
              <text fill="#ba1a1a" font-family="Inter" font-size="9" font-weight="700" x="235" y="8">Peak 44.2°C</text>
            </svg>
            <div class="flex justify-between font-label-sm text-[10px] text-on-surface-variant"><span>06:00 (31.4°C)</span><span>12:00 (39.2°C)</span><span>15:00 (Peak)</span><span>21:00 (35.1°C Retention)</span></div>
          </div>
        </div>
        <!-- Tab 2: Exposure -->
        <div class="tab-content hidden flex flex-col gap-space-sm" id="tab-exposure">
          <div class="p-space-sm rounded-xl bg-surface-container-low flex items-center justify-between">
            <div><span class="font-label-sm text-label-sm text-on-surface-variant">Estimated Daytime Population</span><div class="font-numeric-metric text-numeric-metric text-on-surface font-bold">84,200</div><div class="font-body-sm text-body-sm text-on-surface-variant">Includes vendors, shoppers & transit riders</div></div>
            <span class="material-symbols-outlined text-primary text-[36px]">groups</span>
          </div>
          <div class="grid grid-cols-2 gap-space-xs">
            <div class="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1"><span class="font-label-sm text-label-sm text-on-surface-variant">Outdoor Informal Labor</span><span class="font-headline-md text-headline-md font-bold text-error">32.0%</span><span class="font-body-sm text-[11px] text-on-surface-variant">~26,900 rickshaw, freight & market staff</span></div>
            <div class="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1"><span class="font-label-sm text-label-sm text-on-surface-variant">Elderly Cohort (>65y)</span><span class="font-headline-md text-headline-md font-bold text-secondary">14.8%</span><span class="font-body-sm text-[11px] text-on-surface-variant">12,460 residents with heat frailty profile</span></div>
          </div>
          <div class="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-2">
            <span class="font-label-sm text-label-sm font-semibold text-on-surface">Pedestrian Traffic Exposure Density</span>
            <div class="w-full bg-surface-container rounded-full h-3 overflow-hidden flex">
              <div class="bg-error h-full" style="width: 48%"></div><div class="bg-secondary-container h-full" style="width: 32%"></div><div class="bg-primary-container h-full" style="width: 20%"></div>
            </div>
            <div class="flex items-center justify-between font-label-sm text-[10px] text-on-surface-variant"><span>Unshaded Streets (48%)</span><span>Narrow Alleys (32%)</span><span>Indoor/Transit (20%)</span></div>
          </div>
        </div>
        <!-- Tab 3: Vulnerability -->
        <div class="tab-content hidden flex flex-col gap-space-sm" id="tab-vulnerability">
          <div class="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-2"><span class="font-label-sm text-label-sm font-semibold text-on-surface">Housing Typology & Indoor Trapping</span><p class="font-body-sm text-body-sm text-on-surface-variant">64% of residential structures in Ward 37 utilize uninsulated corrugated metal or dense masonry roofing with zero reflective barrier, creating severe indoor thermal stress exceeding 41°C during twilight hours.</p></div>
          <div class="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-2">
            <div class="flex items-center justify-between"><span class="font-label-sm text-label-sm font-semibold text-on-surface">Baseline Morbidity Vulnerability</span><span class="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[10px] font-bold">ELEVATED</span></div>
            <ul class="font-body-sm text-body-sm text-on-surface flex flex-col gap-1.5">
              <li class="flex items-center gap-2"><span class="material-symbols-outlined text-secondary text-[16px]">check_circle</span><span>Prevalence of chronic respiratory stress (COPD / Asthma): 19.4%</span></li>
              <li class="flex items-center gap-2"><span class="material-symbols-outlined text-secondary text-[16px]">check_circle</span><span>Active cardiovascular surveillance registry: 4,120 citizens</span></li>
              <li class="flex items-center gap-2"><span class="material-symbols-outlined text-secondary text-[16px]">check_circle</span><span>Limited potable piped access in inner Katras</span></li>
            </ul>
          </div>
        </div>
        <!-- Tab 4: Infrastructure -->
        <div class="tab-content hidden flex flex-col gap-space-sm" id="tab-infrastructure">
          <div class="grid grid-cols-2 gap-space-xs">
            <div class="p-space-sm rounded-xl bg-error-container text-on-error-container flex flex-col"><span class="font-label-sm text-label-sm">Shelter Capacity Deficit</span><span class="font-numeric-metric text-numeric-metric font-bold">-180 Beds</span><span class="font-body-sm text-[11px]">Needed for peak afternoon</span></div>
            <div class="p-space-sm rounded-xl bg-surface-container-low flex flex-col"><span class="font-label-sm text-label-sm text-on-surface-variant">Nearest ER Hospital</span><span class="font-numeric-metric text-numeric-metric text-on-surface font-bold">2.3 km</span><span class="font-body-sm text-[11px] text-on-surface-variant">LNJP Emergency Block</span></div>
          </div>
          <div class="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-2">
            <span class="font-label-sm text-label-sm font-semibold text-on-surface">Active Countermeasure Assets</span>
            <div class="flex flex-col gap-2 font-body-sm text-body-sm text-on-surface">
              <div class="flex items-center justify-between"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-primary text-[18px]">water_drop</span><span>Water ATMs / Hydration Kiosks</span></div><span class="font-semibold text-primary">2 Active / 5 Required</span></div>
              <div class="flex items-center justify-between"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-primary text-[18px]">ac_unit</span><span>Public Shaded Respite Centers</span></div><span class="font-semibold text-primary">1 Operational (Town Hall)</span></div>
              <div class="flex items-center justify-between"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-error text-[18px]">ambulance</span><span>Heat Emergency Transit Triage</span></div><span class="font-semibold text-error">1 Paramedic Unit Staged</span></div>
            </div>
          </div>
        </div>
      </div>
      <!-- Bottom Ward Comparison Bar -->
      <div class="p-space-sm border-t border-surface-container-high bg-surface-container-low flex items-center gap-space-sm overflow-x-auto sticky bottom-0">
        <div class="flex items-center gap-1.5 shrink-0"><span class="material-symbols-outlined text-primary text-[18px]">compare_arrows</span><span class="font-label-sm text-label-sm font-semibold text-on-surface-variant">Ward Comparison</span></div>
        <div class="flex items-center gap-space-xs">
          <div class="px-2.5 py-1 rounded-lg bg-error-container/50 text-on-error-container font-label-sm text-label-sm font-semibold flex items-center gap-1.5 whitespace-nowrap"><span>Ward 37 (Chandni Ch...)</span><span class="font-bold">82</span><span class="text-[10px] font-bold">CRITICAL</span></div>
          <div class="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center gap-1.5 whitespace-nowrap"><span>Ward 21 (Kashmere Gate)</span><span class="font-bold">76</span><span class="text-[10px] text-secondary font-bold">HIGH</span></div>
          <div class="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center gap-1.5 whitespace-nowrap"><span>Ward 14 (Sadar Bazaar)</span><span class="font-bold">58</span><span class="text-[10px] text-on-surface-variant font-bold">MOD</span></div>
        </div>
      </div>
    </div>
  </div>
  `;

  // Time horizon scrubber
  const scrubber = container.querySelector('#time-horizon-scrubber');
  if (scrubber) {
    scrubber.querySelectorAll('.time-step-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        scrubber.querySelectorAll('.time-step-btn').forEach(b => {
          b.className = 'time-step-btn px-space-sm py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-all';
        });
        btn.className = 'time-step-btn active px-space-sm py-1.5 rounded-lg bg-surface-container-lowest text-primary font-label-sm text-label-sm font-semibold shadow-sm transition-all flex items-center gap-1.5';
      });
    });
  }

  // Layer chips
  const chips = container.querySelector('#layer-chips');
  if (chips) {
    chips.querySelectorAll('.layer-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        chips.querySelectorAll('.layer-chip').forEach(c => {
          c.className = 'layer-chip px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-label-sm text-label-sm flex items-center gap-1.5 transition-all';
        });
        chip.className = 'layer-chip active px-space-sm py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm flex items-center gap-1.5 shadow-sm transition-all';
      });
    });
  }

  // Diagnostic tabs
  const tabs = container.querySelector('#diagnostic-tabs');
  if (tabs) {
    tabs.querySelectorAll('.diagnostic-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.querySelectorAll('.diagnostic-tab').forEach(t => {
          t.className = 'diagnostic-tab px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container font-label-sm text-label-sm whitespace-nowrap transition-colors';
        });
        tab.className = 'diagnostic-tab active px-3 py-1.5 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm font-semibold whitespace-nowrap transition-colors';
        container.querySelectorAll('.tab-content').forEach(tc => tc.classList.add('hidden'));
        const target = container.querySelector('#' + tab.dataset.target);
        if (target) target.classList.remove('hidden');
      });
    });
  }
}
