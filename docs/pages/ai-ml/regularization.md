# Page Doc — `ai-ml/regularization`

## 1. Route
- **Path:** `/ai-ml/regularization`
- **Title:** Dropout & Regularization — Fighting Overfitting
- **Author:** Fre-ed Team
- **Published:** 2026-04-14
- **Last updated:** 2026-04-14

## 2. Learning Goal
The reader understands how overfitting arises, how dropout creates an implicit ensemble by randomly silencing neurons, how L1/L2 weight penalties constrain parameter magnitude, and how to combine regularisation techniques in practice.

## 3. Scene Concept
- **Core visual metaphor:** A 4-layer MLP (4→6→6→3 neurons). First it appears fully connected and lit. After 35% scroll, dropout activates — random neurons go dark grey, and connections involving them vanish, revealing the sparse sub-network active for this training step.
- **Camera arc:** Starts at `[0, 0.2, 7]`; gently pulls back and rises.
- **Key objects:**
  - Cyan spheres: active neurons
  - Dark grey spheres: dropped neurons
  - Cyan lines: active connections (both endpoints active)
  - Near-invisible lines: dropped connections
- **Color / mood:** Contrast between bright cyan (active) and muted grey (dropped) drives the visual narrative.

## 4. Scroll Choreography
| Scroll % | What happens | Camera | Objects |
|---|---|---|---|
| 0–35% | Full network materialises (all cyan) | `z=7` | All neurons brighten |
| 35–60% | Dropout mask applied — neurons grey out | Steady | Random dark spheres |
| 60–80% | Mask shifts subtly (stochastic effect) | Pull back | Active set changes |
| 80–100% | Camera fully back showing sparse connectivity | `z≈9` | Sparse active sub-net |

## 5. Content Outline (segment B)
- H2: The overfitting problem (memorising vs generalising, scene description)
- H2: Dropout (formula, inverted dropout, inference mode, code)
- H2: Dropout in transformers (attention dropout, FF dropout, typical rates)
- H2: L2 regularisation / weight decay (formula, shrinkage interpretation, code)
- H2: L1 regularisation (sparsity, feature selection, L1 vs L2 table)
- H2: BatchNorm as implicit regularisation (noise from mini-batch statistics)
- H2: Early stopping (validation loss monitoring, code)
- H2: Data augmentation as regularisation (image/text/audio techniques)
- H2: Choosing regularisation (table by technique)
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
- **Triangle count:** ~25 spheres (20×20) + lines — low
- **Draw calls:** ~80 at full visibility (many connection lines)
- **Shader complexity:** Standard PBR; transparent materials
- **Mobile strategy:** `dpr={[1, 2]}`; connection count could reduce on low-end
- **Memory:** Negligible

## 9. Accessibility Notes
- `<Canvas>` aria-hidden
- Legend distinguishes active (cyan) vs dropped (grey) neurons
- `prefers-reduced-motion`: pulse animations disabled

## 10. Open Questions / Future Work
- Animate a live training/validation loss curve overlay showing overfitting gap
- Show L2 penalty as a ball rolling on a parabola (constraint visualisation)
- Add DropPath / StochasticDepth for transformer regularisation

## 11. Changelog
| Date | Author | Change |
|---|---|---|
| 2026-04-14 | Fre-ed Team | Initial implementation |
