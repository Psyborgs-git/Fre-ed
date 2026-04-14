# Page Doc — `ai-ml/diffusion`

## 1. Route
- **Path:** `/ai-ml/diffusion`
- **Title:** Diffusion Models — Denoising as Generation
- **Author:** Fre-ed Team
- **Published:** 2026-04-14
- **Last updated:** 2026-04-14

## 2. Learning Goal
The reader understands DDPM's forward noising process, the closed-form one-step noising formula, the noise-prediction training objective, how the reverse denoising process generates data, and how latent diffusion and classifier-free guidance extend this to state-of-the-art image generation.

## 3. Scene Concept
- **Core visual metaphor:** Eight timestep columns from left (clean, structured) to right (pure noise). Data particles cluster at the left; scatter into noise at the right. Amber arrows above show the forward direction; cyan arrows below show the reverse.
- **Camera arc:** Starts at `[0, 0.5, 8]`; gently rises as scroll progresses to see the full timeline.
- **Key objects:**
  - Violet spheres (left 1-2 cols): clean data particles, clustered
  - Cyan spheres (middle cols): partially noised particles, scattered more
  - Grey spheres (right cols): pure noise, maximally scattered
  - Grey noise cloud points: additional random scatter at high-noise steps
  - Amber arrows (top lane): forward noising q(x_t | x_{t-1}) direction
  - Cyan arrows (bottom lane): reverse denoising p_θ(x_{t-1} | x_t) direction
- **Color / mood:** Clean → messy gradient communicates information destruction; reverse arrows in cyan symbolise the learned recovery.

## 4. Scroll Choreography
| Scroll % | What happens | Camera | Objects |
|---|---|---|---|
| 0–45% | Particle columns appear left to right | `z=8` | Spheres scale in, scatter increases |
| 45–65% | Forward arrows draw from left to right (top lane) | Steady | Amber arrows |
| 65–100% | Reverse arrows draw from right to left (bottom lane) | Rise | Cyan arrows |

## 5. Content Outline (segment B)
- H2: A generative model from first principles (scene description, left=clean/right=noise)
- H2: The forward process (DDPM Markov chain, β schedule, closed-form one-step formula)
- H2: The reverse process (neural network parameterisation, mean formula)
- H2: Training objective (simplified ELBO, noise prediction loss, training loop code)
- H2: The denoising network — U-Net (encoder-decoder, skip connections, time embedding)
- H2: Score matching and SDEs (continuous SDE formulation, score function connection)
- H2: Latent diffusion — Stable Diffusion (VAE encoding, cross-attention conditioning)
- H2: Classifier-free guidance (formula, guidance scale w, prompt adherence tradeoff)
- H2: DiT — Diffusion Transformers (patch-based, adaptive LN, FLUX/Sora)
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
- **Triangle count:** 8×5 particle spheres + noise cloud points — low/moderate
- **Draw calls:** ~100 at full visibility (many small meshes)
- **Shader complexity:** Standard PBR; transparent materials
- **Mobile strategy:** `dpr={[1, 2]}`; noise cloud count could reduce on low-end
- **Memory:** Negligible

## 9. Accessibility Notes
- `<Canvas>` aria-hidden
- Legend explains colour → noise level mapping
- `prefers-reduced-motion`: flutter animations disabled; particles static on scroll

## 10. Open Questions / Future Work
- Animate a single particle's path through all timesteps (selected particle highlight)
- Add a live denoising preview: slider scrubs through T steps showing image recovering
- Visualise the U-Net architecture inline as a separate diagram scene

## 11. Changelog
| Date | Author | Change |
|---|---|---|
| 2026-04-14 | Fre-ed Team | Initial implementation |
