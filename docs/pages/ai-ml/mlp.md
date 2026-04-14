# Page Doc — `ai-ml/mlp`

## 1. Route
- **Path:** `/ai-ml/mlp`
- **Title:** Multi-Layer Perceptron — Beyond Linear Boundaries
- **Author:** Fre-ed Team
- **Published:** 2026-04-11
- **Last updated:** 2026-04-11

## 2. Learning Goal
The reader understands why a single perceptron cannot solve non-linearly separable problems
like XOR, how stacking layers with non-linear activations overcomes this limitation, and
what the universal approximation theorem guarantees. They finish able to implement a basic
MLP in NumPy and ready to understand backpropagation.

## 3. Scene Concept
- **Core visual metaphor:** A 4-layer fully-connected network rendered in 3D — violet
  inputs feed into two banks of cyan hidden neurons, which funnel into amber output neurons.
  Connections brighten layer-by-layer as scroll progresses. A white pulse travels the full
  network width to represent a forward pass.
- **Camera arc:** Starts centred at `[0, 0.3, 7.5]`; CameraRig drifts back and up as
  scroll progresses, revealing the full topology breadth.
- **Key objects:**
  - 3 violet input spheres at `x = -3.6`
  - 4 cyan hidden-1 spheres at `x = -1.2`
  - 4 cyan hidden-2 spheres at `x = 1.2`
  - 2 amber output spheres at `x = 3.6`
  - All-to-all Line2 connections per adjacent layer pair
  - White forward-pass pulse sphere (appears at 60% scroll, traverses to 95%)
  - Translucent cyan decision boundary plane (fades in at 75%)
- **Color / mood:** Dark background; violet = inputs; cyan = hidden transformations;
  amber = output predictions. Layer separator bars add structural clarity.

## 4. Scroll Choreography
| Scroll % | What happens | Camera | Objects |
|---|---|---|---|
| 0 % | Network visible, neurons dim, no connections | `z=7.5` | Neurons at low emissive |
| 15 % | Input→H1 connections appear; H1 neurons brighten | Subtle drift back | Input + H1 layer lit |
| 35 % | H1→H2 connections; H2 activates | Continuing drift | Both hidden layers lit |
| 55 % | H2→Output; output sphere brightens | `z~8.5` | Full network lit |
| 75 % | Decision boundary plane fades in | `z~9, y~0.5` | Boundary visible |
| 95 % | Forward-pass wave pulses left → right | Camera wide | Full forward pass visualised |

## 5. Content Outline (segment B)
- H2: Why a single perceptron isn't enough (XOR problem recap)
- H2: Architecture — layers, widths, and depth (forward pass equations)
- H2: Solving XOR — the power of hidden representations (hand-crafted weights)
- H2: The universal approximation theorem (Hornik 1991)
- H2: Implementing an MLP in NumPy (full code)
- H2: Why we need non-linear activations (matrix collapse argument)
- H2: Depth vs. width — why going deeper works (feature hierarchy)
- H2: Summary (equation chain diagram)

## 6. Assets
| File | Type | Source | License |
|---|---|---|---|
| — | — | All geometry procedural; no external assets | — |

## 7. Dependencies
- Shared components: `RouteLayout`, `Callout`, `CodeBlock`, `TagPill`
- 3D primitives: inlined `Neuron`, `LayerConnections`, `ForwardPassWave`, `DecisionBoundary`
- External libs: none beyond baseline

## 8. Performance Notes
- **Triangle count:** Low — 13 spheres (input×3, hidden×8, output×2) at 24×24 segments each,
  plus 12 glow shells (16×16), plus line segments (≈80 Line2 segments)
- **Draw calls:** ~30 (each sphere/glow = 1 draw call, each Line2 set = 1 per layer pair)
- **Shader complexity:** PBR with emissive only; forward-pass sphere uses basic emissive
- **Mobile:** `dpr={[1,2]}`; glow shells have minimal overdraw impact. Camera lerp ensures
  smooth animation at variable frame rates.
- **Memory:** No textures; geometry is procedural and small

## 9. Accessibility Notes
- `<Canvas>` has `aria-hidden="true"` — excluded from screen readers
- Every 3D element is described in prose:
  - Violet/cyan/amber spheres → input, hidden, output neurons table
  - Line opacity → connection weight magnitude (conceptually)
  - White pulse → forward pass described in text
  - Decision boundary → derived algebraically
- KaTeX renders with MathML for screen readers
- OrbitControls: mouse/touch only; no keyboard requirement
- Reduced-motion: `progress`-gated animations; static at `progress=0`
- Width presets now let readers compare compact, standard, and wide layouts from the shared scene panel

## 10. Open Questions / Future Work
- Extract neuron + connection primitives to `/src/three/ml/` shared lib
- Extend the width presets into per-layer neuron count controls
- Animate a live XOR training loop — show weights updating per epoch
- Implement instanced rendering for large networks (>100 neurons)
- Add per-neuron activation value labels (shown as colour-mapped text)

## 11. Changelog
| Date | Author | Change |
|---|---|---|
| 2026-04-11 | Fre-ed Team | Initial implementation — 4-layer MLP with scroll-linked activation and forward-pass pulse |
| 2026-04-13 | Fre-ed Team | Added width presets, shared legend/prompt overlays, and reduced-motion camera support |
