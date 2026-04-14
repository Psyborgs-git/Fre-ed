# Page Doc — `ai-ml/normalization`

## 1. Route
- **Path:** `/ai-ml/normalization`
- **Title:** Normalization — Keeping Activations Well-Behaved
- **Author:** Fre-ed Team
- **Published:** 2026-04-14
- **Last updated:** 2026-04-14

## 2. Learning Goal
The reader understands why unnormalised activations cause vanishing/exploding gradients, how BatchNorm, LayerNorm, and RMSNorm each rescale activations, which axis each method normalises over, and why LayerNorm became the standard for transformers.

## 3. Scene Concept
- **Core visual metaphor:** Two columns of activation bars — left column spread and biased (pre-normalisation), right column centred near zero with tighter spread (post-normalisation). A green arrow bridges them.
- **Camera arc:** Starts at `[0, 0.5, 7]`; gently pulls back as scroll progresses.
- **Key objects:**
  - 8 violet box bars (left): pre-norm activations with varied heights and offset
  - 8 coloured box bars (right): post-norm activations (colour depends on norm type)
  - Amber horizontal line: mean indicator per column
  - Coloured bracket lines: standard deviation bracket
  - Green arrow: normalisation transform direction
- **Color / mood:** Violet pre-norm; cyan for BatchNorm, green for LayerNorm, amber for RMSNorm.

## 4. Scroll Choreography
| Scroll % | What happens | Camera | Objects |
|---|---|---|---|
| 0–25% | Pre-norm bars appear one by one | `z=7` | Violet bars scale in |
| 25–45% | Mean line + std bracket show on pre column | Steady | Amber mean, bracket |
| 45–70% | Post-norm bars appear (centred) | Pull back | Coloured bars scale in |
| 70–100% | Std bracket on post column; camera fully back | `z≈9.5` | Full scene visible |

## 5. Content Outline (segment B)
- H2: Why activations go wrong (exploding/vanishing, scene description)
- H2: Batch Normalisation (formula, affine transform, inference running stats, code)
- H2: Layer Normalisation (formula, batch-free, transformer standard, code)
- H2: Pre-LN vs Post-LN (training stability, gradient flow)
- H2: RMSNorm (simplified formula, speed, LLaMA/Gemma, code)
- H2: Group Normalisation (channel groups, image tasks)
- H2: Comparison table (method × normalises over × batch-free × used in)
- H2: Why normalisation helps optimisation (smooth landscape, higher LR, regularisation)
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
- **Triangle count:** 16 boxes + lines — minimal
- **Draw calls:** ~25
- **Shader complexity:** Standard PBR; no textures
- **Mobile strategy:** `dpr={[1, 2]}`
- **Memory:** Negligible

## 9. Accessibility Notes
- `<Canvas>` aria-hidden
- Mean and std bracket explained in prose
- `prefers-reduced-motion`: no idle animations; bars appear on scroll

## 10. Open Questions / Future Work
- Animate a live histogram overlay showing distribution shape change
- Add InstanceNorm and GroupNorm columns

## 11. Changelog
| Date | Author | Change |
|---|---|---|
| 2026-04-14 | Fre-ed Team | Initial implementation |
