# 10 — Page Documentation Standard (MANDATORY)

## Rule
**No route ships without its doc. No exceptions.**

Every `/src/routes/<path>/` requires a paired `/docs/pages/<path>.md`. CI enforces this via `scripts/check-docs.js`.

## Why
Future devs need context the code can't carry: *why* this topic, *why* this scene, *what* the user should feel, *what* was tried and discarded. Without the doc, the route becomes unmaintainable in 6 months.

## Template
See `docs/pages/_template.md`. Copy it. Fill every section. No placeholders left behind.

## Enforcement Script
`scripts/check-docs.js`:
```js
// pseudocode
const routes = fs.readdirSync('src/routes');
const docs = fs.readdirSync('docs/pages').map(f => f.replace('.md',''));
const missing = routes.filter(r => !docs.includes(r) && r !== '_shared');
if (missing.length) {
  console.error('Missing docs for:', missing);
  process.exit(1);
}
```
Run in pre-commit + CI.

## Required Sections (all must be filled)
1. **Route** — path + title
2. **Learning goal** — what user walks away knowing
3. **Scene concept** — 3D idea + camera arc + palette choices
4. **Scroll choreography** — what happens at 0%, 25%, 50%, 75%, 100% scroll, which pane owns the scroll, and any alternative interaction modes (for example scene fullscreen scrubbers)
5. **Content outline** — H2s of segment B
6. **Assets** — models, textures, shaders used
7. **Dependencies** — any shared components pulled in
8. **Performance notes** — poly count, shader cost, mobile strategy
9. **Accessibility notes** — reduced-motion fallback, alt content
10. **Open questions / future work**
11. **Changelog** — date + author for each edit

## Update Policy
- Edit the doc in the same PR as the code change.
- Append to Changelog section, don't overwrite.
- If you change the shared lesson shell, update the affected page docs so the documented reading/scene choreography still matches reality.

## Doc ≠ Blog Content
The page doc is *for developers*, not readers. It explains the machinery. The blog content lives in `Page.mdx`.
