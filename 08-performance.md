# 08 — Performance

## Budgets
| Metric | Target |
|---|---|
| LCP | < 2.5s |
| CLS | < 0.05 |
| INP | < 200ms |
| JS (initial) | < 180kb gz |
| JS (per route) | < 250kb gz |
| Three.js chunk | lazy, < 400kb gz |
| Scene FPS | ≥ 45 mid-tier GPU |

## Techniques
- **Code split** per route via `React.lazy` + `Suspense`
- **Lazy 3D**: `Canvas` only mounts when segment A intersects viewport
- **Static prerender** all routes (no SSR runtime cost)
- **Asset optimization**:
  - Models: draco-compressed `.glb`
  - Textures: KTX2 / Basis
  - Images: AVIF/WebP with `<picture>`
- **Font**: self-host, `font-display: swap`, subset
- **Shaders**: inline small, chunk large
- **Tree-shake** Three.js: import only what you use
- **Disable shadows** on mobile / low-end
- **Pixel ratio cap**: `gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))`

## Reduced Motion
`prefers-reduced-motion: reduce` →
- Lenis disabled
- Scene freezes at first keyframe
- Framer Motion `transition={{ duration: 0 }}`

## Monitoring
- Vercel Analytics Web Vitals
- Lighthouse CI in GH Actions on every PR
- Budget check: fail CI if JS > budget

## GPU Tiering
Detect via `navigator.hardwareConcurrency` + `gl.getParameter(UNMASKED_RENDERER)`:
- Tier A: full effects (bloom, AA, shadows)
- Tier B: no post, no shadows
- Tier C: static poster image fallback
