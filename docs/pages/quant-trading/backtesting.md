# Page Doc — `quant-trading/backtesting`

## 1. Route
- **Path:** `/quant-trading/backtesting`
- **Title:** Backtesting — Testing Strategies Honestly
- **Author:** Fre-ed Team
- **Published:** 2026-05-15
- **Last updated:** 2026-05-15

## 2. Learning Goal
The reader understands what a backtest is and why it can be misleading, how to compute equity curves and drawdown metrics, the dangers of look-ahead bias and survivorship bias, and how walk-forward analysis provides honest out-of-sample validation.

## 3. Scene Concept
- **Core visual metaphor:** A cyan equity curve building left-to-right over a dark chart. Red box-geometry bars fill the area between the equity line and its running peak whenever the strategy is underwater (drawdown). A grey dashed horizontal line marks the initial portfolio value.
- **Camera:** `[0, 1, 8]` looking at origin.
- **Key objects:**
  - Cyan Line: 60-point equity curve mapped to x ∈ [−4, 4] and y ∈ [−0.4, 2.8]
  - Red BoxGeometry bars: one per time step where drawdown < −0.5%; height proportional to drawdown depth; positioned so the top of each bar touches the equity line
  - Grey dashed Line: horizontal baseline at `y = toY(EQUITY[0])` — the starting portfolio value
  - Faint horizontal grid lines at y ∈ [−0.4, 0.4, 1.2, 2.0, 2.8]
- **Interactive control:** None — scroll drives the animation.
- **Color / mood:** Dark background; cyan = equity, red = drawdown pain, grey = starting reference.

## 4. Scroll Choreography
| Scroll % | What happens |
|----------|-------------|
| 0–100%   | `visibleCount = floor(progress * 60)` reveals equity and drawdown bars left-to-right |
| ~25%     | First drawdown (dd1: indices 15–25) becomes visible as a red filled trough |
| ~65%     | Second, deeper drawdown (dd2: indices 38–50) appears |
| 100%     | Full equity curve with both recovery periods visible |

## 5. Content Outline
- H2: What is a backtest? (definition, scene guide, Callout about perfect-looking backtests)
- H2: The equity curve and drawdown (equity curve and drawdown formulas, MDD definition, drawdown duration concept, Python comprehensive metrics function)
- H2: Look-ahead bias and survivorship bias (look-ahead examples, `.shift(1)` rule, Callout warning, survivorship bias formula, quantified survivorship bias with Python simulation code)
- H2: Walk-forward validation (expanding vs rolling vs purged-embargo splits table, walk-forward formula, OOS Sharpe vs IS Sharpe diagnostic rule, Callout about OOS/IS gap)
