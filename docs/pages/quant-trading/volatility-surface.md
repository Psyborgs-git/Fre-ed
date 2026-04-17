## 1. Route

`/quant-trading/volatility-surface`

## 2. Learning Goal

Understand implied volatility as the market's forward-looking vol estimate, how it varies across strikes and expiries to form a 3D surface, the economic meaning of the smile and skew shapes, the term structure of volatility, and the no-arbitrage conditions that constrain the surface.

## 3. Scene Concept

A 10×10 grid of small spheres (100 total) represents the implied-volatility surface over a strike range of 0.8–1.2 (moneyness) and an expiry range of 0.1–2.0 years. Each sphere's y-position encodes its implied vol, and its colour interpolates from violet (low vol) through cyan to amber (high vol). The surface slowly rotates on the Y-axis when reduced-motion is off. Three shape presets (Smile, Skew, Flat) demonstrate the canonical surface profiles.

## 4. Scroll Choreography

- **0 → 100 %**: All sphere y-positions multiply by `progress`, rising from the flat plane (progress = 0) to the full implied-vol surface (progress = 1). Rotation continues independently of scroll.

## 5. Content Outline

1. **Implied volatility** — Black-Scholes IV inversion, Newton-Raphson on vega, realized vs. implied vol, variance risk premium, Python BS pricer and IV solver.
2. **The volatility smile** — smile vs. skew vs. flat profiles, moneyness parameterisation, SABR model approximation.
3. **Term structure** — upward/inverted/humped term structures, calendar spread strategies, SVI total variance parameterisation, Python SVI fitting.
4. **Surface arbitrage** — calendar spread no-arbitrage (non-decreasing total variance), butterfly no-arbitrage (non-negative Dupire local vol), put-call parity, practical wing caveats.
