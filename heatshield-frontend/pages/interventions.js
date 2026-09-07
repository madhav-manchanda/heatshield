export function renderInterventions(container) {
  container.innerHTML = `
  <div class="px-space-md py-space-lg flex flex-col gap-space-xl max-w-7xl mx-auto w-full">
    <!-- Top Command Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-xs">
      <div class="flex flex-col">
        <div class="flex items-center gap-space-2xs text-primary font-label-sm uppercase tracking-widest"><span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span><span>Policy & Public Safety Engine</span></div>
        <h1 class="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">Interventions & What-If Simulator</h1>
        <p class="font-body-md text-body-md text-on-surface-variant">Model urban thermal adaptations, project public health relief, and evaluate civic heat advisory impact.</p>
      </div>
      <div class="flex items-center p-1 rounded-full bg-surface-container-high self-start md:self-auto shadow-inner" id="view-switcher">
        <button class="view-btn px-space-md py-1.5 rounded-full font-label-md text-label-md font-medium transition-all duration-200 bg-surface-container-lowest text-primary shadow-sm flex items-center gap-space-2xs" data-view="authority"><span class="material-symbols-outlined text-[18px]">tune</span>Authority Simulator</button>
        <button class="view-btn px-space-md py-1.5 rounded-full font-label-md text-label-md font-medium transition-all duration-200 text-on-surface-variant hover:text-on-surface flex items-center gap-space-2xs" data-view="citizen"><span class="material-symbols-outlined text-[18px]">person</span>Citizen Advisory Preview</button>
      </div>
    </div>

    <!-- Citizen Preview Panel -->
    <div class="relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-all duration-300" id="citizen-preview-panel">
      <div class="absolute top-0 left-0 bottom-0 w-2 bg-secondary-container"></div>
      <div class="p-space-lg pl-space-xl flex flex-col lg:flex-row gap-space-lg items-start justify-between">
        <div class="flex-1 flex flex-col gap-space-sm">
          <div class="flex flex-wrap items-center gap-space-xs">
            <span class="px-space-xs py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">Your Area: Central Ward 37</span>
            <span class="px-space-xs py-0.5 rounded-full bg-secondary-container/20 text-secondary font-label-sm text-label-sm font-bold flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>HIGH HEAT RISK TODAY</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant/80 ml-auto">Simulated Citizen View</span>
          </div>
          <div class="flex flex-col gap-space-2xs mt-1">
            <span class="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-semibold">What this means for you</span>
            <p class="font-body-lg text-body-lg text-on-surface leading-relaxed">
              Avoid strenuous outdoor activity between <span class="font-semibold text-secondary">2:00 PM and 5:00 PM</span>. Stay hydrated with electrolytes, maintain shade access, and seek air-conditioned public respite centers immediately if experiencing dizziness or nausea.
            </p>
          </div>
          <div class="mt-space-2xs p-space-md rounded-xl bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
            <div class="flex items-start gap-space-sm">
              <div class="w-10 h-10 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[22px]">water_drop</span></div>
              <div class="flex flex-col">
                <div class="flex items-center gap-space-2xs"><span class="font-headline-sm text-headline-sm font-semibold text-on-surface">Red Cross Civic Hub</span><span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-tertiary-fixed-dim/40 text-tertiary uppercase">Active Shelter</span></div>
                <span class="font-body-sm text-body-sm text-on-surface-variant">1.1 km away • Free chilled water, emergency electrolyte packets & shaded rest benches</span>
              </div>
            </div>
            <a class="px-space-md py-2 rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container shadow-xs font-label-md text-label-md font-semibold transition-colors flex items-center gap-1 shrink-0" href="#"><span class="material-symbols-outlined text-[16px]">navigation</span>Get Directions</a>
          </div>
        </div>
        <div class="w-full lg:w-80 flex flex-col gap-space-sm p-space-md rounded-xl bg-surface-container-high/60 shrink-0">
          <div class="flex items-center gap-space-2xs text-error font-label-sm font-bold uppercase tracking-wider"><span class="material-symbols-outlined text-[18px]">emergency_home</span>Emergency Assistance</div>
          <div class="flex flex-col gap-1"><span class="font-label-sm text-label-sm text-on-surface-variant">State Ambulance Emergency</span><span class="font-numeric-metric text-headline-lg font-bold text-on-surface tracking-tight">Call 108</span></div>
          <div class="flex flex-col gap-1"><span class="font-label-sm text-label-sm text-on-surface-variant">Municipal Heat Helpline (24/7)</span><div class="flex items-center gap-2"><span class="font-label-lg text-label-lg font-bold text-primary">1800-11-HEAT</span><span class="px-1.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-[10px]">Toll Free</span></div></div>
          <div class="pt-space-xs mt-space-2xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm"><span>Automated SMS Sync</span><span class="font-semibold text-primary">Enrolled • Central W37</span></div>
        </div>
      </div>
    </div>

    <!-- Authority Planner -->
    <div class="flex flex-col gap-space-lg" id="authority-planner-panel">
      <div class="p-space-sm px-space-md rounded-xl bg-surface-container-low flex items-center gap-space-sm text-on-surface-variant">
        <span class="material-symbols-outlined text-primary text-[20px]">analytics</span>
        <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-space-xs text-left">
          <span class="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">Modeled Estimate</span>
          <span class="hidden sm:inline text-outline-variant">•</span>
          <span class="font-body-sm text-body-sm">Decision-support computational model for municipal resource allocation and microclimate cooling. Not medically diagnostic.</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <!-- Left: Intervention Controls -->
        <div class="lg:col-span-5 flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex flex-col"><span class="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold tracking-wider">Target Ward Configuration</span><span class="font-headline-sm text-headline-sm font-semibold text-on-surface">Ward 37 (Chandni Chawk / Old City)</span></div>
            <div class="px-space-xs py-1 rounded-md bg-secondary-container/20 text-secondary font-label-sm text-label-sm font-bold">Base Risk: 82</div>
          </div>
          <div class="h-px w-full bg-surface-container"></div>
          <div class="flex flex-col gap-space-xs"><span class="font-label-md text-label-md font-semibold text-on-surface">Select Municipal Deployments</span><span class="font-body-sm text-body-sm text-on-surface-variant">Toggle active countermeasures to dynamically update projected urban exposure indices.</span></div>
          <div class="flex flex-col gap-space-sm">
            <label class="group p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer flex items-start gap-space-sm select-none">
              <input checked class="mt-1 w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer" id="int-shelter" type="checkbox" />
              <div class="flex flex-col flex-1"><div class="flex items-center justify-between"><span class="font-label-md text-label-md font-semibold text-on-surface group-hover:text-primary transition-colors">Add Temporary Shaded Cooling Shelter</span><span class="font-label-sm text-label-sm font-medium text-primary bg-primary-fixed/40 px-1.5 py-0.5 rounded">+150 Cap</span></div><span class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Erect high-reflective tensile structures equipped with industrial misters at Sector 4 hub.</span></div>
            </label>
            <label class="group p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer flex items-start gap-space-sm select-none">
              <input checked class="mt-1 w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer" id="int-misting" type="checkbox" />
              <div class="flex flex-col flex-1"><div class="flex items-center justify-between"><span class="font-label-md text-label-md font-semibold text-on-surface group-hover:text-primary transition-colors">Deploy 2x High-Capacity Urban Misting Kiosks</span><span class="font-label-sm text-label-sm font-medium text-tertiary bg-tertiary-fixed/40 px-1.5 py-0.5 rounded">Transit Corridor</span></div><span class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Direct vapor cooling along pedestrian transfers between Metro Gate 2 and central bus bay.</span></div>
            </label>
            <label class="group p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer flex items-start gap-space-sm select-none">
              <input checked class="mt-1 w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer" id="int-hours" type="checkbox" />
              <div class="flex flex-col flex-1"><div class="flex items-center justify-between"><span class="font-label-md text-label-md font-semibold text-on-surface group-hover:text-primary transition-colors">Reschedule Outdoor Construction & Labor</span><span class="font-label-sm text-label-sm font-medium text-secondary bg-secondary-fixed/50 px-1.5 py-0.5 rounded">Peak Shift</span></div><span class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Mandatory cessation of unshaded manual labor between 12:00 PM – 4:00 PM; reallocated to twilight shifts.</span></div>
            </label>
            <label class="group p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer flex items-start gap-space-sm select-none">
              <input class="mt-1 w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer" id="int-roofs" type="checkbox" />
              <div class="flex flex-col flex-1"><div class="flex items-center justify-between"><span class="font-label-md text-label-md font-semibold text-on-surface group-hover:text-primary transition-colors">Apply Cool Roof / Albedo Coating</span><span class="font-label-sm text-label-sm font-medium text-on-surface-variant bg-surface-container-highest px-1.5 py-0.5 rounded">40 Public Roofs</span></div><span class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Coat municipality schools and community dispensaries with high-reflectance titanium emulsion.</span></div>
            </label>
          </div>
          <div class="p-space-sm rounded-xl bg-surface-container-high/40 flex flex-col gap-space-xs">
            <div class="flex justify-between items-center text-label-sm font-medium text-on-surface"><span>Mobile Hydration Van Frequency</span><span class="font-semibold text-primary" id="slider-val">Every 45 mins</span></div>
            <input class="w-full h-1.5 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary" max="90" min="15" step="15" type="range" value="45" id="hydration-slider" />
            <div class="flex justify-between text-[11px] text-on-surface-variant font-label-sm"><span>15m (Rapid)</span><span>45m (Balanced)</span><span>90m (Standard)</span></div>
          </div>
          <button class="w-full py-space-sm px-space-md rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-semibold transition-all duration-200 shadow-md flex items-center justify-center gap-space-2xs active:scale-[0.99]" id="calc-btn">
            <span class="material-symbols-outlined text-[20px]" id="sim-icon">play_circle</span>
            <span id="sim-btn-text">Run Scenario Simulation</span>
          </button>
        </div>

        <!-- Right: Outcome Metrics -->
        <div class="lg:col-span-7 flex flex-col gap-space-md">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div class="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-sm relative overflow-hidden">
              <div class="flex items-center justify-between text-on-surface-variant"><span class="font-label-sm text-label-sm font-semibold uppercase tracking-wider">Projected Area Risk Score</span><span class="material-symbols-outlined text-[18px]">speed</span></div>
              <div class="flex items-baseline gap-space-sm my-1"><span class="font-numeric-metric text-[34px] font-bold text-on-surface-variant/50 line-through" id="val-base-risk">82</span><span class="material-symbols-outlined text-primary text-[20px]">trending_down</span><span class="font-numeric-metric text-[40px] font-extrabold text-primary" id="val-projected-risk">68</span><span class="font-label-sm text-label-sm text-primary font-semibold bg-primary-fixed/50 px-2 py-0.5 rounded-full" id="val-delta-risk">-14 pts</span></div>
              <div class="w-full bg-surface-container rounded-full h-2 overflow-hidden flex"><div class="bg-secondary h-full" style="width: 82%"></div></div>
              <div class="flex justify-between items-center text-[11px] font-label-sm text-on-surface-variant"><span>Baseline: High Vulnerability</span><span class="text-primary font-semibold">Post-Intervention: Moderate</span></div>
            </div>
            <div class="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-sm relative overflow-hidden">
              <div class="flex items-center justify-between text-on-surface-variant"><span class="font-label-sm text-label-sm font-semibold uppercase tracking-wider">Population in High-Stress Zone</span><span class="material-symbols-outlined text-[18px]">groups</span></div>
              <div class="flex items-baseline gap-space-sm my-1"><span class="font-numeric-metric text-[28px] font-bold text-on-surface-variant/50 line-through">42.0k</span><span class="material-symbols-outlined text-primary text-[20px]">trending_down</span><span class="font-numeric-metric text-[36px] font-extrabold text-on-surface" id="val-pop-stress">24,500</span><span class="font-label-sm text-label-sm text-primary font-semibold bg-primary-fixed/50 px-2 py-0.5 rounded-full" id="val-pop-delta">-41%</span></div>
              <div class="w-full bg-surface-container rounded-full h-2 overflow-hidden flex"><div class="bg-primary h-full transition-all duration-500" id="bar-pop-stress" style="width: 59%"></div></div>
              <div class="flex justify-between items-center text-[11px] font-label-sm text-on-surface-variant"><span>Estimated protected: ~17,500 citizens</span></div>
            </div>
            <div class="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-sm relative overflow-hidden">
              <div class="flex items-center justify-between text-on-surface-variant"><span class="font-label-sm text-label-sm font-semibold uppercase tracking-wider">Shelter Proximity Coverage</span><span class="material-symbols-outlined text-[18px]">roofing</span></div>
              <div class="flex items-baseline gap-space-sm my-1"><span class="font-numeric-metric text-[28px] font-bold text-on-surface-variant/50">35%</span><span class="material-symbols-outlined text-primary text-[20px]">arrow_forward</span><span class="font-numeric-metric text-[36px] font-extrabold text-primary" id="val-shelter-cov">58%</span><span class="font-label-sm text-label-sm text-primary font-semibold bg-primary-fixed/50 px-2 py-0.5 rounded-full" id="val-shelter-delta">+23%</span></div>
              <div class="w-full bg-surface-container rounded-full h-2 overflow-hidden flex"><div class="bg-primary-container h-full transition-all duration-500" id="bar-shelter-cov" style="width: 58%"></div></div>
              <div class="flex justify-between items-center text-[11px] font-label-sm text-on-surface-variant"><span>5-minute walk buffer reached</span></div>
            </div>
            <div class="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-sm relative overflow-hidden">
              <div class="flex items-center justify-between text-on-surface-variant"><span class="font-label-sm text-label-sm font-semibold uppercase tracking-wider">Peak Surface Temp Delta</span><span class="material-symbols-outlined text-[18px]">device_thermostat</span></div>
              <div class="flex items-baseline gap-space-sm my-1"><span class="font-numeric-metric text-[40px] font-extrabold text-tertiary" id="val-temp-delta">-1.8°C</span><span class="font-label-sm text-label-sm text-tertiary font-semibold bg-tertiary-fixed/50 px-2 py-0.5 rounded-full">Microclimate drop</span></div>
              <div class="w-full bg-surface-container rounded-full h-2 overflow-hidden flex"><div class="bg-tertiary h-full transition-all duration-500" id="bar-temp-delta" style="width: 72%"></div></div>
              <div class="flex justify-between items-center text-[11px] font-label-sm text-on-surface-variant"><span>Wet-bulb relief focused around transit corridor</span></div>
            </div>
          </div>

          <!-- Impact Narrative -->
          <div class="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm">
            <div class="flex items-center gap-space-2xs text-primary font-label-sm font-bold uppercase tracking-wider"><span class="material-symbols-outlined text-[18px]">psychology</span>Explainable Impact Narrative & Triage Relief</div>
            <p class="font-body-md text-body-md text-on-surface leading-relaxed" id="narrative-text">Shifting outdoor work hours and activating the transit misting corridor directly mitigates wet-bulb exposure during the critical peak thermal window (14:00–16:00). This package dampens heat stroke incidence by an estimated 32% and significantly relieves pressure on local triage clinics (Ward 37 Sub-District Hospital).</p>
            <div class="pt-space-sm flex flex-col gap-space-2xs">
              <div class="flex justify-between items-center text-[12px] font-label-sm text-on-surface-variant">
                <span class="flex items-center gap-1"><span class="w-2.5 h-0.5 bg-secondary"></span> Unmanaged Baseline Heat Strain</span>
                <span class="flex items-center gap-1"><span class="w-2.5 h-0.5 bg-primary"></span> Simulated Policy Outcome</span>
              </div>
              <div class="w-full h-20 bg-surface-container-low rounded-lg p-2 flex items-end">
                <svg class="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 500 80">
                  <path class="text-secondary opacity-70" d="M 0,60 Q 120,55 200,30 T 320,10 T 420,40 T 500,65" stroke="currentColor" stroke-dasharray="4 2" stroke-width="2.5"></path>
                  <path class="text-primary" d="M 0,60 Q 120,58 200,45 T 320,32 T 420,48 T 500,65" stroke="currentColor" stroke-width="3"></path>
                  <polygon class="text-primary/10" fill="currentColor" points="200,30 320,10 420,40 420,48 320,32 200,45"></polygon>
                </svg>
              </div>
              <div class="flex justify-between text-[10px] font-label-sm text-on-surface-variant px-1"><span>10:00</span><span>12:00</span><span>14:00 (Thermal Peak)</span><span>16:00</span><span>18:00</span><span>20:00</span></div>
            </div>
          </div>

          <!-- Resource Allocation -->
          <div class="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md">
            <div class="flex items-center gap-space-md">
              <div class="w-12 h-12 rounded-xl bg-primary-container/10 text-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[26px]">water_ec</span></div>
              <div class="flex flex-col"><span class="font-headline-sm text-headline-sm font-semibold text-on-surface">Municipal Resource Allocation</span><span class="font-body-sm text-body-sm text-on-surface-variant">Estimated municipal operational expense: <strong>₹1,85,000 / week</strong> ($2,220 USD)</span></div>
            </div>
            <span class="px-space-xs py-1 rounded-full bg-surface-container font-label-sm text-label-sm font-medium text-on-surface-variant">Cost-Effectiveness Index: 9.4/10</span>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="p-space-lg rounded-xl bg-surface-container-high/70 flex flex-col md:flex-row items-center justify-between gap-space-md">
        <div class="flex items-center gap-space-sm">
          <div class="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[22px]">verified</span></div>
          <div class="flex flex-col"><span class="font-label-lg text-label-lg font-bold text-on-surface">Ready to formalize municipal directives?</span><span class="font-body-sm text-body-sm text-on-surface-variant">Transmit simulated mitigation orders directly to district emergency headquarters or export certified PDF audit.</span></div>
        </div>
        <div class="flex flex-wrap items-center gap-space-xs w-full md:w-auto justify-end">
          <button class="px-space-md py-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md font-semibold transition-colors shadow-xs flex items-center gap-space-2xs" id="btn-pdf"><span class="material-symbols-outlined text-[18px]">picture_as_pdf</span>Save Scenario as PDF Report</button>
          <button class="px-space-md py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold transition-colors shadow-sm flex items-center gap-space-2xs" id="btn-submit"><span class="material-symbols-outlined text-[18px]">send</span>Submit to Disaster Authority</button>
          <button class="px-space-md py-2.5 rounded-lg bg-surface-container-highest hover:bg-surface-container text-on-surface-variant font-label-md text-label-md font-medium transition-colors flex items-center gap-space-2xs" id="btn-share"><span class="material-symbols-outlined text-[18px]">share</span>Share with Field Teams</button>
        </div>
      </div>
    </div>
  </div>
  `;

  // Wire up interactivity
  const updateCalculations = () => {
    const shelter = container.querySelector('#int-shelter').checked;
    const misting = container.querySelector('#int-misting').checked;
    const hours = container.querySelector('#int-hours').checked;
    const roofs = container.querySelector('#int-roofs').checked;

    let baseRisk = 82, delta = 0, popReduction = 0, cov = 35, tempDrop = 0.0;
    if (shelter) { delta += 4; popReduction += 5000; cov += 15; tempDrop += 0.3; }
    if (misting) { delta += 3; popReduction += 4500; cov += 8; tempDrop += 0.7; }
    if (hours) { delta += 7; popReduction += 8000; tempDrop += 0.4; }
    if (roofs) { delta += 5; popReduction += 4000; tempDrop += 0.9; }

    const projectedRisk = Math.max(50, baseRisk - delta);
    const totalPopHighRisk = Math.max(16000, 42000 - popReduction);
    const popPercentDelta = Math.round(((42000 - totalPopHighRisk) / 42000) * 100);

    container.querySelector('#val-projected-risk').innerText = projectedRisk;
    container.querySelector('#val-delta-risk').innerText = '-' + delta + ' pts';
    container.querySelector('#val-pop-stress').innerText = totalPopHighRisk.toLocaleString();
    container.querySelector('#val-pop-delta').innerText = '-' + popPercentDelta + '%';
    container.querySelector('#val-shelter-cov').innerText = cov + '%';
    container.querySelector('#val-shelter-delta').innerText = '+' + (cov - 35) + '%';
    container.querySelector('#val-temp-delta').innerText = '-' + tempDrop.toFixed(1) + '°C';
    container.querySelector('#bar-pop-stress').style.width = Math.min(100, Math.round((totalPopHighRisk / 42000) * 100)) + '%';
    container.querySelector('#bar-shelter-cov').style.width = cov + '%';

    let narrative = "Selected intervention combination provides targeted relief. ";
    if (hours && misting) narrative += "Shifting outdoor work hours combined with the transit misting corridor sharply mitigates peak daytime heat stress, preventing acute clinical heat-stroke triage surges.";
    else if (hours) narrative += "Mandatory labor rescheduling alone substantially limits peak radiant solar load for vulnerable field workers.";
    else if (roofs) narrative += "Cool roof applications provide durable indoor ambient depression in municipal classrooms and clinic waiting areas.";
    else narrative += "Baseline operational mode. Select additional countermeasures to deepen population protection.";
    container.querySelector('#narrative-text').innerText = narrative;
  };

  // Checkbox listeners
  ['int-shelter', 'int-misting', 'int-hours', 'int-roofs'].forEach(id => {
    const el = container.querySelector('#' + id);
    if (el) el.addEventListener('change', updateCalculations);
  });

  // Slider
  const slider = container.querySelector('#hydration-slider');
  if (slider) slider.addEventListener('input', (e) => {
    container.querySelector('#slider-val').innerText = 'Every ' + e.target.value + ' mins';
    updateCalculations();
  });

  // Simulation button
  const calcBtn = container.querySelector('#calc-btn');
  if (calcBtn) calcBtn.addEventListener('click', () => {
    const text = container.querySelector('#sim-btn-text');
    const icon = container.querySelector('#sim-icon');
    calcBtn.disabled = true;
    text.innerText = 'Calculating Ward Dynamics...';
    icon.innerText = 'sync';
    icon.classList.add('animate-spin');
    setTimeout(() => {
      calcBtn.disabled = false;
      text.innerText = 'Simulation Up to Date';
      icon.innerText = 'check_circle';
      icon.classList.remove('animate-spin');
      updateCalculations();
      window.triggerToast('Hydro-thermal models converged successfully for Ward 37.');
    }, 600);
  });

  // View switcher
  const viewSwitcher = container.querySelector('#view-switcher');
  if (viewSwitcher) {
    viewSwitcher.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const citizenPanel = container.querySelector('#citizen-preview-panel');
        const authorityPanel = container.querySelector('#authority-planner-panel');
        if (btn.dataset.view === 'citizen') {
          btn.className = 'view-btn px-space-md py-1.5 rounded-full font-label-md text-label-md font-medium transition-all duration-200 bg-surface-container-lowest text-primary shadow-sm flex items-center gap-space-2xs';
          viewSwitcher.querySelector('[data-view="authority"]').className = 'view-btn px-space-md py-1.5 rounded-full font-label-md text-label-md font-medium transition-all duration-200 text-on-surface-variant hover:text-on-surface flex items-center gap-space-2xs';
          citizenPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
          citizenPanel.classList.add('ring-2', 'ring-primary');
          setTimeout(() => citizenPanel.classList.remove('ring-2', 'ring-primary'), 1200);
        } else {
          btn.className = 'view-btn px-space-md py-1.5 rounded-full font-label-md text-label-md font-medium transition-all duration-200 bg-surface-container-lowest text-primary shadow-sm flex items-center gap-space-2xs';
          viewSwitcher.querySelector('[data-view="citizen"]').className = 'view-btn px-space-md py-1.5 rounded-full font-label-md text-label-md font-medium transition-all duration-200 text-on-surface-variant hover:text-on-surface flex items-center gap-space-2xs';
          authorityPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // Action buttons
  container.querySelector('#btn-pdf')?.addEventListener('click', () => window.triggerToast('Scenario summary report downloaded as signed PDF.'));
  container.querySelector('#btn-submit')?.addEventListener('click', () => window.triggerToast('Intervention packet submitted to Disaster Management Authority.'));
  container.querySelector('#btn-share')?.addEventListener('click', () => window.triggerToast('Dispatched real-time instructions to 14 active field teams.'));
}
