/**
 * Privacy-First Project Activity Tracker
 * Tracks individual project interactions (card views, details views, GitHub clicks, Live Demo clicks)
 * using completely anonymous, non-identifiable session tokens.
 * Zero browser fingerprinting, zero cookies, zero PII.
 */

import { portfolioApi } from './api';

const SESSION_KEY = 'portfolio_anon_session_token';
const CARD_VIEW_SESSION_KEY = 'portfolio_tracked_card_views';

// In-memory set to prevent duplicate recordings during React re-renders
const trackedEventsInMemory = new Set();
const lastClickTimestamps = new Map();

/**
 * Retrieves or generates an anonymous session token stored strictly in localStorage.
 */
export function getAnonymousSessionToken() {
  try {
    let token = localStorage.getItem(SESSION_KEY);
    if (!token) {
      token = 'anon_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem(SESSION_KEY, token);
    }
    return token;
  } catch (e) {
    return 'anon_fallback_' + Math.random().toString(36).substring(2, 9);
  }
}

/**
 * Detects device category from navigator.userAgent without device fingerprinting.
 */
export function detectDeviceType() {
  if (typeof navigator === 'undefined') return 'Desktop';
  const ua = navigator.userAgent || '';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

/**
 * Detects clean browser name from userAgent.
 */
export function detectBrowser() {
  if (typeof navigator === 'undefined') return 'Browser';
  const ua = navigator.userAgent || '';

  if (ua.includes('Edg/')) return 'Microsoft Edge';
  if (ua.includes('OPR/') || ua.includes('Opera/')) return 'Opera';
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Google Chrome';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  if (ua.includes('Firefox/')) return 'Mozilla Firefox';
  return 'Modern Browser';
}

/**
 * Determines traffic referral source.
 */
export function detectTrafficSource() {
  if (typeof window === 'undefined') return 'Direct';

  // Check URL query parameters (e.g., ?utm_source=linkedin or ?ref=github)
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = params.get('utm_source') || params.get('ref') || params.get('source');
    if (utm) {
      const lower = utm.toLowerCase();
      if (lower.includes('linkedin')) return 'LinkedIn';
      if (lower.includes('github')) return 'GitHub';
      if (lower.includes('google')) return 'Google';
      if (lower.includes('twitter') || lower.includes('x')) return 'Twitter / X';
      return utm;
    }
  } catch (e) {}

  // Check document referrer
  const referrer = typeof document !== 'undefined' ? document.referrer : '';
  if (!referrer) return 'Direct';

  try {
    const refUrl = new URL(referrer);
    const host = refUrl.hostname.toLowerCase();
    if (host.includes(window.location.hostname)) return 'Direct';
    if (host.includes('linkedin.com')) return 'LinkedIn';
    if (host.includes('github.com')) return 'GitHub';
    if (host.includes('google.')) return 'Google';
    if (host.includes('t.co') || host.includes('twitter.com') || host.includes('x.com')) return 'Twitter / X';
    if (host.includes('instagram.com')) return 'Instagram';
    if (host.includes('youtube.com')) return 'YouTube';
    return host.replace(/^www\./, '');
  } catch (e) {
    return 'Referral';
  }
}

/**
 * Main tracking function to record a project interaction.
 *
 * @param {Object} options
 * @param {number|string} options.projectId - ID of the project
 * @param {string} options.projectName - Display name of the project
 * @param {'card_view'|'view_details'|'github_click'|'live_demo_click'} options.action - Action performed
 */
export function trackProjectActivity({ projectId, projectName, action }) {
  if (!projectName) return;

  const validAction = action || 'card_view';
  const dedupKey = `${projectId}_${projectName}_${validAction}`;

  // 1. Duplicate prevention for card_view: track only once per browser session per project
  if (validAction === 'card_view') {
    if (trackedEventsInMemory.has(dedupKey)) {
      return; // Already tracked during this runtime session
    }
    try {
      const sessionStore = sessionStorage.getItem(CARD_VIEW_SESSION_KEY) || '';
      if (sessionStore.includes(`[${dedupKey}]`)) {
        trackedEventsInMemory.add(dedupKey);
        return; // Already tracked in this browser session
      }
      sessionStorage.setItem(CARD_VIEW_SESSION_KEY, sessionStore + `[${dedupKey}]`);
    } catch (e) {}
    trackedEventsInMemory.add(dedupKey);
  }

  // 2. Debounce rapid repeat button clicks (e.g. double-clicks within 1.5s)
  if (validAction !== 'card_view') {
    const now = Date.now();
    const lastClick = lastClickTimestamps.get(dedupKey) || 0;
    if (now - lastClick < 1500) {
      return; // Ignore rapid debounce
    }
    lastClickTimestamps.set(dedupKey, now);
  }

  const payload = {
    sessionToken: getAnonymousSessionToken(),
    projectId: String(projectId || 0),
    projectName: String(projectName),
    action: validAction,
    deviceType: detectDeviceType(),
    browser: detectBrowser(),
    trafficSource: detectTrafficSource()
  };

  // Dispatch asynchronously without blocking UI
  portfolioApi.trackProjectActivity(payload).catch(err => {
    // Non-fatal logging for tracking
    console.debug('[Tracker] Project activity log completed.', err);
  });
}
