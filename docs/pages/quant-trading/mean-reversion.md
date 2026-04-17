# Page Doc — `quant-trading/mean-reversion`

## 1. Route
- **Path:** `/quant-trading/mean-reversion`
- **Title:** Mean Reversion — Pairs Trading & OU Process
- **Author:** Fre-ed Team
- **Published:** 2026-05-01
- **Last updated:** 2026-05-01

## 2. Learning Goal
The reader understands what mean reversion is, how to normalise a spread into a z-score, how to define entry/exit rules around z-score thresholds, how to estimate Ornstein-Uhlenbeck parameters (kappa, mu, sigma), and what risks (cointegration breakdown, crowding, regime shift) erode the edge over time.

## 3. Scene Concept
- **Core visual metaphor:** A violet price series oscillating around a cyan equilibrium (mean) line. Amber dashed lines mark the ±Z-threshold standard-deviation bands. Green spheres appear at long-entry crossings (price drops below lower band); red spheres appear at exit crossings (price reverts through the mean).
- **Camera:** `[0, 0, 8]` looking at origin.
- **Key objects:**
  - Violet line: 50-point deterministic price series centred on zero (PRICES array)
  - Cyan horizontal line: mean at y = 0
  - Two amber dashed horizontal lines: y = ±zThreshold * STD
  - Green spheres: index where price crosses below −zThreshold * STD
  - Red spheres: index where price reverts above 0 while in a long trade
  - Faint horizontal grid lines
- **Interactive control:** Z-threshold range slider (1.0–3.0, step 0.25, default 2.0) — changes band width and signal positions live.
- **Color / mood:** Dark background; violet = price, cyan = mean, amber = bands, green/red = trade lifecycle.

## 4. Scroll Choreography
| Scroll % | What happens |
|----------|-------------|
| 0–100%   | Price line builds left-to-right; `visibleCount = floor(progress * N)`. Entry/exit spheres appear as their index enters the visible window. |
| All      | Mean and band lines are always visible as reference context. |

## 5. Content Outline
- H2: What is mean reversion? (definition, scene guide, intuition, Callout about spreads vs raw prices)
- H2: The Z-score signal (z-score formula, entry/exit rule with piecewise formula, Python code for rolling z-score and state-machine signal generator)
- H2: Entry and exit rules (4-step framework, stop-loss importance, Callout about cointegration breakage, pairs trading preview with OU process equation and half-life formula, Python OU MLE parameter estimation code)
- H2: Edge persistence (risk table: regime shift, liquidity, momentum blowout, crowding; half-life diagnostic)
