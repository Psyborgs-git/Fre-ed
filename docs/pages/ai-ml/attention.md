# Page Doc — `ai-ml/attention`

## 1. Route
- **Path:** `/ai-ml/attention`
- **Title:** Self-Attention — How Tokens Talk to Each Other
- **Author:** Fre-ed Team
- **Published:** 2026-04-11
- **Last updated:** 2026-04-11

## 2. Learning Goal
The reader understands how the Query·Key·Value decomposition turns a sequence of tokens
into context-enriched output vectors, what the softmax attention matrix represents, and
why the quadratic complexity in sequence length is the central engineering challenge of
the transformer architecture.

## 3. Scene Concept
- **Core visual metaphor:** A token "voting" graph — every token queries every other
  token, collects weighted votes (the attention matrix), then blends the winning
  values into a rich context vector.
- **Camera arc:** Starts at `[0, 0, 9]` looking at origin; gently pulls back and tilts
  up as scroll progresses to reveal the full left-to-right pipeline.
- **Key objects:**
  - 6 violet input spheres at `x = -4.5`, y positions TOKEN_Y
  - Cyan Q spheres at `x = -2.8`, amber K spheres at `x = -1.8`, violet V spheres at `x = -0.8`
  - N×N cyan arc lines (Q·K score lines) varying in width/opacity by score value
  - 6×6 attention-weight matrix (flat quads) centred at `x = 0`, coloured cyan → amber
  - Amber V-aggregation lines from V column to output column
  - 6 cyan output spheres at `x = 2.8`
- **Color / mood:** Dark background. Violet = tokens/values; cyan = queries/output;
  amber = keys/aggregation weights. Scene reads left-to-right like an information flow.

## 4. Scroll Choreography
| Scroll % | What happens | Camera | Objects |
|---|---|---|---|
| 0% | Input token column visible | `z=9` | 6 violet spheres, dim |
| 15% | Q/K/V projections appear | Slight drift back | Branching spheres + lines |
| 25% | All-to-all Q·K score lines | `z≈10` | N×N cyan arcs, width = score |
| 50% | Softmax: weak lines dim, strong brighten; attention matrix appears | `z≈11` | Matrix glows cyan→amber |
| 70% | Context aggregation + output column | `z≈12` | Amber blend lines, cyan output |
| 90–100% | Camera pulls back for full scene | `z≈12` | All elements at full opacity |

## 5. Content Outline (segment B)
- H2: Every token looks at every other token (intuition, scene map table)
- H2: The Q, K, V decomposition (Q=query, K=key, V=value, projections)
- H2: Scaled dot-product attention (formula, scaling, softmax, weighted sum)
- H2: Multi-head attention (multiple heads, concat + W_O, PyTorch implementation)
- H2: Causal (masked) self-attention (GPT decoder mask, lower-triangular mask code)
- H2: Complexity — the quadratic bottleneck (O(n²) table, FlashAttention mention)
- H2: Positional information and attention (sinusoidal PE, RoPE)
- H2: Summary (full pipeline diagram)

## 6. Assets
| File | Type | Source | License |
|---|---|---|---|
| — | — | All geometry procedural; no external assets | — |

## 7. Dependencies
- Shared components from `/src/components`: `RouteLayout`, `Callout`, `CodeBlock`, `TagPill`
- Shared 3D primitives: none (inline)
- External libs beyond baseline: none

## 8. Performance Notes
- **Triangle count:** Low — 6 × 3 QKV spheres (16×16), 6 input + 6 output spheres (20×20),
  N×N=36 arc lines, 36 matrix quads
- **Draw calls:** ~80 at full visibility
- **Shader complexity:** Standard PBR; no textures; emissiveIntensity is static (no useFrame on matrix cells)
- **Mobile strategy:** `dpr={[1, 2]}`; N×N lines could be reduced to N×top-3 on low-end devices (future)
- **Memory:** Negligible — no textures, no GLBs

## 9. Accessibility Notes
- `<Canvas>` has `aria-hidden="true"` — excluded from screen readers
- Every visual element explained in segment B prose table
- KaTeX math accessible via MathML output
- Token focus controls now let readers isolate one token row in the matrix with keyboard-accessible buttons
- `prefers-reduced-motion`: animations driven by scroll progress (static at progress=0)

## 10. Open Questions / Future Work
- Add token labels (floating text) so viewers can read "the", "cat", "sat" etc.
- Add multi-token compare mode so two attention rows can be inspected side-by-side
- Show the position of multi-head attention — run two heads side-by-side with different colour schemes
- Implement cross-attention variant (encoder-decoder) as a follow-up scene

## 11. Changelog
| Date | Author | Change |
|---|---|---|
| 2026-04-11 | Fre-ed Team | Initial implementation — 6-token self-attention scene with Q/K/V projections, score lines, softmax matrix, context aggregation |
| 2026-04-13 | Fre-ed Team | Added token focus controls, shared legend/scene prompts, and reduced-motion aware camera behavior |
