# Page Doc — `quant-trading/bollinger-bands`

## 1. Route
- **Path:** `/quant-trading/bollinger-bands`
- **Title:** Bollinger Bands — Volatility Envelopes
- **Author:** Fre-ed Team
- **Published:** 2026-05-15
- **Last updated:** 2026-05-15

## 2. Learning Goal
The reader understands how Bollinger Bands are constructed from SMA and rolling standard deviation, how to interpret the squeeze and bandwidth expansion, when to use the bands as a mean-reversion signal vs a breakout signal, and how to size positions using band width as a volatility proxy.

## 3. Scene Concept
- **Core visual metaphor:** A cyan price line between two amber Bollinger Band lines. The violet SMA midline is visible. Red spheres mark upper band touches (potential mean-reversion short / breakout long); green spheres mark lower band touches. A visible squeeze period (indices 20–30) shows the amber bands narrowing then expanding.
- **Camera:** `[0, 0, 8]` looking at origin.
- **Key objects:**
  - Cyan Line: 50-point BB_PRICES mapped to y ∈ [−2, 2]
  - Amber Lines (2): upper and lower Bollinger bands (null before period-1)
  - Violet Line: SMA midline
  - Red spheres: indices where price >= upper band
  - Green spheres: indices where price <= lower band
  - Faint horizontal grid lines at y ∈ [−2, −1, 0, 1, 2]
- **Interactive controls:**
  - Period range slider (10–30, step 2, default 20): changes SMA window
  - StdDev range slider (1.0–3.0, step 0.25, default 2.0): changes band multiplier
- **Color / mood:** Dark background; cyan = price, amber = bands, violet = SMA, green/red = signal spheres.

## 4. Scroll Choreography
| Scroll % | What happens |
|----------|-------------|
| 0–100%   | `visibleCount = floor(progress * 50)` reveals price, bands, and spheres left-to-right |
| ~40%     | Squeeze zone (indices 20–30) becomes visible — bands narrow noticeably |
| ~60%     | Post-squeeze expansion visible — bands widen after the squeeze |
| All      | Band lines and SMA only render where data is non-null (i.e., from index `period-1` onward) |

## 5. Content Outline
- H2: Band construction (SMA, rolling std, upper/lower band formulas, "90% price action" statistic, Python bollinger_bands function)
- H2: Squeeze and expansion (Bandwidth formula, %B indicator formula/interpretation table, Callout about squeeze zone visible in scene, Python detect_squeeze function)
- H2: Mean-reversion signals (mean-reversion signal piecewise formula, works in range-bound conditions, Callout warning about trend filter / 200-day SMA)
- H2: Breakout signals (breakout logic after squeeze, combined squeeze+signal Python function, volatility-based position sizing formula)
