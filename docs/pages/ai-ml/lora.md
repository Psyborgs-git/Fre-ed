# Page Doc — `ai-ml/lora`

## 1. Route
- **Path:** `/ai-ml/lora`
- **Title:** LoRA — Low-Rank Adaptation
- **Author:** Fre-ed Team
- **Published:** 2026-04-11
- **Last updated:** 2026-04-11

## 2. Learning Goal
The reader understands why full fine-tuning of large models is prohibitively expensive, how LoRA
reduces trainable parameters to < 0.1% by learning a low-rank decomposition ΔW = BA, how to pick
rank r and which layers to adapt, how QLoRA extends this to 4-bit quantised bases, and when to
merge adapters vs keep them separate.

## 3. Scene Concept
- **Core visual metaphor:** A large frozen grey W matrix (8×8 grid of boxes) sits centred; two
  small adapter matrices appear beside it — a tall thin cyan A matrix (8×2) to the left and a
  short wide violet B matrix (2×8) to the right. The size contrast (64 cells vs 16 + 16) visually
  communicates that the adapters are far smaller than the base model. Amber lines show the B·A
  rank-2 bottleneck, and an amber delta overlay highlights the ΔW region on W.
- **Camera arc:** Starts at `[0, 0, 7]` fov=52; `CameraRig` drifts back to `z≈9.5` and up
  `y≈0.5` on scroll.
- **Key objects:**
  - 64 grey boxGeometry cells forming the 8×8 W matrix (W_CELL=0.22, W_GAP=0.26)
  - 16 cyan cells for the 8×2 A matrix at x=-3.2
  - 16 violet cells for the 2×8 B matrix at x=3.2
  - 2 amber curved Lines from A columns to B rows showing rank-2 bottleneck
  - Amber delta overlay on a 3×4 centre region of W (rows 2–4, cols 2–5)
- **Color / mood:** Frozen base grey, cyan adapter A, violet adapter B, amber for ΔW and multiply
  connections. The visual immediately communicates "tiny adapters modify a huge frozen base."

## 4. Scroll Choreography
| Scroll % | What happens | Camera | Objects |
|---|---|---|---|
| 0% | Full-brightness W matrix centred | `z=7, y=0` | 64 grey W cells bright |
| 25% | W dims (frozen); A and B matrices fade in | Drifting back | A/B cells fade in over 0.25 scroll range |
| 50% | Multiply lines appear (amber, rank-2 bottleneck) | `z≈8, y≈0.3` | 2 curved amber lines A→B |
| 75% | Delta overlay lights up centre of W (amber) | `z≈9, y≈0.4` | 12 W cells turn amber |
| 100% | Size contrast clear; camera at full pullback | `z≈9.5, y≈0.5` | Full scene stable |

## 5. Content Outline (segment B)
- H2: The cost of full fine-tuning
- H2: The LoRA insight — low-rank weight updates
- H2: Implementation in PyTorch
- H2: Choosing rank r and target layers
- H2: QLoRA — quantised base + LoRA adapters
- H2: Merging LoRA back into the base model
- H2: Other PEFT methods

## 6. Assets
| File | Type | Source | License |
|---|---|---|---|
| — | — | All geometry procedural Three.js | — |

## 7. Dependencies
- Shared components from `/src/components`: `RouteLayout`, `Callout`, `CodeBlock`
- Shared 3D primitives from `/src/three`: none (all inline)
- External libs beyond baseline: none

## 8. Performance Notes
- **Triangle count:** Very low — 96 small box meshes (W + A + B cells), 2 curved lines
- **Draw calls:** ~100 (96 mesh instances, line segments, overlay highlight)
- **Shader complexity:** Standard PBR; `transparent` on most materials; emissive intensity driven by scroll progress
- **Mobile strategy:** `dpr={[1, 2]}`; cells only rendered when `opacity > 0.02`; multiply lines gated on `t < 0.02` early return
- **Memory:** Negligible — small geometries, no textures

## 9. Accessibility Notes
- `<Canvas>` has `aria-hidden="true"`
- Full LoRA algorithm explained textually in segment B including parameter count table and PyTorch code
- Math formulas ΔW=BA, h=W₀x+BAx, α/r scaling all rendered via KaTeX
- The visual size contrast (W 64 cells vs A+B 32 cells total) maps directly to the "0.20% trainable params" figure in the prose
- Rank controls now resize the adapter matrices in the shared scene control panel

## 10. Open Questions / Future Work
- Add animated "gradient flow" showing only A and B receiving gradient arrows while W has none
- Show SVD decomposition: animate decomposing ΔW into U, S, V and highlight the top-r singular values
- Add parameter-count readouts that update alongside the live rank controls
- Add DoRA (Weight-Decomposed Low-Rank Adaptation) variant comparison

## 11. Changelog
| Date | Author | Change |
|---|---|---|
| 2026-04-11 | Fre-ed Team | Initial implementation — 8×8 W matrix, 8×2 A and 2×8 B adapters, multiply lines, delta overlay, QLoRA section |
| 2026-04-13 | Fre-ed Team | Added live rank controls, shared legends/prompts, and reduced-motion aware camera behavior |
