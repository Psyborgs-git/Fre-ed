## 1. Route

`/quant-trading/efficient-frontier`

## 2. Learning Goal

Understand the Markowitz mean-variance framework, derive and visualise the efficient frontier in 3D (vol × return × Sharpe), locate the minimum-variance and max-Sharpe (tangency) portfolios, and appreciate the practical limitations of MVO that motivate Black-Litterman and risk-parity approaches.

## 3. Scene Concept

A 3D scatter of 50 portfolio points (x = volatility, y = return, z = Sharpe ratio) is rendered as coloured spheres interpolating from red/orange (low Sharpe) to cyan/blue (high Sharpe). A bright cyan curve traces the efficient frontier (pareto-optimal portfolios). A glowing violet sphere marks the minimum-variance portfolio and a glowing amber sphere marks the max-Sharpe portfolio. The entire scene slowly rotates around the Y-axis. A range slider sets the number of assets (3–10), adjusting the scatter spread.

## 4. Scroll Choreography

- **0 → 50 %**: Portfolio scatter points reveal sequentially (50 × progress points visible).
- **50 → 65 %**: Efficient frontier cyan curve cross-fades in.
- **65 → 75 %**: Min-variance violet sphere fades in.
- **80 → 100 %**: Max-Sharpe amber sphere fades in.

## 5. Content Outline

1. **Mean-variance framework** — Markowitz (1952), portfolio return and variance formulas $\mu_p = \mathbf{w}^\top\boldsymbol{\mu}$ and $\sigma_p^2 = \mathbf{w}^\top\Sigma\mathbf{w}$, Monte Carlo random portfolio simulation.
2. **The efficient frontier** — definition of dominated vs. efficient portfolios, quadratic programming problem, two-fund separation theorem, Python scipy.optimize.minimize solution.
3. **Min-variance & max-Sharpe** — closed-form min-variance weights $\Sigma^{-1}\mathbf{1}$, max-Sharpe (tangency) portfolio $\Sigma^{-1}(\boldsymbol{\mu}-r_f\mathbf{1})$, capital market line.
4. **Beyond MVO** — estimation error problem, corner solutions, non-normality, Black-Litterman model, Ledoit-Wolf covariance, CVaR optimisation, rolling-window regularisation.
