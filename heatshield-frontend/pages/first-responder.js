export function renderFirstResponder(container) {
  container.innerHTML = `
  <!-- Status Bar -->
  <div class="w-full px-space-md py-space-sm bg-surface-container-low flex flex-col md:flex-row md:items-center md:justify-between gap-space-xs">
    <div class="flex items-center gap-space-xs flex-wrap">
      <span class="inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
        <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
        ACTIVE HEAT EVENT LEVEL 3
      </span>
      <span class="font-label-sm text-label-sm text-on-surface-variant">FIRST RESPONDER DISPATCH CONSOLE • UTC+05:30</span>
    </div>
    <div class="flex items-center gap-space-sm text-on-surface-variant font-label-sm text-label-sm">
      <span class="flex items-center gap-1">
        <span class="material-symbols-outlined text-[16px] text-primary">badge</span>
        Shift Lead: <span class="font-semibold text-on-surface">Dr. S. Rao (Duty Officer)</span>
      </span>
      <span class="w-1 h-1 rounded-full bg-outline-variant"></span>
      <span>Broadcast Channel: <span class="text-primary font-semibold">UHF-09 Civic Res</span></span>
    </div>
  </div>

  <div class="w-full px-space-md py-space-md space-y-space-md">
    <!-- 4 KPI Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
      <div class="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between">
        <div class="flex items-center justify-between text-on-surface-variant">
          <span class="font-label-sm text-label-sm font-medium uppercase tracking-wider">Active Teams Deployed</span>
          <span class="material-symbols-outlined text-[20px] text-primary">group_work</span>
        </div>
        <div class="flex items-baseline justify-between mt-space-2xs">
          <span class="font-numeric-metric text-numeric-metric text-on-surface font-bold">14<span class="font-body-md text-body-md text-on-surface-variant font-normal"> / 18</span></span>
          <span class="px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold">78% Field Ops</span>
        </div>
        <div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-space-xs">
          <div class="bg-primary h-full rounded-full" style="width: 77.7%"></div>
        </div>
      </div>
      <div class="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between">
        <div class="flex items-center justify-between text-on-surface-variant">
          <span class="font-label-sm text-label-sm font-medium uppercase tracking-wider">Incident Queue (Live)</span>
          <span class="material-symbols-outlined text-[20px] text-secondary">assignment_late</span>
        </div>
        <div class="flex items-baseline justify-between mt-space-2xs">
          <span class="font-numeric-metric text-numeric-metric text-on-surface font-bold">09<span class="font-body-md text-body-md text-on-surface-variant font-normal"> Pending</span></span>
          <span class="px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">3 Escalated</span>
        </div>
        <div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-space-xs">
          <div class="bg-secondary h-full rounded-full" style="width: 60%"></div>
        </div>
      </div>
      <div class="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between">
        <div class="flex items-center justify-between text-on-surface-variant">
          <span class="font-label-sm text-label-sm font-medium uppercase tracking-wider">ORS & IV Stocks</span>
          <span class="material-symbols-outlined text-[20px] text-primary">medication_liquid</span>
        </div>
        <div class="flex items-baseline justify-between mt-space-2xs">
          <span class="font-numeric-metric text-numeric-metric text-on-surface font-bold">84%</span>
          <span class="px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-medium">Nominal Reserve</span>
        </div>
        <div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-space-xs">
          <div class="bg-primary-container h-full rounded-full" style="width: 84%"></div>
        </div>
      </div>
      <div class="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between">
        <div class="flex items-center justify-between text-on-surface-variant">
          <span class="font-label-sm text-label-sm font-medium uppercase tracking-wider">Peak Wet-Bulb (Ward 37)</span>
          <span class="material-symbols-outlined text-[20px] text-error">device_thermostat</span>
        </div>
        <div class="flex items-baseline justify-between mt-space-2xs">
          <span class="font-numeric-metric text-numeric-metric text-on-surface font-bold">30.8°C</span>
          <span class="px-space-xs py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">Heatstroke Danger</span>
        </div>
        <div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-space-xs">
          <div class="bg-error h-full rounded-full" style="width: 92%"></div>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs bg-surface-container-lowest p-space-xs rounded-lg shadow-sm">
      <div class="flex items-center gap-space-2xs overflow-x-auto py-1" id="fr-filter-btns">
        <button class="filter-btn active px-space-sm py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-semibold transition-all">All Priority Wards</button>
        <button class="filter-btn px-space-sm py-1.5 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm font-medium transition-all">Critical (Score >80)</button>
        <button class="filter-btn px-space-sm py-1.5 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm font-medium transition-all">Cooling Shelter Overflows</button>
        <button class="filter-btn px-space-sm py-1.5 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm font-medium transition-all">Mobile Medic Routes</button>
      </div>
      <div class="flex items-center gap-space-xs px-space-2xs">
        <span class="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">tune</span>
          Sort: Risk Vector
        </span>
        <span class="font-label-sm text-label-sm font-semibold text-primary">Triage Dynamic</span>
      </div>
    </div>

    <!-- Main Content Split -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
      <!-- Left: Action Queue + Facility Telemetry -->
      <div class="lg:col-span-8 flex flex-col gap-space-md">
        <!-- Prioritized Action Queue -->
        <div class="bg-surface-container-lowest rounded-lg p-space-md shadow-sm">
          <div class="flex items-center justify-between mb-space-sm">
            <div class="flex items-center gap-space-xs">
              <span class="w-2.5 h-2.5 rounded-full bg-error"></span>
              <h2 class="font-headline-sm text-headline-sm text-on-surface">Prioritized Municipal Action Queue</h2>
            </div>
            <span class="font-label-sm text-label-sm text-on-surface-variant">Ranked by Wet-Bulb × Vulnerable Density</span>
          </div>
          <div class="space-y-space-sm">
            <!-- Ward 37 P-01 -->
            <div class="p-space-sm rounded-lg bg-surface-container-low transition-all hover:bg-surface-container">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-2xs mb-space-xs">
                <div class="flex items-center gap-space-xs">
                  <span class="px-space-xs py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold tracking-wide">P-01 CRITICAL</span>
                  <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Ward 37 (Central Old City)</h3>
                </div>
                <div class="flex items-center gap-space-xs">
                  <span class="px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">Exposure: Severe Outdoor Labor</span>
                  <div class="flex items-baseline gap-1">
                    <span class="font-label-sm text-label-sm text-on-surface-variant">Score</span>
                    <span class="font-headline-sm text-headline-sm text-error font-bold">82</span>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-space-xs text-on-surface-variant font-body-sm text-body-sm mb-space-sm bg-surface-container-lowest p-space-xs rounded-lg">
                <div class="flex items-start gap-1.5">
                  <span class="material-symbols-outlined text-[18px] text-error">water_damage</span>
                  <span><strong>Bottleneck:</strong> Hub A at 80% cap; main line pressure degraded to 1.1 bar.</span>
                </div>
                <div class="flex items-start gap-1.5">
                  <span class="material-symbols-outlined text-[18px] text-primary">groups</span>
                  <span><strong>Population:</strong> ~4,200 street vendors & rickshaw drivers unshaded.</span>
                </div>
                <div class="flex items-start gap-1.5">
                  <span class="material-symbols-outlined text-[18px] text-secondary">timer</span>
                  <span><strong>Response SLA:</strong> 12 mins remaining before tier-4 escalation.</span>
                </div>
              </div>
              <div class="p-space-xs rounded-lg bg-primary-fixed/30 text-on-primary-fixed-variant font-label-md text-label-md mb-space-sm flex items-center justify-between flex-wrap gap-space-xs">
                <div class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[18px] text-primary">alt_route</span>
                  <span><strong>Dispatch Recommendation:</strong> Deploy Mobile Misting Unit #4 + 200L Emergency Chilled Water Tanker.</span>
                </div>
                <span class="font-label-sm text-label-sm text-on-surface-variant">Asset: Depo-East (4.1 km away)</span>
              </div>
              <div class="flex items-center gap-space-xs flex-wrap">
                <button class="fr-action-btn px-space-md py-1.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md font-medium transition-colors flex items-center gap-1.5 shadow-sm" data-action="dispatch" data-unit="Mobile Misting Unit #4 + Water Tanker" data-ward="Ward 37">
                  <span class="material-symbols-outlined text-[18px]">send</span>
                  Acknowledge & Dispatch Unit
                </button>
                <button class="fr-action-btn px-space-sm py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md font-medium transition-colors flex items-center gap-1" data-action="reroute" data-from="Ward 37" data-to="Ward 14">
                  <span class="material-symbols-outlined text-[18px]">cached</span>
                  Reroute to Ward 14
                </button>
                <span class="text-on-surface-variant font-label-sm text-label-sm ml-auto">Last pinged 45s ago</span>
              </div>
            </div>

            <!-- Ward 21 P-02 -->
            <div class="p-space-sm rounded-lg bg-surface-container-low transition-all hover:bg-surface-container">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-2xs mb-space-xs">
                <div class="flex items-center gap-space-xs">
                  <span class="px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold tracking-wide">P-02 HIGH</span>
                  <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Ward 21 (Karol Bagh West)</h3>
                </div>
                <div class="flex items-center gap-space-xs">
                  <span class="px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">Residential High-Density</span>
                  <div class="flex items-baseline gap-1">
                    <span class="font-label-sm text-label-sm text-on-surface-variant">Score</span>
                    <span class="font-headline-sm text-headline-sm text-secondary font-bold">76</span>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-space-xs text-on-surface-variant font-body-sm text-body-sm mb-space-sm bg-surface-container-lowest p-space-xs rounded-lg">
                <div class="flex items-start gap-1.5">
                  <span class="material-symbols-outlined text-[18px] text-secondary">bolt</span>
                  <span><strong>Grid Strain:</strong> Substation #11 reporting 94% thermal load. Spike warning active.</span>
                </div>
                <div class="flex items-start gap-1.5">
                  <span class="material-symbols-outlined text-[18px] text-primary">apartment</span>
                  <span><strong>Housing:</strong> Informal tenements without passive ventilation or AC.</span>
                </div>
              </div>
              <div class="p-space-xs rounded-lg bg-surface-container-highest text-on-surface-variant font-label-md text-label-md mb-space-sm flex items-center justify-between flex-wrap gap-space-xs">
                <div class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[18px] text-primary">domain</span>
                  <span><strong>Action:</strong> Open Municipal Secondary School #3 as auxiliary emergency cooling zone (HVAC generator active).</span>
                </div>
                <span class="font-label-sm text-label-sm text-on-surface font-semibold">Capacity: +180 Beds</span>
              </div>
              <div class="flex items-center gap-space-xs">
                <button class="fr-action-btn px-space-md py-1.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md font-medium transition-colors flex items-center gap-1.5 shadow-sm" data-action="activate" data-shelter="Municipal School #3" data-ward="Ward 21">
                  <span class="material-symbols-outlined text-[18px]">meeting_room</span>
                  Activate Secondary Shelter
                </button>
                <button class="px-space-sm py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md font-medium transition-colors">
                  Notify School Admin
                </button>
              </div>
            </div>

            <!-- Ward 12 P-03 -->
            <div class="p-space-sm rounded-lg bg-surface-container-low transition-all hover:bg-surface-container">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-2xs mb-space-xs">
                <div class="flex items-center gap-space-xs">
                  <span class="px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold tracking-wide">P-03 HIGH</span>
                  <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Ward 12 (Anand Parbat)</h3>
                </div>
                <div class="flex items-center gap-space-xs">
                  <span class="px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">Elevated Terrain / Slum Fringe</span>
                  <div class="flex items-baseline gap-1">
                    <span class="font-label-sm text-label-sm text-on-surface-variant">Score</span>
                    <span class="font-headline-sm text-headline-sm text-secondary font-bold">74</span>
                  </div>
                </div>
              </div>
              <p class="font-body-md text-body-md text-on-surface-variant mb-space-sm">
                Elderly welfare door-to-door checks pending: <strong>42 vulnerable households</strong> flagged by social welfare telemetry with no logged family contact in 6 hours.
              </p>
              <div class="flex items-center gap-space-xs flex-wrap">
                <button class="fr-action-btn px-space-md py-1.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md font-medium transition-colors flex items-center gap-1.5 shadow-sm" data-action="asha">
                  <span class="material-symbols-outlined text-[18px]">support_agent</span>
                  Assign Community Health Workers (ASHA)
                </button>
                <button class="px-space-sm py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md font-medium transition-colors">
                  Export Checklist (42 IDs)
                </button>
                <span class="text-on-surface-variant font-label-sm text-label-sm ml-auto">Sector Lead: ASHA Team Beta</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Facility Telemetry -->
        <div class="bg-surface-container-lowest rounded-lg p-space-md shadow-sm">
          <div class="flex items-center justify-between mb-space-sm">
            <div>
              <h2 class="font-headline-sm text-headline-sm text-on-surface">Municipal Cooling Facilities & Route Telemetry</h2>
              <p class="font-label-sm text-label-sm text-on-surface-variant">Live census • Water reserves • Paramedic staffing</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              <span class="font-label-sm text-label-sm text-on-surface-variant">Live Updates (30s cadence)</span>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
            <!-- Shelter A -->
            <div class="p-space-sm rounded-lg bg-surface-container-low flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-space-xs">
                  <div class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-primary text-[20px]">domain</span>
                    <h4 class="font-headline-sm text-label-lg font-bold text-on-surface">Shelter A (Red Cross Civic Hub)</h4>
                  </div>
                  <span class="px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">BUSY • 80%</span>
                </div>
                <div class="space-y-space-xs mt-space-xs">
                  <div class="flex justify-between font-label-sm text-label-sm">
                    <span class="text-on-surface-variant">Live Census Occupancy</span>
                    <span class="font-semibold text-on-surface">120 / 150 Persons</span>
                  </div>
                  <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div class="bg-secondary h-full rounded-full" style="width: 80%"></div>
                  </div>
                  <div class="grid grid-cols-2 gap-2 pt-1 font-body-sm text-body-sm text-on-surface-variant">
                    <span class="flex items-center gap-1">
                      <span class="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                      Medical Triage: Active
                    </span>
                    <span class="flex items-center gap-1">
                      <span class="material-symbols-outlined text-[16px] text-primary">water_drop</span>
                      Water Supply: OK (3,400L)
                    </span>
                  </div>
                </div>
              </div>
              <div class="mt-space-sm pt-space-xs flex items-center justify-between">
                <span class="font-label-sm text-label-sm text-on-surface-variant">Sector: Ward 37 Central</span>
                <button class="font-label-sm text-label-sm text-primary font-semibold hover:underline">Manage Entry Queue →</button>
              </div>
            </div>

            <!-- Shelter B -->
            <div class="p-space-sm rounded-lg bg-error-container/20 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-space-xs">
                  <div class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-error text-[20px]">warning</span>
                    <h4 class="font-headline-sm text-label-lg font-bold text-on-surface">Shelter B (Community Hall East)</h4>
                  </div>
                  <span class="px-space-xs py-0.5 rounded-full bg-error text-on-error font-label-sm text-label-sm font-bold animate-pulse">FULL • 100%</span>
                </div>
                <div class="space-y-space-xs mt-space-xs">
                  <div class="flex justify-between font-label-sm text-label-sm">
                    <span class="text-on-surface-variant">Live Census Occupancy</span>
                    <span class="font-semibold text-error">200 / 200 Max Capacity</span>
                  </div>
                  <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div class="bg-error h-full rounded-full" style="width: 100%"></div>
                  </div>
                  <p class="font-body-sm text-body-sm text-on-surface-variant pt-1">
                    Internal temperature: 24.2°C. Hallways congested. Paramedic requested perimeter diversion.
                  </p>
                </div>
              </div>
              <div class="mt-space-sm pt-space-xs">
                <button class="fr-action-btn w-full py-1.5 rounded-lg bg-secondary hover:bg-on-secondary-container text-on-secondary font-label-md text-label-md font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm" data-action="divert">
                  <span class="material-symbols-outlined text-[18px]">turn_sharp_right</span>
                  Divert Incoming Citizens to Hub D
                </button>
              </div>
            </div>

            <!-- Shelter C -->
            <div class="p-space-sm rounded-lg bg-surface-container-low flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-space-xs">
                  <div class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-primary text-[20px]">park</span>
                    <h4 class="font-headline-sm text-label-lg font-bold text-on-surface">Shelter C (North District Pavilion)</h4>
                  </div>
                  <span class="px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold">AVAILABLE</span>
                </div>
                <div class="space-y-space-xs mt-space-xs">
                  <div class="flex justify-between font-label-sm text-label-sm">
                    <span class="text-on-surface-variant">Live Census Occupancy</span>
                    <span class="font-semibold text-on-surface">45 / 120 (37%)</span>
                  </div>
                  <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div class="bg-primary-container h-full rounded-full" style="width: 37.5%"></div>
                  </div>
                  <div class="grid grid-cols-2 gap-2 pt-1 font-body-sm text-body-sm text-on-surface-variant">
                    <span>Shaded Cots: <strong>75 open</strong></span>
                    <span>Pediatric Zone: <strong>Available</strong></span>
                  </div>
                </div>
              </div>
              <div class="mt-space-sm pt-space-xs flex items-center justify-between">
                <span class="font-label-sm text-label-sm text-on-surface-variant">Receiving overflow from Hub B</span>
                <span class="font-label-sm text-label-sm text-primary font-semibold">Green Status</span>
              </div>
            </div>

            <!-- Mobile Units -->
            <div class="p-space-sm rounded-lg bg-surface-container-low flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-space-xs">
                  <div class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-primary text-[20px]">local_shipping</span>
                    <h4 class="font-headline-sm text-label-lg font-bold text-on-surface">Mobile Hydration Units 01 & 02</h4>
                  </div>
                  <span class="px-space-xs py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-semibold">PATROL ROUTE</span>
                </div>
                <div class="space-y-space-xs mt-space-xs">
                  <div class="flex justify-between font-label-sm text-label-sm">
                    <span class="text-on-surface-variant">Outer Ring Road Corridor</span>
                    <span class="font-semibold text-on-surface">340 Packs Served</span>
                  </div>
                  <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div class="bg-primary h-full rounded-full" style="width: 68%"></div>
                  </div>
                  <p class="font-body-sm text-body-sm text-on-surface-variant pt-1">
                    Fleet GPS synced. Refill rendezvous planned at Sub-Depot 4 in 45 min.
                  </p>
                </div>
              </div>
              <div class="mt-space-sm pt-space-xs flex items-center justify-between">
                <span class="font-label-sm text-label-sm text-on-surface-variant">Comms: Unit 01 Active (4G GPS)</span>
                <button class="font-label-sm text-label-sm text-primary font-semibold hover:underline">Track Fleet →</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Ward 37 Micro-Zone + Triage Log -->
      <div class="lg:col-span-4 flex flex-col gap-space-md">
        <!-- Ward 37 Micro-Zone -->
        <div class="bg-surface-container-lowest rounded-lg p-space-md shadow-sm">
          <div class="flex items-center justify-between mb-space-sm">
            <h3 class="font-headline-sm text-headline-sm text-on-surface">Ward 37 Micro-Zone</h3>
            <span class="px-space-xs py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">GIS Live</span>
          </div>
          <!-- SVG Map of Ward 37 Micro-Zone -->
          <div class="w-full h-44 rounded-lg bg-surface-container-low mb-space-sm relative overflow-hidden shadow-inner flex flex-col justify-end p-space-xs">
            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 400 176">
              <defs>
                <pattern id="microGrid" patternUnits="userSpaceOnUse" width="20" height="20">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#bec9c9" stroke-width="0.5"></path>
                </pattern>
                <linearGradient id="heatOverlay" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stop-color="#ba1a1a" stop-opacity="0.35"></stop>
                  <stop offset="100%" stop-color="#904d00" stop-opacity="0.2"></stop>
                </linearGradient>
              </defs>
              <rect fill="url(#microGrid)" width="400" height="176"></rect>
              <rect fill="url(#heatOverlay)" width="400" height="176"></rect>
              <!-- Streets -->
              <path d="M 0 60 L 180 60 L 200 80 L 400 70" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.8"></path>
              <path d="M 150 0 L 160 80 L 140 176" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.7"></path>
              <path d="M 280 0 L 290 100 L 310 176" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.6"></path>
              <!-- Hotspot markers -->
              <circle cx="180" cy="65" r="20" fill="#ba1a1a" fill-opacity="0.25"></circle>
              <circle cx="180" cy="65" r="10" fill="#ba1a1a" fill-opacity="0.5"></circle>
              <circle cx="180" cy="65" r="4" fill="#ba1a1a"></circle>
              <circle cx="300" cy="95" r="14" fill="#904d00" fill-opacity="0.25"></circle>
              <circle cx="300" cy="95" r="7" fill="#904d00" fill-opacity="0.5"></circle>
              <circle cx="300" cy="95" r="3" fill="#904d00"></circle>
              <!-- Ward label -->
              <text fill="#191c1b" font-family="Inter" font-size="11" font-weight="600" x="80" y="40">Chandni Chowk Core</text>
            </svg>
            <div class="bg-surface/90 backdrop-blur-md p-space-2xs rounded text-on-surface font-label-sm text-label-sm flex items-center justify-between relative z-10">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px] text-error">emergency</span>
                Cluster: Chandni Chowk
              </span>
              <span class="font-bold text-error">Wet Bulb 30.8°</span>
            </div>
          </div>
          <div class="p-space-xs rounded-lg bg-surface-container-low mb-space-sm">
            <div class="flex items-center justify-between font-label-sm text-label-sm mb-1">
              <span class="text-on-surface-variant">Direct Solar Load (KW/m²)</span>
              <span class="font-semibold text-on-surface">1.04 Extreme</span>
            </div>
            <div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div class="bg-secondary h-full rounded-full" style="width: 88%"></div>
            </div>
          </div>
          <div class="space-y-space-xs">
            <div class="flex items-center justify-between text-on-surface font-label-md text-label-md py-1">
              <span class="text-on-surface-variant">Assigned Response Lead</span>
              <span class="font-semibold">Capt. M. Varma (Team 4)</span>
            </div>
            <div class="flex items-center justify-between text-on-surface font-label-md text-label-md py-1">
              <span class="text-on-surface-variant">Cooling Mist Vehicles</span>
              <span class="font-semibold text-primary">2 In Transit</span>
            </div>
            <div class="flex items-center justify-between text-on-surface font-label-md text-label-md py-1">
              <span class="text-on-surface-variant">Water Refill Nodes Open</span>
              <span class="font-semibold">7 / 9 Nominal</span>
            </div>
          </div>
        </div>

        <!-- Live Triage Log -->
        <div class="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col flex-grow">
          <div class="flex items-center justify-between mb-space-sm">
            <div class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
              <h3 class="font-headline-sm text-headline-sm text-on-surface">Live Heat Triage Log</h3>
            </div>
            <span class="font-label-sm text-label-sm text-on-surface-variant">Real-Time</span>
          </div>
          <div class="overflow-hidden flex flex-col gap-space-xs" id="triage-log-feed">
            <div class="p-space-xs rounded-lg bg-surface-container-low transition-all hover:bg-surface-container">
              <div class="flex items-center justify-between mb-1">
                <span class="font-numeric-metric text-label-md font-bold text-on-surface">13:42</span>
                <span class="px-space-xs py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">Priority 1</span>
              </div>
              <p class="font-body-md text-body-md text-on-surface font-medium">Heat exhaustion report near Metro Station Gate 2</p>
              <div class="flex items-center justify-between mt-1 text-on-surface-variant font-label-sm text-label-sm">
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px] text-primary">directions_walk</span>
                  Medic Unit #08 Dispatched
                </span>
                <span>ETA 4m</span>
              </div>
            </div>
            <div class="p-space-xs rounded-lg bg-surface-container-low transition-all hover:bg-surface-container">
              <div class="flex items-center justify-between mb-1">
                <span class="font-numeric-metric text-label-md font-bold text-on-surface">13:30</span>
                <span class="px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">Infra Alert</span>
              </div>
              <p class="font-body-md text-body-md text-on-surface font-medium">Water ATM 04 filter alert / Low pressure</p>
              <div class="flex items-center justify-between mt-1 text-on-surface-variant font-label-sm text-label-sm">
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px] text-secondary">build</span>
                  Jal Board Tech Notified
                </span>
                <span>Assigned</span>
              </div>
            </div>
            <div class="p-space-xs rounded-lg bg-surface-container-low transition-all hover:bg-surface-container">
              <div class="flex items-center justify-between mb-1">
                <span class="font-numeric-metric text-label-md font-bold text-on-surface">13:15</span>
                <span class="px-space-xs py-0.5 rounded-full bg-error text-on-error font-label-sm text-label-sm font-semibold">Sensor Grid</span>
              </div>
              <p class="font-body-md text-body-md text-on-surface font-medium">High wet-bulb threshold (>30°C) triggered in Ward 37</p>
              <div class="flex items-center justify-between mt-1 text-on-surface-variant font-label-sm text-label-sm">
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px] text-error">notification_important</span>
                  Auto SMS Alert broadcasted
                </span>
                <span>Done</span>
              </div>
            </div>
            <div class="p-space-xs rounded-lg bg-surface-container-low transition-all hover:bg-surface-container">
              <div class="flex items-center justify-between mb-1">
                <span class="font-numeric-metric text-label-md font-bold text-on-surface">12:58</span>
                <span class="px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">Logistics</span>
              </div>
              <p class="font-body-md text-body-md text-on-surface font-medium">1,200 Electrolyte ORS sachets delivered to Shelter C</p>
              <div class="flex items-center justify-between mt-1 text-on-surface-variant font-label-sm text-label-sm">
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px] text-primary">inventory_2</span>
                  Inventory Verified
                </span>
                <span>Restocked</span>
              </div>
            </div>
          </div>
          <button class="fr-log-btn mt-space-sm w-full py-space-2xs rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-medium transition-colors flex items-center justify-center gap-1.5">
            <span class="material-symbols-outlined text-[18px]">add</span>
            Log Manual Incident Intake
          </button>
        </div>
      </div>
    </div>

    <!-- Footer Action Bar -->
    <div class="bg-surface-container-low rounded-lg p-space-sm flex flex-col md:flex-row items-center justify-between gap-space-sm">
      <div class="flex items-center gap-space-sm">
        <div class="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center">
          <span class="material-symbols-outlined text-[24px]">broadcast_on_personal</span>
        </div>
        <div>
          <h4 class="font-headline-sm text-label-lg font-bold text-on-surface">Civic Heat Defense Counter-Measures Active</h4>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Cool roofs active across 12 civic schools • Continuous water misting deployed on major junctions</p>
        </div>
      </div>
      <div class="flex items-center gap-space-xs w-full md:w-auto justify-end">
        <button class="px-space-sm py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md font-medium transition-colors" id="fr-shift-summary">
          Download Shift Summary
        </button>
        <button class="px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold transition-colors shadow-sm" id="fr-ndma">
          Coordinate with NDMA
        </button>
      </div>
    </div>
  </div>
  `;

  // Helper: add log entry to triage feed
  function addLogEntry(time, text, tag, color) {
    const feed = container.querySelector('#triage-log-feed');
    if (!feed) return;

    const div = document.createElement('div');
    div.className = 'p-space-xs rounded-lg bg-surface-container-lowest transition-all shadow-sm';
    div.innerHTML = `
      <div class="flex items-center justify-between mb-1">
        <span class="font-numeric-metric text-label-md font-bold text-on-surface">${time}</span>
        <span class="px-space-xs py-0.5 rounded-full bg-${color === 'secondary' ? 'secondary-fixed text-on-secondary-fixed-variant' : 'primary-fixed text-on-primary-fixed-variant'} font-label-sm text-label-sm font-semibold">${tag}</span>
      </div>
      <p class="font-body-md text-body-md text-on-surface font-medium">${text}</p>
      <div class="flex items-center justify-between mt-1 text-on-surface-variant font-label-sm text-label-sm">
        <span class="flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px] text-primary">radio_button_checked</span>
          Logged by Shift Console
        </span>
        <span>Broadcasted</span>
      </div>
    `;
    feed.insertBefore(div, feed.firstChild);
  }

  // Filter buttons
  const filterBtns = container.querySelector('#fr-filter-btns');
  if (filterBtns) {
    filterBtns.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.querySelectorAll('.filter-btn').forEach(b => {
          b.className = 'filter-btn px-space-sm py-1.5 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm font-medium transition-all';
        });
        btn.className = 'filter-btn active px-space-sm py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-semibold transition-all';
      });
    });
  }

  // Action buttons via delegation
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.fr-action-btn');
    if (!btn) return;

    const action = btn.dataset.action;

    if (action === 'dispatch') {
      const unit = btn.dataset.unit;
      const ward = btn.dataset.ward;
      btn.disabled = true;
      btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Dispatching...`;
      setTimeout(() => {
        btn.className = 'px-space-md py-1.5 rounded-lg bg-tertiary text-on-tertiary font-label-md text-label-md font-medium flex items-center gap-1.5';
        btn.innerHTML = `<span class="material-symbols-outlined text-[18px]">check_circle</span> Dispatched (${unit})`;
        addLogEntry('Just now', 'Dispatched ' + unit + ' to ' + ward, 'Field Dispatched', 'primary');
      }, 900);
    }

    if (action === 'reroute') {
      const from = btn.dataset.from;
      const to = btn.dataset.to;
      btn.disabled = true;
      btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">cached</span> Updating...`;
      setTimeout(() => {
        btn.className = 'px-space-sm py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant font-label-md text-label-md font-medium';
        btn.innerHTML = `<span class="material-symbols-outlined text-[18px]">done</span> Rerouted to ${to}`;
        addLogEntry('Just now', `Rerouted standby units from ${from} to ${to}`, 'Reroute Sync', 'secondary');
      }, 750);
    }

    if (action === 'activate') {
      const shelter = btn.dataset.shelter;
      const ward = btn.dataset.ward;
      btn.disabled = true;
      btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Unlocking Facility...`;
      setTimeout(() => {
        btn.className = 'px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-medium flex items-center gap-1.5';
        btn.innerHTML = `<span class="material-symbols-outlined text-[18px]">verified</span> ${shelter} Active`;
        addLogEntry('Just now', `${shelter} in ${ward} designated as active cooling zone`, 'Shelter Active', 'primary');
      }, 1000);
    }

    if (action === 'asha') {
      btn.disabled = true;
      btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">sync</span> Alerting 12 Workers...`;
      setTimeout(() => {
        btn.className = 'px-space-md py-1.5 rounded-lg bg-tertiary-container text-on-tertiary-container font-label-md text-label-md font-medium flex items-center gap-1.5';
        btn.innerHTML = `<span class="material-symbols-outlined text-[18px]">groups</span> 12 ASHA Workers En Route`;
        addLogEntry('Just now', 'Dispatched ASHA Cluster Beta for 42 vulnerable household checks in Ward 12', 'Task Assigned', 'primary');
      }, 900);
    }

    if (action === 'divert') {
      btn.disabled = true;
      btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">sync</span> Setting diversion beacons...`;
      setTimeout(() => {
        btn.className = 'w-full py-1.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md font-medium flex items-center justify-center gap-1.5';
        btn.innerHTML = `<span class="material-symbols-outlined text-[18px] text-secondary">alt_route</span> Traffic Diverted to Hub D`;
        addLogEntry('Just now', 'Shelter B overflow: Traffic diverted toward Hub D (North District)', 'Traffic Divert', 'secondary');
      }, 800);
    }
  });

  // Manual incident intake
  const logBtn = container.querySelector('.fr-log-btn');
  if (logBtn) {
    logBtn.addEventListener('click', () => {
      const ward = prompt('Enter Ward / Location for manual intake:', 'Ward 37 Sub-Sector B');
      if (ward) {
        addLogEntry('Just now', `Manual hotline intake registered for ${ward}: Hydration requested.`, 'Intake Pending', 'secondary');
      }
    });
  }

  // Footer buttons
  container.querySelector('#fr-shift-summary')?.addEventListener('click', () => {
    window.triggerToast('Shift summary report downloaded as signed PDF.');
  });
  container.querySelector('#fr-ndma')?.addEventListener('click', () => {
    window.triggerToast('Coordination packet sent to National Disaster Management Authority.');
  });
}
