# 09 — Contributing

## Prereqs
- Node 20+
- pnpm or npm
- Git

## Setup
```bash
git clone <repo>
cd blog
npm install
npm run dev
```

## Branch Naming
- `feat/<short-desc>`
- `fix/<short-desc>`
- `post/<kebab-path>` — new article
- `docs/<short-desc>`

## Commit Style
Conventional commits:
```
feat(routes): add perceptron article
fix(three): clamp pixel ratio on mobile
docs(pages): document cnn-from-scratch route
```

## Adding A New Article (MANDATORY flow)
1. Branch `post/my-new-topic`
2. `mkdir src/routes/my-new-topic`
3. Add `Scene.jsx`, `Page.mdx`, `meta.js`, `assets/`
4. **Copy `docs/pages/_template.md` → `docs/pages/my-new-topic.md`** and fill it out
5. `npm run dev` — check both segments
6. `npm run build` — verify static HTML
7. `npm run check:docs` — verify doc coverage
8. Push + open PR

## PR Checklist (auto-inserted)
- [ ] Route directory follows kebab-case
- [ ] `meta.js` has title, description, tags, cover, dates
- [ ] `Scene.jsx` respects `prefers-reduced-motion`
- [ ] `Page.mdx` content is accessible without 3D
- [ ] `docs/pages/<path>.md` exists and is filled out
- [ ] Lighthouse perf ≥ 85
- [ ] No new dependencies without justification in PR body

## CI Gates
- Lint + format
- Type check
- Unit tests
- Build succeeds
- `check:docs` passes
- Lighthouse CI ≥ budgets

## Code Review
- One reviewer minimum
- Review focuses on: perf, a11y, doc completeness
- Squash merge

## License
MIT unless stated otherwise. Contributors agree to the CLA in `CONTRIBUTING.md`.
