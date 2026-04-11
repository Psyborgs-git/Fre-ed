# Page Doc — `ai-ml/backprop`

## 1. Route
- **Path:** `/ai-ml/backprop`
- **Title:** Backpropagation — How Neural Networks Learn
- **Author:** Fre-ed Team
- **Published:** 2026-04-11
- **Last updated:** 2026-04-11

## 2. Learning Goal
The reader understands that backpropagation is the chain rule applied recursively,
how gradients are computed and stored during a backward pass, why vanishing gradients
occur with sigmoid activations, and how modern frameworks automate everything with
autograd. They finish able to write a manual backward pass for a two-layer network.

## 3. Scene Concept
- **Core visual metaphor:** A 3-layer network (3→3→2) shown in two phases. Phase 1
  (cyan, left→right): a forward pass pulse travels from inputs to outputs, then a red
  loss sphere appears at the output. Phase 2 (amber, right→left): a gradient pulse
  sweeps back through the network, with each layer's connections transitioning from
  cyan to amber as the gradient arrives.
- **Camera arc:** Starts at `[0.5, 0, 7.5]`; shifts right during forward pass, returns
  left during backward pass. Drifts back during full traversal.
- **Key objects:**
  - 3 violet input spheres at `x = -3`
  - 3 cyan hidden spheres at `x = 0`
  - 2 amber output spheres at `x = 3`
  - All-to-all Line2 connections per layer pair (cyan forward, amber gradient)
  - Cyan pulse sphere (forward pass, 0→45%)
  - Red loss sphere at `x = 5` (appears at 40%)
  - Amber gradient pulse sphere (backward, 50→95%, right to left)
- **Color / mood:** Dark background. Cyan = forward signal; amber = gradient; red = loss.
  This two-tone progression makes the "forward then backward" nature of backprop visceral.

## 4. Scroll Choreography
| Scroll % | What happens | Camera | Objects |
|---|---|---|---|
| 0 % | Network visible, dim | `z=7.5` | All neurons at base emissive |
| 15 % | Cyan pulse starts; Input→H1 connections appear | Shifts right | Cyan connections glow |
| 35 % | H1→H2 connections; cyan pulse reaches output | Continuing shift | Hidden layer lit |
| 45 % | Red loss sphere appears at output right edge | Camera right | Output + loss visible |
| 55 % | Amber gradient pulse starts right → left | Returns left | Gradient connections appear |
| 75 % | Hidden layer glows amber; all connections amber | Camera centred | Full gradient propagation |
| 95 % | Input layer glows amber; complete backprop pass | Wide view | All layers amber |

## 5. Content Outline (segment B)
- H2: The learning problem (loss, gradients, gradient descent)
- H2: The chain rule — the engine of backprop (composition of functions)
- H2: Forward pass — build the computation graph (cache intermediate values, code)
- H2: Backward pass — propagate gradients (per-layer equations + full code)
- H2: The vanishing gradient problem (sigmoid shrinkage, solutions)
- H2: Automatic differentiation — how frameworks do it (PyTorch autograd code)
- H2: Mini-batch gradient descent (batch sizes table, noise as regulariser)
- H2: Summary (forward/backward equation diagram)

## 6. Assets
| File | Type | Source | License |
|---|---|---|---|
| — | — | All geometry procedural | — |

## 7. Dependencies
- Shared components: `RouteLayout`, `Callout`, `CodeBlock`, `TagPill`
- 3D primitives: `Neuron` (dual-mode cyan/amber), `Connections`, `ForwardPulse`,
  `GradientPulse`, `LossSphere`, `CameraRig`
- External libs: none beyond baseline

## 8. Performance Notes
- **Triangle count:** Very low — 8 spheres + 8 glow shells + 18 Line2 connections + 2 pulse spheres
- **Draw calls:** ~30 total; Line2 instances grouped per layer pair
- **Shader complexity:** Dual-mode emissive only; colour transitions via `useFrame` material updates
- **Mobile strategy:** `dpr={[1,2]}`; camera lerp ensures smooth animation at variable FPS
- **Memory:** No textures; all procedural

## 9. Accessibility Notes
- `<Canvas>` is `aria-hidden="true"` — excluded from screen readers
- Two-phase animation (cyan forward, amber backward) described in prose before scene reference
- Loss sphere (red) described as "loss computed at output" in prose
- Vanishing gradient section includes mathematical derivation accessible via KaTeX/MathML
- No keyboard or pointer interactions required

## 10. Open Questions / Future Work
- Add an interactive "learning rate" slider that shows gradient step size visually
- Animate individual weight value changes (floating numbers that update per step)
- Implement a "vanishing gradient" mode showing signal decay across many layers
- Add computation graph view (DAG of operations) alongside the neural network view
- Integrate live training demo that runs in the browser (WASM or WebGPU compute)

## 11. Changelog
| Date | Author | Change |
|---|---|---|
| 2026-04-11 | Fre-ed Team | Initial implementation — dual-phase forward/backward scene with cyan/amber pulse system |
