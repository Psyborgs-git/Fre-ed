# Page Doc — `ai-ml/embeddings`

## 1. Route
- **Path:** `/ai-ml/embeddings`
- **Title:** Embeddings — Turning Tokens into Vectors
- **Author:** Fre-ed Team
- **Published:** 2026-04-14
- **Last updated:** 2026-04-14

## 2. Learning Goal
The reader understands how discrete tokens are mapped to dense continuous vectors, why semantically similar tokens cluster geometrically, how cosine similarity measures semantic distance, and how positional encodings inject sequence order into a permutation-invariant transformer.

## 3. Scene Concept
- **Core visual metaphor:** Eight labelled tokens floating in a 3D embedding space — royalty, gender, animals, geography — clustering by semantic similarity with an amber arrow tracing the king − man + woman ≈ queen analogy.
- **Camera arc:** Starts at `[0, 1, 8]`; gently rises and pulls back as scroll progresses to reveal cluster structure.
- **Key objects:**
  - Violet spheres: king, queen (royalty cluster)
  - Cyan spheres: man, woman (gender cluster)
  - Amber spheres: dog, cat (animal cluster)
  - Green spheres: paris, france (geography cluster)
  - Three grey axis lines: embedding space X/Y/Z
  - Thin coloured lines: intra-cluster similarity connections
  - Amber arrow: king → queen analogy
- **Color / mood:** Dark background; each cluster has its own colour; axes are subtle dark grey.

## 4. Scroll Choreography
| Scroll % | What happens | Camera | Objects |
|---|---|---|---|
| 0–5% | Axis lines fade in | `z=8` | Grid axes appear |
| 0–40% | Token spheres materialise one by one | Steady | Each sphere scales from 0 |
| 40–55% | Intra-cluster similarity lines draw | Pull back | Coloured lines per cluster |
| 55–70% | Camera rises to see clusters from above | `y rises` | All tokens visible |
| 70–100% | Amber analogy arrow draws king→queen | `z≈10` | Arrow glows amber |

## 5. Content Outline (segment B)
- H2: What is an embedding? (dense vectors, scene map table)
- H2: From one-hot to dense vectors (sparsity, embedding matrix formula)
- H2: Word2Vec — learning geometry from context (CBOW, skip-gram, negative sampling)
- H2: Cosine similarity (formula, code example)
- H2: Vector arithmetic and analogies (king − man + woman ≈ queen)
- H2: Subword embeddings — BPE and tokenisation (OOV problem, GPT-4 vocabulary)
- H2: Positional embeddings (sinusoidal, RoPE, code)
- H2: Embedding dimensions and the curse of dimensionality (JL lemma, table)
- H2: PyTorch implementation (full code example)
- H2: Summary

## 6. Assets
| File | Type | Source | License |
|---|---|---|---|
| — | — | All geometry procedural; no external assets | — |

## 7. Dependencies
- Shared components: `RouteLayout`, `Callout`, `CodeBlock`, `TagPill`
- Shared 3D primitives: none (inline)
- External libs beyond baseline: none

## 8. Performance Notes
- **Triangle count:** 8 × spheres (24×24) + axes + lines — very low
- **Draw calls:** ~25 at full visibility
- **Shader complexity:** Standard PBR, no textures
- **Mobile strategy:** `dpr={[1, 2]}`; all geometry is lightweight
- **Memory:** Negligible

## 9. Accessibility Notes
- `<Canvas>` has `aria-hidden="true"`
- Every visual element explained in segment B prose table
- No keyboard interactions inside the canvas
- `prefers-reduced-motion`: pulse animations disabled; sphere appear on scroll only

## 10. Open Questions / Future Work
- Add text labels (floating HTML) to each token sphere
- Add a "vocabulary size" slider to show how embedding tables grow
- Show t-SNE/UMAP projection from higher-dimensional real embedding

## 11. Changelog
| Date | Author | Change |
|---|---|---|
| 2026-04-14 | Fre-ed Team | Initial implementation |
