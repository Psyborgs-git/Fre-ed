# 05 — Features

## Core Features (v1)

### F1 — Path-Based Static Routing
Every directory → static HTML. No SSR server.

### F2 — Two-Segment Page Model
Segment A: persistent 3D lesson canvas. Segment B: scrollable content “paper”. Shared pane-based scroll progress keeps the canvas visible while readers move through the lesson. Both panes can expand into a focused fullscreen state; scene fullscreen swaps scroll-driving for a scrub bar.

### F3 — 3D Scene Engine
- R3F + Three.js canvas per route
- Scroll-linked camera rigs
- Shared primitives: `<OrbitRig>`, `<ScrollCamera>`, `<GlslPlane>`
- Shader material library

### F4 — MDX Content
- Prose + React components inline
- Shiki syntax highlight
- KaTeX math
- Callouts, asides, diagrams
- Reading-optimized article chrome inside the split lesson shell

### F5 — Smooth Scroll
Lenis + IntersectionObserver. ScrollContext publishes progress to scene.

### F6 — Blog Index & Tags
Auto-generated from route manifest.

### F7 — Search
Client-side Fuse.js over build-time JSON index.

### F8 — SEO
Per-route meta, Open Graph, JSON-LD, sitemap, robots.txt. See doc 07.

### F9 — AI/ML Segment
Dedicated hub at `/ai-ml`. See doc 11.

### F10 — Page Doc Enforcement
CI check: every `/src/routes/<path>` must have `/docs/pages/<path>.md`.

## Feature Roadmap

| Phase | Features | Target |
|---|---|---|
| **P0 Bootstrap** | Vite+React+Tailwind, routing, layout | Week 1 |
| **P1 3D Core** | R3F canvas, Lenis, first scene | Week 2 |
| **P2 Content** | MDX, 2 sample posts, blog index | Week 3 |
| **P3 SEO + Build** | Sitemap, meta, static prerender | Week 4 |
| **P4 AI/ML MVP** | Perceptron + MLP scenes | Week 5–6 |
| **P5 Launch** | 10 posts, analytics, polish | Week 7–8 |
| **P6 v2** | Search, playgrounds, i18n | Post-launch |

## Feature Flags
Simple const map in `src/lib/flags.js`. No runtime flag service in v1.
