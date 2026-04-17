# Page Doc — `quant-trading/moving-averages`

## 1. Route
- **Path:** `/quant-trading/moving-averages`
- **Title:** Moving Averages — Smoothing Price Series
- **Author:** Fre-ed Team
- **Published:** 2026-04-17
- **Last updated:** 2026-04-17

## 2. Learning Goal
The reader understands the difference between SMA and EMA, how to compute both from first principles and with pandas, what crossover signals mean, and why lag is the fundamental trade-off. They understand when to prefer each type of moving average.

## 3. Scene Concept
- **Core visual metaphor:** 40 price points (amber Line), SMA overlay (cyan Line, lineWidth 2), EMA overlay (violet Line, lineWidth 2). Glowing spheres at crossover points (green = golden cross, red = death cross).
- **Camera:** `[0, 0, 7]` looking at origin.
- **Key objects:**
  - Amber line: raw 40-point price series from cosine formula
  - Cyan line: SMA computed from PRICES with `period` prop
  - Violet line: EMA computed from PRICES with `period` prop
  - Green/red spheres: crossover points where SMA and EMA intersect
  - Horizontal grid lines
- **Interactive control:** Period slider (5–30, step 1, default 10) changes MA window live.
- **Color / mood:** Dark background; amber = raw data, cyan = SMA, violet = EMA.

## 4. Scroll Choreography
| Scroll % | What happens |
|----------|-------------|
| 0–100%   | Crossover spheres increase emissiveIntensity with progress |
| All      | All lines visible throughout; progress drives sphere glow |

## 5. Content Outline
- H2: Smoothing price series (overview, scene map)
- H2: Simple Moving Average (SMA formula, Python code)
- H2: Exponential Moving Average (EMA formula, Python code, SMA vs EMA comparison)
- H2: Crossover signals (golden cross / death cross formula, Python code)
- H2: The lag problem (responsiveness vs noise table)
- H2: When to use SMA vs EMA (comparison table)
