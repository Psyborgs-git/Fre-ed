# 11 — AI/ML Segment Plan

## Mission
Show what ML models *look like* inside. Make architectures walkable, not just drawn. Expose weights, activations, attention, gradients as spatial objects.

## Hub
Route: `/ai-ml`
- Landing page with 3D grid of model "worlds"
- Each model = its own route under `/ai-ml/<model-name>`
- Shared 3D primitives in `/src/three/ml/`

## Launch Set (v1)
| Route | Topic | Scene concept |
|---|---|---|
| `/ai-ml/perceptron` | Single neuron | 1 node, live weight sliders, decision boundary plane |
| `/ai-ml/mlp` | Multi-layer perceptron | Layered node grid, forward-pass wave animation |
| `/ai-ml/backprop` | Gradient flow | Reverse-color pulse through MLP on scroll |
| `/ai-ml/cnn-from-scratch` | Convolution | 3D image volume + sliding kernel + feature maps stacked |
| `/ai-ml/attention` | Self-attention | Token spheres, QK matrix lit as a grid, softmax heatmap |
| `/ai-ml/transformer` | Full block | Stacked attention + FFN layers, residual ribbons |

## v2 Candidates
RNN/LSTM memory cells, GANs (generator vs discriminator duel), diffusion (noise → image morph), embeddings (t-SNE 3D walkthrough), RL policy rollouts.

## Shared 3D Primitives (`/src/three/ml/`)
- `<Neuron>` — sphere + glow by activation
- `<Weight>` — line/tube colored by sign + magnitude
- `<Layer>` — grid of neurons with layout helpers
- `<ActivationWave>` — propagation animation
- `<Matrix>` — instanced cell grid, value → color
- `<Tensor3D>` — volumetric box with slice viewer
- `<AttentionLines>` — QK connection bundle
- `<GradientField>` — vector arrows for backprop viz

## Data Sources
- Pre-trained tiny models baked into JSON at build time
- `tinygrad` or in-browser `ort-web` for live inference on small models
- Deterministic seeds so scenes are reproducible

## Scroll Choreography Pattern
Each ML route follows this pattern:
1. **Intro** — the math object, static, wireframe
2. **Unfold** — layers/components separate in space
3. **Forward pass** — data flows through, lit with color
4. **Zoom in** — one subcomponent (e.g., one attention head)
5. **Live knobs** — user adjusts weights, sees downstream change
6. **Recap** — collapse back to iconic still frame

## Performance Rules For ML Scenes
- Instanced meshes for anything > 100 copies
- Weights as texture lookups, not per-object uniforms
- Attention matrices ≤ 64×64 on mobile
- Pause animations when tab hidden

## Accessibility
Every ML scene must include in segment B:
- Plain-English walkthrough of the same ideas
- Static PNG snapshot of key frames
- Math formulation in KaTeX

## Future: Interactive Playground
`/ai-ml/playground/<model>` — live training in-browser on tiny datasets (MNIST-lite), loss curve next to 3D weight heatmap. v2+.

## Docs
Every `/ai-ml/*` route still follows the standard in doc 10. No shortcut.
