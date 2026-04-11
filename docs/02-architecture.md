# 02 — Architecture

## High-Level

```
┌─────────────────────────────────────────────────┐
│  Browser                                        │
│  ┌──────────────┐    ┌─────────────────────┐    │
│  │ React Shell  │───▶│ Route (static HTML) │    │
│  └──────────────┘    └─────────────────────┘    │
│         │                     │                 │
│         ▼                     ▼                 │
│  ┌──────────────┐    ┌─────────────────────┐    │
│  │ R3F / Three  │    │ MDX content + code  │    │
│  │ Canvas       │    │ blocks              │    │
│  └──────────────┘    └─────────────────────┘    │
│         │                                       │
│         ▼                                       │
│  ┌──────────────────────────────────────────┐   │
│  │ Lenis smooth-scroll + IntersectionObs.   │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
         │
         ▼
  Vercel Edge (static CDN)
```

## Page = Two Segments

Each route renders two stacked segments in one viewport-scroll experience:

1. **Segment A — 3D Interactive Scene**
   - `<Canvas>` from `@react-three/fiber`
   - Scene-specific React component: `src/routes/<path>/Scene.jsx`
   - Scroll-linked camera + object animations (Lenis → IO → state)
2. **Segment B — Page Code/Content**
   - MDX or JSX: `src/routes/<path>/Page.jsx`
   - Prose, code blocks (Shiki highlight), diagrams, citations

A shared `<RouteLayout>` stitches the two together, wires scroll progress, and handles lazy loading.

## Directory Layout

```
/src
  /routes
    /intro-to-linear-algebra
      Scene.jsx          ← segment 1 (3D)
      Page.mdx           ← segment 2 (content)
      meta.js            ← title, desc, tags, cover
      assets/            ← models, textures, shaders
    /perceptron
      Scene.jsx
      Page.mdx
      meta.js
  /components             ← shared UI
  /three                  ← shared 3D primitives, shaders, hooks
  /lib                    ← utils (scroll, mdx, seo)
  /styles                 ← tailwind + globals
/docs
  /pages                  ← one .md per route (MANDATORY)
/public
  /static                 ← pre-rendered HTML per route
```

## Build-Time Route Discovery

`vite-plugin-pages` scans `/src/routes/*/` → generates route manifest → emits static HTML per path via `vite-plugin-ssg` (or react-router + prerender). One `index.html` per directory.

## Runtime Flow

1. User hits `/perceptron`
2. CDN serves pre-rendered HTML + critical CSS
3. React hydrates shell → mounts `<RouteLayout>`
4. `Scene.jsx` code-split chunk loads via `React.lazy`
5. Lenis initializes smooth scroll
6. IntersectionObserver fires scene-progress updates → Three.js animates

## Data Flow

- No global store needed for v1.
- Scroll progress: `ScrollContext` (React context) feeds segment-A scene hooks.
- Theme + metadata: static per-route `meta.js`.

## Boundaries / Isolation

- 3D code never imports from page content.
- Page content never imports scene internals.
- Shared primitives live in `/src/three`.
