/**
 * Thin wrapper around Vercel Analytics.
 * All event tracking goes through this function so we can swap the
 * underlying provider without touching call sites.
 *
 * Events defined in docs/13-analytics.md.
 */
export const track = (event, props = {}) => {
  if (typeof window === 'undefined') return;
  // Vercel Analytics injects `window.va` on the client
  window.va?.('event', { name: event, ...props });
};

// ── Typed event helpers ───────────────────────────────────────────

export const trackRouteView = (path) => track('route_view', { path });

export const trackSceneReady = (path) => track('scene_ready', { path });

export const trackScrollDepth = (path, depth) =>
  track('scroll_depth', { path, depth });

export const trackSceneInteraction = (path, type) =>
  track('scene_interaction', { path, type });

export const trackCodeCopy = (path, snippet) =>
  track('code_copy', { path, snippet });
