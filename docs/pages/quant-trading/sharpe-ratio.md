# Page Doc — `quant-trading/sharpe-ratio`

## 1. Route
- **Path:** `/quant-trading/sharpe-ratio`
- **Title:** Sharpe Ratio — Risk-Adjusted Returns
- **Author:** Fre-ed Team
- **Published:** 2026-05-01
- **Last updated:** 2026-05-01

## 2. Learning Goal
The reader understands how to compute and annualise the Sharpe ratio, what its assumptions are, how Sortino and Calmar address those limitations, what the Information Ratio measures, and how to use the Deflated Sharpe Ratio to guard against overfitting.

## 3. Scene Concept
- **Core visual metaphor:** 3D scatter plot of 25 deterministic strategy points in (volatility, return, ratio) space. Points are coloured on a red-to-green gradient according to the selected risk metric. The best point (highest Sharpe) glows cyan. A dashed cyan capital market line (CML) connects the origin to the best strategy.
- **Camera:** `[2, 1, 8]` looking at origin.
- **Key objects:**
  - 25 coloured spheres: each strategy point at position `[vol*20-3, ret*20-1, sharpe*0.5]`
  - Colour gradient: red (#f43f5e) → amber (#f59e0b) → green (#34d399) mapped to normalised metric value
  - Cyan sphere (#22d3ee): best strategy (highest Sharpe), larger radius with high emissiveIntensity
  - Dashed cyan Line: capital market line from `[-3, -1, 0]` to best point
  - Axis reference lines for vol (x) and return (y)
- **Interactive control:** Segmented selector — Sharpe / Sortino / Calmar. Sortino uses `sharpe * 1.2`, Calmar uses `sharpe * 0.75` as a scalar approximation. Color ranking updates instantly.
- **Color / mood:** Dark background; green = high ratio, red = low ratio, cyan = best/CML.

## 4. Scroll Choreography
| Scroll % | What happens |
|----------|-------------|
| 0–100%   | Strategy spheres reveal one-by-one as `visibleCount = floor(progress * 25)` increases |
| All      | CML and axes always visible as context |
| All      | emissiveIntensity of spheres scales with `progress` for a building-glow effect |

## 5. Content Outline
- H2: Return vs risk (overview, scene guide, Callout about switching metrics)
- H2: The Sharpe ratio (formula, annualisation with √252, qualitative benchmarks, Python code)
- H2: Sortino and Calmar ratios (Sortino formula with downside deviation, Calmar formula with MDD, Python code for both)
- H2: Comparing strategies (comparison table Sharpe/Sortino/Calmar/IR, Information ratio formula, Calmar warning about short track records, Callout about Sharpe inflation from autocorrelated returns, Deflated Sharpe Ratio formula)
