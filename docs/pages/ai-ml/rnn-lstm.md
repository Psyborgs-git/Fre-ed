# Page Doc — `ai-ml/rnn-lstm`

## 1. Route
- **Path:** `/ai-ml/rnn-lstm`
- **Title:** RNN & LSTM — Memory Through Time
- **Author:** Fre-ed Team
- **Published:** 2026-04-14
- **Last updated:** 2026-04-14

## 2. Learning Goal
The reader understands how hidden state flows through time steps, why vanilla RNNs suffer from vanishing gradients for long sequences, how LSTM's additive cell state prevents gradient decay, and how the forget/input/output gates selectively control memory.

## 3. Scene Concept
- **Core visual metaphor:** Six time steps arranged left to right. Input tokens (violet spheres, bottom row) connect upward to hidden state spheres (middle row). Horizontal arrows show the recurrent connection. In LSTM mode, a green "conveyor belt" line flows above the hidden states, and three gate cubes appear at each step.
- **Camera arc:** Starts at `[0, 0.2, 8]`; slowly pulls back and right to reveal the full sequence.
- **Key objects:**
  - Violet spheres (bottom): input tokens x_t
  - Coloured spheres (middle): hidden state h_t — cyan for LSTM (consistent brightness), amber for vanilla RNN (brightness decays)
  - Violet lines: x_t → h_t input arrows
  - Coloured arrows: h_t → h_{t+1} recurrent connections
  - Green horizontal bar (LSTM only): cell state c_t conveyor belt
  - Three coloured cubes per step (LSTM): amber=forget gate, cyan=input gate, violet=output gate
- **Color / mood:** Dark background; LSTM hidden states stay bright across all steps; RNN states fade — communicating the vanishing gradient intuitively.

## 4. Scroll Choreography
| Scroll % | What happens | Camera | Objects |
|---|---|---|---|
| 0–40% | Input tokens and hidden states appear step by step | `z=8` | Spheres scale in |
| 15–50% | Input→hidden arrows draw | Steady | Purple arrows |
| 40–55% | Recurrent arrows draw between hidden states | Pull right | Coloured horizontal arrows |
| 55–75% | LSTM cell state bar + gate cubes appear | `z≈10` | Green bar, gate cubes |
| 75–100% | Camera fully back; memory decay visible in RNN mode | Steady | All elements visible |

## 5. Content Outline (segment B)
- H2: Sequence modelling before transformers (hidden state concept, scene table)
- H2: The vanilla RNN (formula, code, shared weights)
- H2: The vanishing gradient problem (BPTT product of Jacobians, intuition)
- H2: LSTM — gating the memory (cell state, 5 equations, gate explanations)
- H2: GRU — a simpler alternative (update/reset gates, drop-in replacement)
- H2: Bidirectional RNNs (forward + backward, BERT analogy, code)
- H2: RNNs vs Transformers (comparison table)
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
- **Triangle count:** 6×2 spheres + lines + gate cubes — low
- **Draw calls:** ~50 at full LSTM visibility
- **Shader complexity:** Standard PBR; transparent glow materials
- **Mobile strategy:** `dpr={[1, 2]}`
- **Memory:** Negligible

## 9. Accessibility Notes
- `<Canvas>` aria-hidden
- Legend distinguishes LSTM (stable brightness) vs RNN (decaying brightness)
- `prefers-reduced-motion`: pulse animations disabled

## 10. Open Questions / Future Work
- Animate the hidden state value (encode a real number as brightness/size)
- Show BPTT gradient arrows flowing backwards through time steps
- Add stacked RNN layers vertically

## 11. Changelog
| Date | Author | Change |
|---|---|---|
| 2026-04-14 | Fre-ed Team | Initial implementation |
