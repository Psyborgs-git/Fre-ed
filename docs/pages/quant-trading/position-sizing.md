# Page Doc — `quant-trading/position-sizing`

## 1. Route
- **Path:** `/quant-trading/position-sizing`
- **Title:** Position Sizing — Kelly Criterion & Risk
- **Author:** Fre-ed Team
- **Published:** 2026-04-17
- **Last updated:** 2026-04-17

## 2. Learning Goal
The reader understands the 1% rule, how to derive and apply the Kelly criterion, what risk of ruin means and how to estimate it via Monte Carlo, and why fractional Kelly is the practical standard. They can implement a position sizing framework in Python.

## 3. Scene Concept
- **Core visual metaphor:** A 3D risk pyramid — five vertical bars of decreasing height, coloured green → amber → red by conviction. A red dashed horizontal line marks the max risk threshold. Bar heights respond to `riskPct` and `winRate` props via Kelly calculation.
- **Camera:** `[0, 2, 7]`, fov 45, looking at origin.
- **Key objects:**
  - 5 BoxGeometry bars at x positions `[-1.6, -0.8, 0, 0.8, 1.6]`
  - Bars positioned so bottom is at y=0: `position=[x, height/2, 0]`
  - Red dashed Line at `y = min(riskPct * 0.5, 3.5)` — max risk threshold
  - Horizontal grid lines at y = 0.5, 1.0, ..., 3.5
  - Bars pulse gently via `useFrame` (scale.y ±1.5%)
- **Interactive controls:**
  - Risk % slider (0.5–5, step 0.5, default 1.0) — scales bar heights
  - Win Rate slider (0.3–0.8, step 0.05, default 0.55) — changes Kelly fraction

## 4. Scroll Choreography
| Scroll % | What happens |
|----------|-------------|
| 0–100%   | Bar `emissiveIntensity` increases with progress (0.2 → 0.6) |
| All      | Bars always visible; controls change heights live |

## 5. Content Outline
- H2: How much should you risk? (overview, scene map)
- H2: The 1% rule (formula, losing streak table)
- H2: Kelly criterion (formula, derivation, example calculation, Python)
- H2: Risk of ruin (formula, Monte Carlo simulation in Python)
- H2: Fractional Kelly and practical sizing (convex combination insight)
- H2: Putting it together (full PositionSizer class in Python)
