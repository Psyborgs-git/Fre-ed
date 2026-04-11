# 06 — Design & Branding

## Brand
- **Name:** Fre-ed
- **Tone:** curious, precise, playful, never condescending
- **Voice:** short sentences. Intuition first, math second.

## Color Tokens
Define in `tailwind.config.js` under `theme.extend.colors`.

| Token | Hex | Use |
|---|---|---|
| `bg.base` | `#0a0a0f` | Page background |
| `bg.elev` | `#15151d` | Card, elevated |
| `ink.hi` | `#f5f5f7` | Primary text |
| `ink.lo` | `#9a9aa8` | Secondary text |
| `accent.cyan` | `#22d3ee` | Primary accent |
| `accent.violet` | `#a78bfa` | Secondary accent |
| `accent.warn` | `#f59e0b` | Warning/highlight |
| `line` | `#26262f` | Borders |

Dark mode is default. Light mode v2.

## Typography
| Role | Font | Weight |
|---|---|---|
| Display | Inter / Space Grotesk | 600–700 |
| Body | Inter | 400–500 |
| Mono | JetBrains Mono | 400–600 |

Sizes via Tailwind scale. Line-height `1.6` for prose, `1.2` for display.

## Spacing
Tailwind default 4px grid. Page max-width `72ch` for prose segment.

## Lesson Shell
- Layout inspiration: modern education products such as Brilliant — not copied, but matched in clarity and “always-visible visual” behavior.
- Route shell: fixed nav, upper canvas pane, lower scrollable article pane.
- Content pane should feel like a readable paper/card surface with generous padding, rounded corners, and a strong visual seam between scene and prose.
- The content pane, not the window, owns scroll progress for scene choreography.

## 3D Visual Language
- Low-poly + clean PBR
- Background: deep navy gradient
- Object palette: cyan/violet/white anchors with warm amber/orange highlights for active vectors or attention points
- Bloom post-processing (subtle)
- No heavy particle spam

### Scene Palette Rules
- X-axis / primary structure → cyan family
- Y-axis / secondary structure → violet family
- Neutral scaffolding / z-axis / anchors → white to slate family
- Focus vectors / active states → amber or orange family
- Grid / helper geometry → low-contrast tints of the active theme
- Light theme scenes may still use a dark or atmospheric canvas background, but interactive objects should adapt to the current theme token set

## Components
Build in `/src/components`:
- `<Nav>`, `<Footer>`, `<RouteLayout>`
- `<Callout>`, `<CodeBlock>`, `<Figure>`, `<Math>`
- `<TagPill>`, `<PostCard>`, `<ReadingProgress>`

## Accessibility
- WCAG AA contrast minimum
- All 3D scenes must have a text alternative in segment B
- `prefers-reduced-motion` → disable scroll embellishment and freeze non-essential scene animations
- Keyboard focus visible on all interactive elements
- Split lesson panes must keep the reading surface keyboard-focusable and scrollable
- `<Canvas>` wrapped with `aria-hidden` + labeled fallback

## Logo / Favicon
- SVG logo in `/public/brand/`
- Favicon set: 16, 32, 180 (apple), 512 (maskable)

## Brand Assets Folder
```
/public/brand/
  logo.svg
  logo-mark.svg
  og-default.png      ← 1200x630
  favicon.svg
```
