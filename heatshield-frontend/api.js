export const API_BASE = window.HEATSHIELD_API_URL || 'http://127.0.0.1:8000';

const CACHE_KEY = 'heatshield-live-cache-v2';

export async function apiGet(path, { retries = 1 } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`API ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < retries) await new Promise(r => setTimeout(r, 300 * (attempt + 1)));
    }
  }
  throw lastError;
}

export function saveCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: new Date().toISOString(), data }));
  } catch (_) {}
}

export function loadCache() {
  try {
    const value = localStorage.getItem(CACHE_KEY);
    return value ? JSON.parse(value) : null;
  } catch (_) {
    return null;
  }
}

export function cacheAgeMs(cacheEntry) {
  if (!cacheEntry || !cacheEntry.savedAt) return null;
  return Date.now() - new Date(cacheEntry.savedAt).getTime();
}

export function formatCacheAge(cacheEntry) {
  const ms = cacheAgeMs(cacheEntry);
  if (ms == null) return 'unknown time';
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function formatTimeIST(value) {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    const cleaned = String(value).replace('T', ' ').slice(11, 16);
    return cleaned || '--';
  }
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });
}

export function formatDateTimeIST(value) {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 16).replace('T', ' ');
  return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });
}

export function riskClass(level) {
  const l = String(level || '').toLowerCase();
  if (l === 'extreme' || l === 'critical' || l === 'severe') return 'bg-error-container text-on-error-container';
  if (l === 'high') return 'bg-secondary-fixed text-on-secondary-fixed';
  if (l === 'moderate') return 'bg-secondary-container/20 text-on-secondary-container';
  return 'bg-primary-fixed text-on-primary-fixed';
}

export function riskBarClass(level) {
  const l = String(level || '').toLowerCase();
  if (l === 'extreme' || l === 'critical' || l === 'severe') return 'bg-error';
  if (l === 'high') return 'bg-secondary';
  if (l === 'moderate') return 'bg-secondary-container';
  return 'bg-primary-container';
}

export function riskTextClass(level) {
  const l = String(level || '').toLowerCase();
  if (l === 'extreme' || l === 'critical' || l === 'severe') return 'text-error';
  if (l === 'high') return 'text-secondary';
  if (l === 'moderate') return 'text-on-secondary-container';
  return 'text-tertiary';
}

export function num(value, digits = 1) {
  const n = Number(value);
  if (Number.isNaN(n)) return '--';
  return n.toFixed(digits);
}

export const CONNECTION = {
  CONNECTING: 'connecting',
  LIVE: 'live',
  OFFLINE: 'offline',
  ERROR: 'error',
};
