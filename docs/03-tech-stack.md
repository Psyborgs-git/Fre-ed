# 03 — Tech Stack

## Frontend
| Layer | Choice | Version (min) | Why |
|---|---|---|---|
| Framework | React | 18.3 | Component model |
| Build | Vite | 5.x | Fast, static output |
| 3D | Three.js | r160+ | Core renderer |
| 3D wrapper | @react-three/fiber | 8.x | Declarative Three in React |
| 3D helpers | @react-three/drei | 9.x | Cameras, loaders, controls |
| Animation | Framer Motion | 11.x | UI + scroll animations |
| Animation alt | Anime.js | 3.x | GSAP-free timelines |
| Smooth scroll | Lenis | 1.x | RAF-driven smooth scroll |
| Scroll detect | IntersectionObserver | native | Segment visibility |
| Styling | Tailwind CSS | 3.4+ | Utility-first |
| Content | MDX | 3.x | Prose + React inside |
| Routing | react-router + file-based plugin | 6.x | Path-per-directory |

## Optional / Upgrade Path
- **GSAP ScrollTrigger** — if Lenis + IO not enough
- **Babylon.js** — swap for Three if physics/heavy scenes needed
- **Cannon-es** — physics
- **Custom GLSL shaders** — in `/src/three/shaders`

## Build / Deploy
- **Vercel** (primary) — auto-deploy on push
- **Netlify** (fallback) — identical static output works

## Analytics
- **Vercel Analytics** — page views, Web Vitals
- **Hotjar** — scroll heatmaps, session recordings

## Dev Tooling
| Tool | Use |
|---|---|
| ESLint + eslint-plugin-react | Lint |
| Prettier | Format |
| TypeScript (optional) | Types for `/src/three` + `/src/lib` |
| Vitest | Unit tests |
| Playwright | E2E smoke tests |
| Husky + lint-staged | Pre-commit |

## Minimal Bootstrap
```
npm create vite@latest blog -- --template react
npm i three @react-three/fiber @react-three/drei lenis framer-motion
npm i -D tailwindcss postcss autoprefixer @mdx-js/rollup vite-plugin-pages
```

## Version Pinning
Pin major versions in `package.json`. Lock via `package-lock.json`. Renovate bot for PR updates.
