# Page Doc — `ai-ml/rag`

## 1. Route
- **Path:** `/ai-ml/rag`
- **Title:** RAG — Retrieval-Augmented Generation
- **Author:** Fre-ed Team
- **Published:** 2026-04-11
- **Last updated:** 2026-04-11

## 2. Learning Goal
The reader understands the full RAG pipeline end-to-end: why retrieval is needed (knowledge
cut-off, hallucination), how embeddings and cosine similarity work, how vector databases
enable fast ANN search, how chunks are assembled into a prompt, and the practical decision
of RAG vs fine-tuning.

## 3. Scene Concept
- **Core visual metaphor:** A glowing cyan query sphere sits at the origin surrounded by
  16 flat document rectangles floating in a hemisphere. Similarity rays shoot out, top-3
  amber docs drift left into a context column, and a violet LLM box generates tokens.
- **Camera arc:** Starts at `[0, 1, 7]` fov=55; `CameraRig` drifts back to `z≈9.5` and
  up `y≈0.8` on scroll.
- **Key objects:**
  - 16 flat boxGeometry `(0.65, 0.85, 0.06)` documents scattered in hemisphere
  - Cyan query sphere at origin with outer glow shell
  - 16 similarity rays (Line) from origin to each doc; 3 amber/thick, 13 cyan/thin
  - 3 retrieved docs (amber glow) drift from scattered positions to column at x=-4.5
  - Violet LLM box `(1.0, 1.5, 0.25)` at x=3.5, fades in at 72%+ scroll
  - Cyan output token spheres (up to 5) streaming right from LLM box
- **Color / mood:** Cyan query, dim grey corpus, amber retrieved docs, violet LLM. The
  scene reads as a pipeline: query → corpus → retrieval → generation.

## 4. Scroll Choreography
| Scroll % | What happens | Camera | Objects |
|---|---|---|---|
| 0% | Query sphere + scattered doc corpus | `z=7, y=1` | 16 dim rectangles + cyan sphere |
| 25% | Similarity rays fan out | Camera drifting | 16 lines (thin cyan/amber) |
| 50% | Top-3 docs glow amber | `z≈8, y≈1.3` | Retrieved docs highlighted |
| 75% | Retrieved docs drift to context column; LLM box fades in | `z≈9, y≈1.5` | Context assembled |
| 100% | Tokens stream from LLM; camera at full pullback | `z≈9.5, y≈1.6` | Full pipeline |

## 5. Content Outline (segment B)
- H2: The knowledge cut-off problem
- H2: The RAG pipeline
- H2: Embedding and similarity search
- H2: Vector databases in practice (comparison table)
- H2: Chunking and context window limits
- H2: RAG vs fine-tuning — when to use which
- H2: Advanced RAG patterns (HyDE, CRAG, self-RAG, multi-step)

## 6. Assets
| File | Type | Source | License |
|---|---|---|---|
| — | — | All geometry procedural Three.js | — |

## 7. Dependencies
- Shared components from `/src/components`: `RouteLayout`, `Callout`, `CodeBlock`, `TagPill`
- Shared 3D primitives from `/src/three`: none (all inline)
- External libs beyond baseline: none

## 8. Performance Notes
- **Triangle count:** Low — 16 thin boxes, 1 sphere (24×24) + glow shell, up to 5 token spheres, LLM box
- **Draw calls:** ~40 (16 docs + 16 rays + spheres + LLM box + token stream)
- **Shader complexity:** Standard PBR; `transparent` on most materials
- **Mobile strategy:** `dpr={[1, 2]}`; similarity rays only rendered when `opacity > 0.01`; token stream capped at 5 spheres
- **Memory:** Negligible

## 9. Accessibility Notes
- `<Canvas>` has `aria-hidden="true"`
- Full pipeline explained textually in segment B with Python code examples
- Cosine similarity formula given in KaTeX
- The visual drift from "scattered docs" to "context column" maps to the "chunking + retrieval" concept explained in prose
- Query preset controls now switch which documents are retrieved and sent into the generator

## 10. Open Questions / Future Work
- Replace presets with a free-form query input backed by pre-computed nearest-neighbour matches
- Show embedding space as a 2D projection (PCA/t-SNE) of the document vectors
- Animate the chunking step: show one large doc rectangle splitting into smaller pieces
- Highlight context window capacity with a "fills up" animation on the LLM box

## 11. Changelog
| Date | Author | Change |
|---|---|---|
| 2026-04-11 | Fre-ed Team | Initial implementation — 16-doc corpus, query sphere, similarity rays, top-3 retrieval, LLM generation |
| 2026-04-13 | Fre-ed Team | Added query preset controls, shared lesson overlays, and reduced-motion aware camera motion |
