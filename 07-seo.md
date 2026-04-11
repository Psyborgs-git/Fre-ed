# 07 — SEO

## Strategy
Static HTML per route. Crawlable without JS. Rich meta. Structured data.

## Per-Route Meta (from `meta.js`)
```js
export default {
  title: "Perceptron — Build It From Scratch",
  description: "Interactive 3D walkthrough of a perceptron...",
  tags: ["ml", "neural-networks", "fundamentals"],
  cover: "/brand/og/perceptron.png",
  published: "2026-01-15",
  updated: "2026-01-20",
  author: "Jane Doe",
  canonical: "https://site.com/perceptron"
}
```

## Required `<head>` Tags
- `<title>` → `meta.title`
- `<meta name="description">`
- `<link rel="canonical">`
- Open Graph: `og:title`, `og:description`, `og:image`, `og:type=article`, `og:url`
- Twitter: `twitter:card=summary_large_image`
- `<meta name="author">`
- `<meta name="robots" content="index,follow">`

## Structured Data (JSON-LD)
Inject per article page as `<script type="application/ld+json">`:
- `@type: Article` with headline, image, datePublished, dateModified, author, publisher

## Sitemap
- Generate `sitemap.xml` at build from route manifest
- Include lastmod from `meta.updated`
- Submit to Google Search Console + Bing Webmaster

## Robots
```
User-agent: *
Allow: /
Sitemap: https://site.com/sitemap.xml
```

## RSS
Emit `/rss.xml` at build from route manifest.

## Content SEO
- One H1 per page (title)
- H2/H3 hierarchy inside MDX
- Alt text required on all `<img>`, `<Figure>`
- Internal linking between related posts (tags drive this)
- Slug = kebab path = URL = stable forever (never rename)

## Technical SEO
- Preload critical fonts
- `<link rel="preconnect">` to CDN
- Lazy-load 3D chunks (below-fold OK — crawlers see content segment)
- Ensure content segment (segment B) is in initial HTML, not JS-only

## Monitoring
- Google Search Console
- Vercel Analytics Web Vitals
- Monthly audit with Lighthouse CI in GitHub Actions
