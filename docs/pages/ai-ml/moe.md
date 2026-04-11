# Page Doc — `ai-ml/moe`

## 1. Route
- **Path:** `/ai-ml/moe`
- **Title:** Mixture of Experts — Sparse Scaling
- **Author:** Fre-ed Team
- **Published:** 2026-04-11
- **Last updated:** 2026-04-11

## 2. Learning Goal
The reader understands why MoE decouples model capacity from compute cost, how the gating
network routes tokens to top-k experts using a learned linear layer + TopK, what the
load-balancing auxiliary loss prevents, and the practical memory/compute trade-offs when
deploying MoE models.

## 3. Scene Concept
- **Core visual metaphor:** An input token enters a rotating octahedral router; dim lines
  fan out to all 8 expert blocks; only 2 selected experts glow cyan and receive bright
  amber routing lines; output token aggregates their results on the right.
- **Camera arc:** Starts at `[0.5, 0, 9]` fov=52; `CameraRig` drifts right (x→1.5) and
  back (z→10.5) to keep the full grid visible at high scroll.
- **Key objects:**
  - Violet input sphere at `[-3.5, 0, 0]`
  - White octahedron (wireframe → solid) router at `[-1.2, 0, 0]`, rotating on Y
  - 8 expert boxes (boxGeometry 0.7×0.7×0.3) in 2×4 grid at x=1.2–4.5
  - Routing lines from router to all experts (dim to unselected, amber to selected)
  - Amber output sphere at `[5.5, 0, 0]` with lines from selected experts
- **Color / mood:** Violet input, white router, grey dim experts, cyan selected experts,
  amber routing lines and output. Sparse activation visually obvious.

## 4. Scroll Choreography
| Scroll % | What happens | Camera | Objects |
|---|---|---|---|
| 0% | Input token only | `x=0.5, z=9` | Violet sphere |
| 25% | Router materialises; dim lines to all 8 experts | Slight drift | Router + faint lines |
| 50% | Top-2 experts glow cyan; routing lines to them turn amber and thicken | `x≈0.9, z≈9.5` | Selected experts lit |
| 75% | Signal flows through selected experts; output sphere appears | `x≈1.2, z≈10` | Full routing visible |
| 100% | Unselected experts at min opacity; output at full brightness | `x≈1.5, z≈10.5` | Complete scene |

## 5. Content Outline (segment B)
- H2: The sparsity problem
- H2: How the gating network works
- H2: The load balancing problem
- H2: Expert parallelism
- H2: MoE in practice (model comparison table)
- H2: Trade-offs summary

## 6. Assets
| File | Type | Source | License |
|---|---|---|---|
| — | — | All geometry procedural Three.js | — |

## 7. Dependencies
- Shared components from `/src/components`: `RouteLayout`, `Callout`, `CodeBlock`, `TagPill`
- Shared 3D primitives from `/src/three`: none (all inline)
- External libs beyond baseline: none

## 8. Performance Notes
- **Triangle count:** Very low — octahedron (8 faces), 8 boxes, 1 large sphere + 2 small
- **Draw calls:** ~20 (8 boxes + 8 routing lines + 3 spheres + input/output lines)
- **Shader complexity:** Standard PBR; octahedron switches wireframe→solid via `wireframe` prop
- **Mobile strategy:** `dpr={[1, 2]}`; routing lines only rendered when `opacity > 0.02`
- **Memory:** Negligible

## 9. Accessibility Notes
- `<Canvas>` has `aria-hidden="true"`
- The full gating mechanism and expert selection process is explained textually in segment B
- The sparse vs dense parameter trade-off table in segment B conveys the same information as the visual contrast between lit and dim experts
- No interactive elements

## 10. Open Questions / Future Work
- Add live top-k slider (k=1 vs k=2 vs k=4) to show trade-off interactively
- Add expert load histogram below the scene showing token distribution
- Animate the all-to-all communication pattern across devices
- Extract `<Router>` and `<ExpertGrid>` to `/src/three/ml/` shared primitives

## 11. Changelog
| Date | Author | Change |
|---|---|---|
| 2026-04-11 | Fre-ed Team | Initial implementation — 8 experts, top-2 routing, sparse activation |
