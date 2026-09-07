const API_BASE = window.HEATSHIELD_API_URL || 'http://127.0.0.1:8000';

function replaceTextEverywhere(from, to) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    if (node.nodeValue && node.nodeValue.includes(from)) {
      node.nodeValue = node.nodeValue.split(from).join(to);
    }
  }
}

function riskLabel(level) {
  return level ? level.toUpperCase() : 'UNKNOWN';
}

function formatUpdated(value) {
  if (!value) return 'Live update unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : `Updated ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })} IST`;
}

function formatPeakTime(value) {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(11, 16);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });
}

export async function loadLiveDashboard(locationId = 1) {
  try {
    const response = await fetch(`${API_BASE}/api/live/overview?location_id=${locationId}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`API ${response.status}`);
    const data = await response.json();
    const current = data.current;
    const risk = riskLabel(current.risk_level);

    replaceTextEverywhere('REST Mock Stream', 'LIVE • Open-Meteo');
    replaceTextEverywhere('38.4°C', `${Number(current.temperature).toFixed(1)}°C`);
    replaceTextEverywhere('43.1°C', `${Number(current.apparent_temperature).toFixed(1)}°C`);
    replaceTextEverywhere('61%', `${Math.round(current.humidity)}%`);
    replaceTextEverywhere('78 / 100', `${Number(current.thermal_score).toFixed(0)} / 100`);
    replaceTextEverywhere('11 km/h', `${Number(current.wind_speed).toFixed(1)} km/h`);
    replaceTextEverywhere('CURRENT HEAT RISK: HIGH (Level 3 of 4)', `CURRENT HEAT RISK: ${risk} (${Number(current.final_score).toFixed(0)} / 100)`);
    replaceTextEverywhere('Updated 4 min ago', formatUpdated(data.updated_at));
    replaceTextEverywhere('Target Area: Delhi Central & East Sectors', `Target Area: ${data.location.name}`);

    const peakStart = formatPeakTime(data.peak.timestamp);
    const peakDate = new Date(data.peak.timestamp);
    const peakEndDate = new Date(peakDate.getTime() + 60 * 60 * 1000);
    const peakEnd = Number.isNaN(peakEndDate.getTime()) ? '--' : peakEndDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });
    replaceTextEverywhere('14:00 — 17:00 IST', `${peakStart} — ${peakEnd} IST`);

    document.documentElement.dataset.liveWeather = 'connected';
    return data;
  } catch (error) {
    console.warn('HeatShield live data unavailable:', error);
    document.documentElement.dataset.liveWeather = 'offline';
    return null;
  }
}

export async function loadLiveRiskMap() {
  const response = await fetch(`${API_BASE}/api/live/risk-map`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json();
}

export { API_BASE };
