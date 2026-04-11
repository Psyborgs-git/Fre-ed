# 12 — Build & Deploy

## Build
```bash
npm run build
```
Steps:
1. Vite bundles React + MDX
2. `vite-plugin-pages` scans `/src/routes`
3. Prerender plugin emits static HTML per route
4. Sitemap + RSS generated from manifest
5. Output → `/dist`

## Output Shape
```
/dist
  index.html
  blog/index.html
  about/index.html
  perceptron/index.html
  ai-ml/index.html
  ai-ml/perceptron/index.html
  assets/*.js  *.css  *.glb
  sitemap.xml
  rss.xml
  robots.txt
```

## Deploy — Vercel (primary)
- Connect repo
- Framework preset: Vite
- Build command: `npm run build`
- Output: `dist`
- Env vars: none required in v1
- `vercel.json` for redirects + headers

## Deploy — Netlify (fallback)
Identical `dist` works. `netlify.toml`:
```
[build]
  command = "npm run build"
  publish = "dist"
```

## Headers (Vercel `vercel.json`)
```json
{
  "headers": [
    { "source": "/assets/(.*)", "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
    ]},
    { "source": "/(.*)", "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
    ]}
  ]
}
```

## CI (GitHub Actions)
`.github/workflows/ci.yml`:
- install → lint → typecheck → test → build → check:docs → lighthouse
- Fail PR on any step

## Preview Deploys
Vercel auto-previews every PR. Link posted in PR comment.

## Release
- `main` branch = production
- Tag releases `v0.1.0`, `v0.2.0`, …
- Changelog in `CHANGELOG.md`

## Rollback
Vercel → promote previous deploy. No DB migrations, so rollback = instant.
