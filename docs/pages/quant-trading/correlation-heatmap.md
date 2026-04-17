## 1. Route

`/quant-trading/correlation-heatmap`

## 2. Learning Goal

Understand how pairwise asset correlations are computed, visualised, and used to quantify diversification. Recognise the difference between stable and crisis-period correlations, and understand why correlation shrinkage matters in high-dimensional portfolios.

## 3. Scene Concept

A 5×5 grid of glowing box meshes represents the pairwise correlation matrix for five assets. Cell colour interpolates from deep red (−1) through white (0) to deep green (+1), matching the sign and magnitude of each correlation coefficient. The diagonal is always green (self-correlation = 1). Three presets (Equities, Multi-asset, Crypto) demonstrate distinct correlation regimes. Camera is slightly tilted for a 3D perspective view.

## 4. Scroll Choreography

- **0 → 100 %**: All 25 cells animate their colour from neutral white/grey (value = 0) to their true correlation value. The diagonal cells instantly register green at scroll start, providing a stable anchor.

## 5. Content Outline

1. **What is correlation?** — Pearson formula, the [−1, +1] range, scene walkthrough for each asset preset.
2. **The covariance matrix** — relationship between correlation and covariance, portfolio variance formula $\mathbf{w}^\top \Sigma \mathbf{w}$, Ledoit-Wolf shrinkage.
3. **Portfolio diversification** — variance reduction formula for equal-weight portfolios, effective-N, systematic risk floor $\sigma\sqrt{\bar\rho}$.
4. **Correlation breakdown in crises** — conditional correlation analysis (stress vs. calm), inflationary vs. deflationary regimes, Pearson vs. Spearman rank correlation, rolling correlation monitoring.
