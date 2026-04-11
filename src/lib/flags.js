/**
 * Feature flags — simple const map, no runtime flag service in v1.
 * Toggle features here during development before they're production-ready.
 */
export const flags = {
  /** Enable Lenis smooth scroll (true = smooth, false = native scroll) */
  smoothScroll: true,

  /** Show search UI in nav (Fuse.js, v2 feature) */
  search: false,

  /** Show playground links on AI/ML pages (v2 feature) */
  playground: false,

  /** Enable Hotjar session recordings (requires consent banner) */
  hotjar: false,
};
