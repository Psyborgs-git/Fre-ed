# Page Doc — `ai-ml/fine-tuning`

## 1. Route
- **Path:** `/ai-ml/fine-tuning`
- **Title:** Fine-Tuning — Adapting Pre-Trained Models
- **Author:** Fre-ed Team
- **Published:** 2026-04-11
- **Last updated:** 2026-04-11

## 2. Learning Goal
The reader understands the full fine-tuning landscape: why fine-tuning differs from
pre-training, how SFT loss works, what instruction tuning is, how RLHF and DPO align
models to human preferences, what catastrophic forgetting is and how to mitigate it,
and how to decide between fine-tuning, prompting, and RAG for a given production problem.

## 3. Scene Concept
- **Core visual metaphor:** A parametric loss landscape (terrain mesh) with a broad
  plateau representing the pre-trained minimum and a sharp valley representing the
  task-specific minimum. A cyan sphere marks the pre-trained position; gradient arrows
  point downhill; a trail of spheres animates the optimisation path; an amber sphere
  lights up at the fine-tuned minimum.
- **Camera arc:** Starts at `[-0.5, 7, 5.5]` fov=52 (angled overview); `CameraRig`
  drifts toward birds-eye (`y≈9.5, z≈4`) and slightly rightward as scroll progresses.
- **Key objects:**
  - `PlaneGeometry(8, 8, 40, 40)` displaced by `f(x,z)=2-1.8·exp(-((x-1.5)²+(z-1.5)²)/3)+0.3·sin(x)·cos(z)`
  - Solid `#15151d` surface + `WireframeGeometry` overlay in `#26262f`
  - Cyan sphere at pre-trained plateau `(-1.5, f(-1.5,-1.5)+0.12, -1.5)`, fades in at 20%+
  - 4 amber `coneGeometry` arrowheads + line shafts pointing downhill, appearing at 42%+
  - 8 trail spheres colour-lerped cyan→amber, appearing progressively at 60%+
  - Amber sphere at valley `(1.5, f(1.5,1.5)+0.12, 1.5)`, lights up at 85%+
- **Color / mood:** Dark terrain, cyan pre-trained position, amber optimised position,
  gradient trail. The landscape communicates "optimisation cost" — steep near the valley,
  shallow on the plateau.

## 4. Scroll Choreography
| Scroll % | What happens | Camera | Objects |
|---|---|---|---|
| 0% | Loss landscape only (wireframe terrain) | Angled `y=7, z=5.5` | Terrain mesh only |
| 25% | Pre-trained sphere appears at plateau | Drifting up/back | Cyan sphere fades in |
| 50% | Gradient arrows appear, pointing downhill | `y≈8, z≈4.5` | 4 amber arrowheads |
| 75% | Path trail animates plateau → valley | `y≈9, z≈4` | 8 trail spheres sequentially |
| 100% | Fine-tuned sphere lights up; camera birds-eye | `y≈9.5, z≈4` | Amber sphere full brightness |

## 5. Content Outline (segment B)
- H2: What fine-tuning is and isn't
- H2: The pre-training and fine-tuning pipeline
- H2: Supervised fine-tuning (SFT) with labelled data
- H2: Instruction tuning and chat models
- H2: RLHF — Reinforcement Learning from Human Feedback
- H2: Catastrophic forgetting and mitigations
- H2: Fine-tuning vs prompting vs RAG — decision guide

## 6. Assets
| File | Type | Source | License |
|---|---|---|---|
| — | — | All geometry procedural Three.js | — |

## 7. Dependencies
- Shared components from `/src/components`: `RouteLayout`, `Callout`, `CodeBlock`
- Shared 3D primitives from `/src/three`: none (all inline)
- External libs beyond baseline: none (`WireframeGeometry` is built into Three.js core)

## 8. Performance Notes
- **Triangle count:** Moderate — 40×40 PlaneGeometry = 3,200 triangles; WireframeGeometry
  doubles the line count; 8 trail spheres (12×12 each), 4 arrow cones
- **Draw calls:** ~20 (terrain solid + wireframe, spheres, arrows)
- **Shader complexity:** Standard PBR for terrain; emissive on trail/spheres; all materials transparent
- **Mobile strategy:** `dpr={[1, 2]}`; PlaneGeometry reduced from 60×60 to 40×40 for mobile;
  arrowheads and trail spheres gated on opacity > 0.02
- **Memory:** Small — one 40×40 plane geometry, no textures

## 9. Accessibility Notes
- `<Canvas>` has `aria-hidden="true"`
- Full SFT loss formula, RLHF pipeline stages, and DPO formula rendered via KaTeX in prose
- The visual plateau → valley metaphor directly maps to the "pre-trained → fine-tuned" pipeline
  described in the ASCII art diagram in segment B
- Gradient arrows reinforce the gradient descent concept (pointing downhill = parameter update direction)
- Optimizer and learning-rate controls now let readers compare update styles without leaving the lesson shell

## 10. Open Questions / Future Work
- Add a dataset-size control so the valley sharpness changes along with the optimizer path
- Show the KL divergence constraint from PPO as an "exclusion sphere" around the pre-trained point
- Add a second camera path option: "loss over training steps" side view (traditional 2D loss curve)
- Animate the RLHF reward signal: show reward scores appearing above each candidate response

## 11. Changelog
| Date | Author | Change |
|---|---|---|
| 2026-04-11 | Fre-ed Team | Initial implementation — parametric loss terrain, pre-trained plateau sphere, gradient arrows, optimisation trail, fine-tuned valley sphere, SFT/RLHF/DPO content |
| 2026-04-13 | Fre-ed Team | Added optimizer and learning-rate controls, shared scene overlays, and reduced-motion handling |
