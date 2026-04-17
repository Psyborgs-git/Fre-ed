# Page Doc — `quant-trading`

## 1. Route
- **Path:** `/quant-trading`
- **Title:** Quant & Trading Algorithms Series
- **Author:** Fre-ed Team
- **Published:** 2026-04-17
- **Last updated:** 2026-04-17

## 2. Learning Goal
Build a full 3-stage learning series that takes a learner from trading basics to advanced quant research and machine-learning-driven edge development, with every concept reinforced through interactive visuals (2D charts, heatmaps, and 3D diagrams/surfaces).

## 3. Scene Concept
- **Core visual metaphor:** A staged “research pipeline” where learners progress from price action → systematic strategy design → ML-driven portfolio intelligence.
- **Visual language by stage:**
  - **Beginner:** 2D OHLC/candlestick charts, moving-average overlays, volume bars, support/resistance bands.
  - **Intermediate:** correlation heatmaps, equity curve + underwater charts, scatter plots, parameter-surface previews.
  - **Expert:** 3D volatility surfaces, network graphs for asset/factor relationships, Monte Carlo distribution landscapes, efficient-frontier surfaces.
- **Interaction model:** each lesson page pairs prose with a synchronized chart/scene panel, with scroll- or step-driven transitions showing concept evolution.

## 4. Scroll Choreography
| Scroll % | Stage | Visual transition | Learning emphasis |
|---|---|---|---|
| 0–33% | Beginner | Static-to-annotated candlestick and MA overlays | Core market mechanics + simple strategy intuition |
| 34–66% | Intermediate | Heatmaps, equity curves, underwater and parameter plots animate in | Validation, robustness, and edge testing |
| 67–100% | Expert | 3D surfaces/network views and regime/ML model diagnostics | Production-grade quant research and adaptive edge exploitation |

## 5. Content Outline

### Stage 1 — Beginner
**Fundamentals**
- Markets work (buy/sell/price)
- Candlestick charts
- Trend vs noise
- Risk vs reward
- Position sizing 101

**Concepts**
- Moving averages (SMA, EMA)
- Support/resistance
- Volatility basics
- Win rate vs profit factor
- Drawdown

**Simple Strategies**
- Mean reversion
- Trend following
- Breakout trading
- Simple moving average crossover
- Basic momentum

**Visual Elements**
- 2D price charts
- Volume bars
- MA overlay

---

### Stage 2 — Intermediate
**Concepts**
- Correlation & covariance
- Sharpe ratio
- Sortino ratio
- Maximum drawdown
- Holding period analysis

**Strategies**
- Multi-timeframe analysis
- Channel breakouts
- Bollinger Bands
- RSI/MACD edge hunting
- Pairs trading basics
- Factor rotation

**Edge Finding**
- Statistical significance testing
- Backtesting frameworks
- Data snooping awareness
- Walk-forward testing
- Regime detection

**Advanced Charts**
- Heatmaps (correlation matrices)
- 3D surface plots (parameter optimization)
- Equity curves with underwater plots
- Scatter plots (return vs risk)

---

### Stage 3 — Expert
**Advanced Algorithms**
- Machine learning classification (market regimes)
- Neural networks for price prediction
- Reinforcement learning for portfolio optimization
- Hidden Markov Models
- GARCH models for volatility

**Market Microstructure**
- Order flow analysis
- Limit order book dynamics
- High-frequency trading mechanics
- Execution algorithms
- Slippage models

**Edge Development**
- Multi-factor models (Fama-French, etc.)
- Systematic style factors
- Alternative data integration
- Latency-aware strategies
- Risk parity frameworks

**Complex Strategies**
- Statistical arbitrage
- Volatility surface trading
- Options-based hedging
- Cross-asset correlations
- Adaptive parameter optimization

**Advanced Analytics**
- 3D volatility surfaces
- Network graphs (asset relationships)
- Heatmaps (rolling correlations)
- Drawdown analysis in 3D
- Monte Carlo simulations (visualization)
- Factor attribution 3D plots
- Portfolio efficient frontier surfaces

**Research Methods**
- Out-of-sample validation
- Cross-validation techniques
- Robustness testing
- Parameter stability analysis
- Economic reasoning for edges

## 6. Implementation Plan (Detailed)

### A. Curriculum & Architecture Planning
1. Finalize the series information architecture:
   - Stage hubs: Beginner / Intermediate / Expert.
   - Lesson-level routes per topic cluster.
   - Shared lesson shell with synchronized visual pane + reading pane.
2. Define lesson metadata schema:
   - Stage, prerequisites, learning objectives, required datasets, visual type (2D/heatmap/3D), assessment type.
3. Prioritize launch scope:
   - Phase 1: Stage 1 complete + selected Stage 2 foundations.
   - Phase 2: Full Stage 2 + initial Stage 3 research modules.
   - Phase 3: Full Stage 3 with advanced ML and microstructure labs.

### B. Stage-by-Stage Build Sequence
1. **Beginner first:** ship high-clarity chart-centric modules and baseline backtest visual explainers.
2. **Intermediate second:** add statistical testing workflow, parameter sensitivity tools, and walk-forward/regime modules.
3. **Expert third:** add ML lifecycle modules (data pipeline → model training → validation → deployment/risk controls) and microstructure/advanced strategy stack.

### C. Visual System Roadmap
1. Build reusable chart primitives:
   - Candles, volume, overlays, indicator bands, event markers.
2. Build reusable analytics primitives:
   - Heatmap, equity+underwater combo, risk-return scatter, optimization surface.
3. Build reusable 3D research primitives:
   - Volatility surface renderer, network graph renderer, Monte Carlo trajectory cloud, efficient frontier surface.
4. Standardize interaction controls:
   - Time window, parameter sliders, regime toggles, model selector, replay/scrub controls.

### D. ML Edge-Finding Framework for Courses
1. Introduce edge hypothesis lifecycle progressively:
   - Hypothesis → feature engineering → baseline model → validation → robustness → execution constraints.
2. Stage mapping:
   - **Beginner:** intuition for features/signals and overfitting risk.
   - **Intermediate:** significance testing, walk-forward splits, regime-aware diagnostics.
   - **Expert:** classification/regression/RL workflows, HMM+GARCH regime-volatility stack, factor and alt-data integration.
3. Add anti-overfitting guardrails to all advanced modules:
   - Out-of-sample checks, cross-validation variants, stability tests, economic rationale checks.

### E. Delivery & Content Production Workflow
1. For each lesson:
   - Write learning goal and concept narrative.
   - Define visual storyboard (key frames + interactions).
   - Draft assessment and “edge validation checklist”.
2. QA gates before publish:
   - Concept accuracy review.
   - Visual clarity review.
   - Robustness/risk language review.
3. Keep docs/session continuity:
   - Every new route gets a corresponding `docs/pages/<path>.md`.
   - Changelog updates on each lesson doc.
   - Keep a single source-of-truth roadmap section in this file for future sessions.

### F. Milestone Outcomes
1. **Beginner milestone:** users can read charts, size risk, and implement simple rule-based strategies.
2. **Intermediate milestone:** users can test and validate edges with proper statistics and robustness workflows.
3. **Expert milestone:** users can design, validate, and risk-manage ML/systematic strategies with microstructure-aware execution constraints.

## 7. Dependencies
- Shared route shell and scene/content choreography patterns under `/src/components`.
- Existing quant route (`/src/routes/quant-trading/index.jsx`) as current hub baseline.
- Future reusable visualization components should be extracted for cross-lesson reuse.

## 8. Performance Notes
- Prefer progressive rendering and selective scene activation for complex 3D analytics modules.
- Use staged loading (stage hub first, heavy 3D analytics on demand) to control initial bundle impact.

## 9. Accessibility Notes
- Every chart/3D scene needs text-equivalent interpretation in prose.
- Keyboard-operable controls for parameter sliders/toggles.
- Reduced-motion behavior for animated transitions and simulations.

## 10. Open Questions / Future Work
- Should each stage be a separate route subtree (`/quant-trading/beginner/*`, etc.) or one adaptive hub with filtered lesson cards?
- Which datasets are canonical for examples (equities only vs multi-asset from the start)?
- What depth of coding implementation is expected per lesson (conceptual notebooks vs production-ready strategy templates)?

## 11. Changelog
| Date | Author | Change |
|---|---|---|
| 2026-04-17 | Fre-ed Team | Added full 3-stage quant/trading algorithms + ML edge-finding implementation plan and curriculum map |
