# Page Doc — `ai-ml/optimizers`

## 1. Route
- **Path:** `/ai-ml/optimizers`
- **Title:** Optimizers — Racing Through the Loss Landscape
- **Author:** Fre-ed Team
- **Published:** 2026-04-14
- **Last updated:** 2026-04-14

## 2. Learning Goal
The reader understands why gradient descent alone oscillates in narrow valleys, how momentum accumulates velocity, how adaptive learning rates (AdaGrad, RMSProp, Adam) give each parameter its own pace, and when to choose Adam vs SGD.

## 3. Scene Concept
- **Core visual metaphor:** A 3D banana-shaped (Rosenbrock) loss landscape. Four coloured paths trace each optimizer's descent trajectory from the same starting point toward the global minimum (white sphere).
- **Camera arc:** Starts at `[-1, 2, 6]`; drifts forward and left to view the valley depth as scroll progresses.
- **Key objects:**
  - Vertex-coloured surface mesh: cyan (low loss) → violet (high loss)
  - Violet polyline: SGD — slow, zigzag
  - Amber polyline: SGD + Momentum — smoother
  - Green polyline: RMSProp — adaptive rate
  - Cyan polyline: Adam — fastest, direct
  - White sphere: global minimum marker (glows at end)
- **Color / mood:** Dark background; loss landscape vertex-coloured; paths in their legend colours.

## 4. Scroll Choreography
| Scroll % | What happens | Camera | Objects |
|---|---|---|---|
| 0–15% | Loss surface materialises | `[-1,2,6]` | Surface mesh fades in |
| 15–30% | SGD path draws | Steady | Violet zigzag |
| 22–45% | Momentum, RMSProp, Adam paths draw | Drift | Three more paths |
| 45–85% | Camera angles down into valley | Tilt down | All paths visible |
| 85–100% | Global minimum sphere glows | `z≈5` | White pulse at minimum |

## 5. Content Outline (segment B)
- H2: The optimisation problem (loss landscape, why no closed form)
- H2: Stochastic Gradient Descent (formula, mini-batch, oscillation problem, code)
- H2: SGD with Momentum (velocity formula, Nesterov, code)
- H2: AdaGrad and the adaptive idea (per-parameter rates, shrinking problem)
- H2: RMSProp (exponential moving average, code)
- H2: Adam: the workhorse (first + second moments, bias correction, full formula, code)
- H2: AdamW: decoupled weight decay (correct L2 regularisation, code)
- H2: Learning rate schedules (cosine annealing with warmup, code)
- H2: When SGD still wins (ResNets, fine-tuning, comparison table)
- H2: Summary

## 6. Assets
| File | Type | Source | License |
|---|---|---|---|
| — | — | All geometry procedural | — |

## 7. Dependencies
- Shared components: `RouteLayout`, `Callout`, `CodeBlock`, `TagPill`
- Shared 3D primitives: none
- External libs: none

## 8. Performance Notes
- **Triangle count:** 32×32 grid surface + 4 path lines — moderate
- **Draw calls:** ~30
- **Shader complexity:** vertexColors on surface; no textures
- **Mobile strategy:** `dpr={[1, 2]}`; grid could reduce to 16×16 on low-end
- **Memory:** Negligible

## 9. Accessibility Notes
- `<Canvas>` aria-hidden
- Paths explained in legend
- `prefers-reduced-motion`: paths draw on scroll, no idle animation

## 10. Open Questions / Future Work
- Add interactive starting point — drag the starting sphere to a different loss basin
- Show loss value over steps as a 2D overlay graph
- Add Lion and Sophia optimisers

## 11. Changelog
| Date | Author | Change |
|---|---|---|
| 2026-04-14 | Fre-ed Team | Initial implementation |
