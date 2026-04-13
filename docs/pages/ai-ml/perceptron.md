# Page Doc — `ai-ml/perceptron`

## 1. Route
- **Path:** `/ai-ml/perceptron`
- **Title:** Perceptron — Build It From Scratch
- **Author:** Fre-ed Team
- **Published:** 2026-04-11
- **Last updated:** 2026-04-11

## 2. Learning Goal
The reader understands the full mechanics of a single perceptron: how weighted inputs are
summed, what the activation function does, why the decision boundary is a hyperplane, and
how the Rosenblatt update rule moves that boundary. They finish ready to understand why
multi-layer networks were needed (XOR problem).

## 3. Scene Concept
- **Core visual metaphor:** A biological-inspired neuron in 3D — inputs arrive from the left
  as glowing spheres, weight lines carry signal to the central neuron, which pulses when it
  fires, and output flows right. The decision boundary is a translucent plane.
- **Camera arc:** Starts at `[0, 0.5, 6]` looking at origin; `CameraRig` slowly drifts back
  and tilts up as scroll progresses (pulling the camera to reveal the full network topology).
- **Key objects:**
  - 4 violet input spheres at `x = -2.6`, y positions `[-1.2, -0.4, 0.4, 1.2]`
  - 4 weight lines: cyan for positive weights, amber for negative; thickness ∝ `|w|`
  - Central cyan sphere (the neuron) — pulsing glow driven by `progress`
  - Amber output line + amber output sphere at `x = 2.6`
  - Translucent cyan plane on XZ plane — decision boundary, tilts with scroll
- **Color / mood:** Dark background; cyan = active/positive; amber = output/negative weight;
  violet = inputs. The scene reads left-to-right like a signal flow diagram.

## 4. Scroll Choreography
| Scroll % | What happens | Camera | Objects |
|---|---|---|---|
| 0 % | Static layout, dim weight lines | `z=6, y=0.5` | All objects visible, low opacity |
| 25 % | Weight lines brighten to 55 % opacity, neuron begins glowing | Camera drifts back | Weight colour distinction clearer |
| 50 % | Decision boundary plane fades in (opacity 0.1) | `z~6.75, y~0.4` | Plane visible |
| 75 % | Neuron pulsing visibly, plane tilted ~11° | `z~7.5, y~0.6` | Pulse obvious |
| 100 % | Full brightness, plane at max tilt, output sphere emissive | `z~7.5, y~0.8` | Complete activation |

## 5. Content Outline (segment B)
- H2: The simplest neural network (overview, scene map)
- H2: The math, step by step (weighted sum + activation, code example)
- H2: The decision boundary (hyperplane derivation, linearly separable)
- H2: Learning: the perceptron update rule (Rosenblatt rule, code)
- H2: Activation functions (table: step, sigmoid, tanh, ReLU, GELU)
- H2: What a perceptron cannot do (XOR problem, motivation for MLP)
- H2: Summary (equation diagram)

## 6. Assets
| File | Type | Source | License |
|---|---|---|---|
| — | — | All geometry procedural; no external assets | — |

## 7. Dependencies
- Shared components from `/src/components`: `RouteLayout`, `Callout`, `CodeBlock`, `TagPill`
- Shared 3D primitives from `/src/three/ml/`: none yet (primitives are inlined; will be
  extracted to `<Neuron>`, `<Weight>`, `<Layer>` in a shared pass)
- External libs beyond baseline: none

## 8. Performance Notes
- **Triangle count:** Low — 4 input spheres (16×16), 1 neuron (32×32 + glow 24×24),
  1 output sphere (20×20), 5 lines (Three.js Line2 via drei), 1 plane
- **Draw calls:** ~14 total
- **Shader complexity:** Standard PBR only; emissiveIntensity updated per-frame in `useFrame`
  (lightweight uniform updates, no texture sampling)
- **Mobile strategy:** `dpr={[1, 2]}`; glow shell (BackSide material) disabled on low-end via
  GPU tiering hook (future). `CameraRig` uses lerp so animation is smooth at any FPS.
- **Memory:** Negligible — no textures, no GLBs, no instancing needed at this scale

## 9. Accessibility Notes
- `<Canvas>` has `aria-hidden="true"` — excluded from screen readers
- Every visual element in the scene is explained in segment B prose:
  - Weight line colours → table mapping 3D objects to equation terms
  - Neuron pulsing → described as "neuron activates" in text
  - Decision boundary plane → derived algebraically in segment B
- KaTeX math is rendered with accessible MathML output
- Live weight and bias sliders sit in the scene control panel and are keyboard reachable
- `prefers-reduced-motion` now disables time-based pulsing while preserving scroll/scrub progress

## 10. Open Questions / Future Work
- Extract `<Neuron>`, `<Weight>`, `<InputNode>` to `/src/three/ml/` shared primitives
- Add an editable 2D datapoint and show its classification updating in real time
- Add animated forward-pass wave: colour propagates input → neuron → output on scroll
- Implement full Rosenblatt training loop demo with Fuse.js dataset picker
- Add `<Tensor3D>` view showing the full decision space for a 2-input perceptron

## 11. Changelog
| Date | Author | Change |
|---|---|---|
| 2026-04-11 | Fre-ed Team | Initial implementation — 4-input perceptron scene with scroll-linked activation and decision boundary |
| 2026-04-13 | Fre-ed Team | Added live weight and bias controls, shared lesson legend/controls, and explicit reduced-motion handling |
