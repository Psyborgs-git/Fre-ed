# Page Doc — `ai-ml/transformer`

## 1. Route
- **Path:** `/ai-ml/transformer`
- **Title:** Transformer Block — Attention Is All You Need
- **Author:** Fre-ed Team
- **Published:** 2026-04-11
- **Last updated:** 2026-04-11

## 2. Learning Goal
The reader understands the complete transformer block: what multi-head self-attention
computes (Q/K/V projections, scaled dot-product, softmax), why the FFN is needed, how
residual connections prevent vanishing gradients, and how stacking blocks enables
compositional reasoning.

## 3. Scene Concept
- **Core visual metaphor:** 6 token spheres travel left → right through two sublayers.
  All-to-all attention lines show information mixing; amber FFN boxes process each token
  independently; dashed residual lines bypass both sublayers.
- **Camera arc:** Starts at `[0, 0, 8]` fov=52; `CameraRig` drifts back to `z≈10` and
  tilts up `y≈1.2` as scroll reaches 100%.
- **Key objects:**
  - 6 violet input token spheres at `x=-3`, y=[-2.5…2.5]
  - 30 attention curves (Line, curvature via mid-point offset) — cyan, varying opacity/weight
  - 6 amber FFN boxes (boxGeometry 0.45³) at `x=0`
  - Feed lines from inputs→FFN→outputs (cyan then amber)
  - White dashed residual lines running x=-3 to x=3 behind the scene
  - 6 cyan output token spheres at `x=3`
- **Color / mood:** Violet inputs → cyan attention → amber FFN → cyan outputs. Deep dark
  background; cold/warm contrast reinforces information flow direction.

## 4. Scroll Choreography
| Scroll % | What happens | Camera | Objects |
|---|---|---|---|
| 0% | Input token spheres lit, all else invisible | `z=8, y=0` | 6 violet spheres |
| 25% | Attention lines fan out (all-to-all) | Drifting back | 30 cyan curves appear |
| 50% | FFN boxes activate (amber glow); feed lines appear | `z≈9` | Amber boxes + lines |
| 75% | Output tokens brighten; residual lines materialise | `z≈9.5, y≈0.9` | Full signal flow |
| 100% | All elements at peak; camera pulled back for full overview | `z≈10, y≈1.2` | Complete scene |

## 5. Content Outline (segment B)
- H2: The building block of every LLM
- H2: Self-attention — what it really does
- H2: Multi-head attention
- H2: The feed-forward sublayer
- H2: Residual connections and layer normalisation
- H2: Stacking blocks — depth vs width
- H2: From block to model

## 6. Assets
| File | Type | Source | License |
|---|---|---|---|
| — | — | All geometry procedural Three.js | — |

## 7. Dependencies
- Shared components from `/src/components`: `RouteLayout`, `Callout`, `CodeBlock`, `TagPill`
- Shared 3D primitives from `/src/three`: none (all inline)
- External libs beyond baseline: none

## 8. Performance Notes
- **Triangle count:** Low — 12 spheres (20×20), 6 boxes (standard), 30 Lines (Line2)
- **Draw calls:** ~50 (30 attention lines + 12 spheres + 6 boxes + feed/residual lines)
- **Shader complexity:** Standard PBR only; no custom GLSL
- **Mobile strategy:** `dpr={[1, 2]}`; attention lines rendered only when `opacity > 0.01` to skip invisible geometry; Line `lineWidth` kept low
- **Memory:** Negligible — no textures, no GLBs, no instancing needed at this scale

## 9. Accessibility Notes
- `<Canvas>` has `aria-hidden="true"` — excluded from screen readers
- Full conceptual walkthrough in segment B prose including Q/K/V equations, code examples
- KaTeX renders accessible MathML
- Attention line weights convey attention strength — same information available in the PyTorch code block in segment B
- Head selector controls now isolate one attention head at a time with keyboard-accessible segmented buttons

## 10. Open Questions / Future Work
- Add `<Text>` labels from Drei for Q, K, V above each attention head
- Animate causal mask (GPT-style): upper-triangle attention lines dim/disappear
- Show multiple stacked blocks (animate camera rising through layers)
- Extract `<TokenSphere>` to `/src/three/ml/` shared primitives

## 11. Changelog
| Date | Author | Change |
|---|---|---|
| 2026-04-11 | Fre-ed Team | Initial implementation — 6-token all-to-all attention, FFN, residual connections |
| 2026-04-13 | Fre-ed Team | Added head-isolation controls, shared scene overlays, and reduced-motion aware camera behavior |
