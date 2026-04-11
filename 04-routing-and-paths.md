# 04 — Routing & Paths

## Rule
One directory = one path = one static HTML file.

```
/src/routes/intro-to-linear-algebra/  →  /intro-to-linear-algebra/index.html
/src/routes/perceptron/                →  /perceptron/index.html
/src/routes/cnn-from-scratch/          →  /cnn-from-scratch/index.html
```

## Path Naming
- kebab-case only: `attention-is-all-you-need` ✔ `Attention_Is_All` ✘
- No trailing slashes in links.
- No dynamic segments in v1. Every path is static + unique.
- URL must match directory name exactly.

## Required Files Per Route
```
/src/routes/<path>/
  Scene.jsx        ← default export = 3D segment component
  Page.mdx         ← default export = content segment
  meta.js          ← { title, description, tags, cover, published, updated, author }
  assets/          ← optional: models, images, shaders
```

## Route Manifest
Generated at build time from `/src/routes/*/meta.js`. Used for:
- Sitemap
- Blog index
- Tag pages
- Search index

## Adding A New Route — Checklist
1. `mkdir src/routes/<kebab-path>`
2. Add `Scene.jsx`, `Page.mdx`, `meta.js`
3. **Create `docs/pages/<kebab-path>.md`** from `docs/pages/_template.md`
4. Run `npm run dev` — verify scene + content render
5. Run `npm run build` — verify static HTML emitted
6. PR. CI blocks merge if doc missing (see `scripts/check-docs.js`).

## Reserved Paths
- `/` — home
- `/blog` — index
- `/tags/<tag>` — auto-generated tag pages
- `/about`
- `/ai-ml` — AI/ML segment hub (see doc 11)

## Redirects
Define in `vercel.json`. Log redirects in `docs/redirects.md`.
