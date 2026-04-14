# Page Doc — `ai-ml/cnn-from-scratch`

## 1. Route
- **Path:** `/ai-ml/cnn-from-scratch`
- **Title:** CNN From Scratch — Convolutions That See
- **Author:** Fre-ed Team
- **Published:** 2026-04-11
- **Last updated:** 2026-04-11

## 2. Learning Goal
The reader understands the convolution operation as a sliding dot product, how weight
sharing and local connectivity make CNNs parameter-efficient, why pooling is used for
spatial downsampling, and how a feature hierarchy emerges from stacking layers. They
finish able to implement a basic CNN in PyTorch and understand the shape transformations
at each stage.

## 3. Scene Concept
- **Core visual metaphor:** A horizontal pipeline of 2D pixel grids and output spheres,
  rendered as coloured flat meshes in 3D space. An amber 3×3 filter box slides across
  the input image, filling in the feature map one cell at a time. The pipeline reads
  left → right: input image → conv feature map → pooled map → FC output neurons.
- **Camera arc:** Starts at `[-1, 0.5, 8]` looking slightly left-of-centre; `CameraRig`
  pans right as scroll progresses, eventually showing the full pipeline.
- **Key objects:**
  - 7×7 blue gradient grid (input image) at `x ≈ -4`
  - Amber 3×3 sliding box (conv filter) — animates position based on slide progress
  - 5×5 cyan-green feature map (conv output) — fills cell-by-cell in sync with filter
  - Violet stage-connector lines between input→conv and conv→pool
  - 2×2 pooled feature map (larger cells)
  - 4 FC output spheres; top predicted class highlighted amber
- **Color / mood:** Dark background. Blue-tinted input (raw pixels); cyan-green feature
  maps (activated responses); amber filter and output (learnable + prediction).

## 4. Scroll Choreography
| Scroll % | What happens | Camera | Objects |
|---|---|---|---|
| 0 % | Input grid fades in | `x=-1, z=8` | Input pixels visible |
| 20 % | Amber filter starts sliding; feature map fills synchronously | Pans right | Filter + feature map |
| 60 % | Connector line to pool appears | Continuing pan | Pool line |
| 65 % | Pooled map appears (larger cells, 2×2) | `x~1, z=9` | Pooled grid |
| 82 % | FC layer appears; connection lines from pool | `x~2` | FC spheres |
| 100% | Top class highlighted amber; full pipeline visible | Wide, panned right | Complete pipeline |

## 5. Content Outline (segment B)
- H2: Why not just use an MLP for images? (parameter explosion, no spatial bias)
- H2: The convolution operation (sliding dot product, output size formula, NumPy code)
- H2: Filters as feature detectors (table of filter types)
- H2: Padding and stride (output size formula, same vs. valid padding, code)
- H2: Pooling — spatial downsampling (max pool code, shape math)
- H2: Building a complete CNN (PyTorch SmallCNN for MNIST)
- H2: The feature hierarchy (edges → parts → objects, Zeiler & Fergus)
- H2: Summary (pipeline equation diagram)

## 6. Assets
| File | Type | Source | License |
|---|---|---|---|
| — | — | All geometry procedural (flat meshes, spheres, lines) | — |

## 7. Dependencies
- Shared components: `RouteLayout`, `Callout`, `CodeBlock`, `TagPill`
- 3D primitives: `InputGrid`, `SlidingFilter`, `FeatureMap`, `PooledMap`, `FCLayer`,
  `StageConnectors`, `CameraRig`
- External libs: none beyond baseline

## 8. Performance Notes
- **Triangle count:** Moderate — 49 input cells + 25 feature cells + 4 pool cells
  (each is a `planeGeometry` with 2 triangles) = ~156 triangles for grids; plus 4 spheres
- **Draw calls:** ~85 (each plane/sphere = 1 draw call; no instancing yet)
  Optimisation: use `InstancedMesh` for the pixel grids to drop to ~5 draw calls
- **Shader complexity:** Flat emissive materials; `new THREE.Color(r,g,b)` per cell is
  computed at render, not per frame — colour is baked into material at mount time
- **Mobile:** `dpr={[1,2]}`; camera pan uses lerp; filter slide uses computed position
  (no per-frame heavy math). At 49+25 planes it's well within mobile GPU budget.
- **Memory:** No textures; geometry is tiny procedural planes

## 9. Accessibility Notes
- `<Canvas>` is `aria-hidden="true"` — excluded from screen readers
- Input grid colour mapping (brightness → blue hue) explained in prose
- Filter sliding visualised + described as "sliding dot product" in prose
- Feature map cell values (edge response) described with Sobel example
- FC output sphere selection described as "predicted class"
- KaTeX equations for output size, convolution formula accessible via MathML

## 10. Open Questions / Future Work
- Use `InstancedMesh` for pixel grids (massive draw call reduction)
- Replace kernel presets with a full per-cell filter editor and live numeric kernel table
- Animate multiple filter channels in parallel (4+ feature maps stacked in Z)
- Show gradient flow back through the conv layer (deconvolution visualisation)
- Add depth dimension: render stacked feature maps to show channel dimension

## 11. Changelog
| Date | Author | Change |
|---|---|---|
| 2026-04-11 | Fre-ed Team | Initial implementation — sliding filter → feature map → pool → FC pipeline |
| 2026-04-13 | Fre-ed Team | Added kernel presets, shared legend/prompt overlays, and reduced-motion camera behavior |
