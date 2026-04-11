# 14 — Testing

## Layers
| Layer | Tool | Scope |
|---|---|---|
| Unit | Vitest | `/src/lib`, hooks, utils |
| Component | Vitest + Testing Library | UI components (Nav, Callout, CodeBlock) |
| Visual | Playwright screenshots | Route smoke + scene stills |
| E2E | Playwright | Nav, search, scroll |
| Perf | Lighthouse CI | Budgets per route |
| Docs | `scripts/check-docs.js` | Doc coverage |

## Unit
Fast, no DOM for pure logic. 80% coverage target on `/src/lib`.

## Scene Testing
3D scenes are hard to unit-test. Strategy:
- Unit-test the hooks (`useScrollProgress`, `useLayerLayout`)
- Visual snapshot of scene at scroll=0, 0.5, 1.0 via Playwright
- Assert canvas mounts + no console errors

## E2E Smoke
Playwright runs after build:
1. Load every route from manifest
2. Assert `<h1>` present
3. Assert canvas present (or reduced-motion fallback)
4. Assert no 404s on assets

## Lighthouse CI
`.lighthouserc.json` with budgets from doc 08. Fail PR if regressed.

## Docs Coverage
`npm run check:docs` — see doc 10.

## Manual QA Checklist (pre-release)
- [ ] Reduced-motion works
- [ ] Mobile Safari scene renders
- [ ] Keyboard nav through page
- [ ] Dark mode colors pass contrast
- [ ] All routes in sitemap
