# 3D Educational Blog — Dev Plan

Interactive 3D educational blog. Static-built. Path-based routing. Each route = unique directory + 2 segments: (1) a persistent 3D lesson canvas, (2) a scrollable page/content surface rendered as a reading pane beneath it.

## Docs Index

| Doc | Purpose |
|---|---|
| [01-overview.md](docs/01-overview.md) | Project vision, goals, scope |
| [02-architecture.md](docs/02-architecture.md) | System architecture, data flow |
| [03-tech-stack.md](docs/03-tech-stack.md) | Stack decisions, versions |
| [04-routing-and-paths.md](docs/04-routing-and-paths.md) | Path-based routing rules |
| [05-features.md](docs/05-features.md) | Feature map + roadmap |
| [06-design-branding.md](docs/06-design-branding.md) | Design system, brand specs |
| [07-seo.md](docs/07-seo.md) | SEO strategy + implementation |
| [08-performance.md](docs/08-performance.md) | Perf budget, optimization |
| [09-contributing.md](docs/09-contributing.md) | Contribution guide |
| [10-page-documentation-standard.md](docs/10-page-documentation-standard.md) | **MANDATORY** page doc standard |
| [11-ai-ml-segment.md](docs/11-ai-ml-segment.md) | AI/ML visualization plan |
| [12-build-and-deploy.md](docs/12-build-and-deploy.md) | Build + deploy pipeline |
| [13-analytics.md](docs/13-analytics.md) | Analytics + tracking |
| [14-testing.md](docs/14-testing.md) | Testing strategy |
| [pages/_template.md](docs/pages/_template.md) | Page doc template — copy for every new route |

## Hard Rule

Every new `/src/routes/<path>/` **MUST** ship with matching `docs/pages/<path>.md`. PR blocked without it.

## Lesson Experience

- Lesson routes use a shared split-screen shell inspired by products like Brilliant: the upper half keeps the 3D visualization visible while the lower half behaves like a readable paper/blog surface.
- Scroll progress is sourced from the article pane itself, so the scene animates even while the overall page stays visually stable.
- Each lesson pane can temporarily expand into a focused full-height mode; the scene pane exposes a scrub bar in fullscreen so animation can still be controlled without the article pane.
- Scene palettes should follow the design tokens in `docs/06-design-branding.md`, including theme-aware accent colors for axes, highlights, and helper geometry.
