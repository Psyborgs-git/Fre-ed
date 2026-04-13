# Page Doc — `intro-to-linear-algebra`

## 1. Route
- **Path:** `/intro-to-linear-algebra`
- **Title:** Introduction to Linear Algebra
- **Author:** Fre-ed Team
- **Published:** 2026-04-11
- **Last updated:** 2026-04-11

## 2. Learning Goal
The reader leaves with a spatial intuition for vectors (arrows in space), matrices
(space-transforming functions), and the dot product — building the foundation needed for
every subsequent ML article on the site.

## 3. Scene Concept
- **Core visual metaphor:** A 3D coordinate system showing the three basis vectors î, ĵ, k̂
  as coloured arrows, with a custom amber vector that appears on scroll as a linear combination.
- **Camera arc:** Starts at `[4, 3, 4]` looking at origin; gentle auto-rotation on Y axis;
  OrbitControls let the user explore freely. No forced camera movement.
- **Lesson shell:** The scene stays pinned in the upper pane while the article scrolls in the lower
  reading pane, mirroring the “visual always in view” rhythm of modern educational products.
- **Alternate modes:** Both panes expose a focus/fullscreen action. Scene fullscreen keeps the
  canvas in view and replaces scroll-driven progression with an on-canvas scrub bar; content
  fullscreen gives the article a distraction-free reading state.
- **Key objects:**
  - Cyan arrow → x-axis basis vector î
  - Violet arrow → y-axis basis vector ĵ
  - White arrow → z-axis basis vector k̂
  - Amber arrow → user vector $\vec{v}$ (grows from 0 as scroll progresses)
  - Dashed amber projection lines from $\vec{v}$ tip to each axis
  - Cyan wireframe plane overlay at 60 %+ scroll (transformation hint)
  - Grid floor for spatial grounding
- **Color / mood:** Theme-aware palette. Dark mode uses a deep navy background with cyan/violet key
  lights and amber focus accents; light mode softens the background and grid while preserving the
  cyan/violet/amber semantic mapping for axes, transforms, and active vectors.

## 4. Scroll Choreography
| Scroll % | What happens | Camera | Objects |
|---|---|---|---|
| 0 % | Basis vectors static, amber vector hidden; overlay introduces the lesson | `[4.35, 3.15, 4.4]` | î, ĵ, k̂ visible; grid floor |
| 25 % | Amber vector fades in, grows proportionally to progress | Auto-rotates slowly unless reduced motion is enabled | Linear combination appears |
| 50 % | Dashed projection lines visible, amber at ~half length | Same | Projections onto axes; chapter chips advance |
| 60 % | Wireframe transformation plane starts fading in | Same | Plane at low opacity |
| 75 % | Plane solidifying, amber vector at full length | Same | Full scene |
| 100 % | All elements at peak opacity, plane tilted 45° | Same | Complete composition |

**Scroll owner:** the lower article pane drives progress; the browser window itself should remain visually stable while reading.

**Fullscreen behavior:** when the scene pane is expanded, the scrub bar becomes the primary progress controller and syncs back into the hidden article pane. `Esc` restores the split layout.

## 5. Content Outline (segment B)
- H2: What is a vector?
- H2: Linear combinations
- H2: Matrices: machines that transform space
- H2: The dot product
- H2: The cross product
- H2: Why this matters for machine learning
- H2: What's next (teaser for Perceptron)

## 6. Assets
| File | Type | Source | License |
|---|---|---|---|
| — | — | No external assets; all geometry is procedural Three.js | — |

## 7. Dependencies
- Shared components from `/src/components`: `RouteLayout`, `Callout`, `CodeBlock`, `TagPill`
- Shared utilities from `/src/lib`: `ScrollContext`, `ThemeContext`, `scrollProgress`
- Shared 3D primitives from `/src/three`: none yet (Arrow is local to this Scene)
- External libs beyond baseline: none

## 8. Performance Notes
- **Triangle count:** Very low — spheres (32×32 for neuron, 16×16 for origin), cones (12 sides),
  no heavy geometry.
- **Draw calls:** ~10 (3 arrows × 2 meshes + grid + plane + amber vector)
- **Shader complexity:** Standard PBR only; no custom GLSL
- **Mobile strategy:** `dpr={[1, 2]}` caps pixel ratio; shadows disabled (no shadow lights); the
  reading pane scrolls independently so the canvas stays mounted without relayout thrash
- **Memory:** Negligible — no textures, no GLBs

## 9. Accessibility Notes
- `<Canvas>` has `aria-hidden="true"` — excluded from screen readers
- All conceptual content duplicated in segment B prose (vectors explained in text + math)
- KaTeX renders fallback text via its own aria attributes
- `prefers-reduced-motion`: scene still renders but non-essential auto-rotation pauses.
- Keyboard: OrbitControls does not expose keyboard interactions; the lower article pane is focusable
  and scrollable with the keyboard
- Scene fullscreen remains keyboard-exitable via `Esc`, and the scrub bar is exposed as a native range control

## 10. Open Questions / Future Work
- Add matrix entry fields so readers can build arbitrary 3×3 transforms, not just presets
- Add matrix multiplication demo: show how a matrix drags basis vectors to new positions
- Animate eigen-decomposition as a stretch/squish along eigenvectors
- Add transformed basis-vector ghosts so the matrix action is even clearer at a glance

## 11. Changelog
| Date | Author | Change |
|---|---|---|
| 2026-04-11 | Fre-ed Team | Initial implementation — basis vectors, scroll-linked amber vector, transformation plane |
| 2026-04-11 | Fre-ed Team | Switched to a persistent top/bottom lesson shell, added chapter overlays, and themed the canvas palette for light/dark modes |
| 2026-04-11 | Fre-ed Team | Added pane fullscreen controls and a scene scrub bar that controls animation progress while the canvas is focused |
| 2026-04-13 | Fre-ed Team | Added vector sliders, matrix presets, transformed-vector overlays, and explicit reduced-motion handling |
