# Page Doc — `quant-trading/candlestick-charts`

## 1. Route
- **Path:** `/quant-trading/candlestick-charts`
- **Title:** Candlestick Charts — Reading OHLC Data
- **Author:** Fre-ed Team
- **Published:** 2026-04-17
- **Last updated:** 2026-04-17

## 2. Learning Goal
The reader understands the four OHLC values that make up a candlestick, how to interpret body size and wick length as signals of buying/selling conviction, and how to recognise common bullish and bearish reversal patterns. They finish ready to parse OHLC data programmatically in Python.

## 3. Scene Concept
- **Core visual metaphor:** 20 3D candlesticks arranged in a horizontal time series, with volume bars beneath, rendered in green (bullish) and red (bearish). Wicks are thin Line segments extending from the body to the high/low prices.
- **Camera:** `[0, 0, 8]` looking at origin; moderate orbital freedom.
- **Key objects:**
  - 20 green/red BoxGeometry bodies — width 0.3, height proportional to |close-open|
  - Upper and lower wick Lines (same color as body)
  - Volume bars below a separator line (semi-transparent, same color)
  - Horizontal grid lines for price reference
- **Scroll animation:** Candles appear left to right as scroll progress increases; `revealCount = round(progress * 20)`.
- **Color / mood:** Dark background; #34d399 green for bullish, #f43f5e red for bearish.

## 4. Scroll Choreography
| Scroll % | What happens |
|----------|-------------|
| 0%       | No candles visible |
| 0–100%   | Candles reveal left to right (1 per ~5% scroll) |
| 100%     | All 20 candles + volume bars visible |

## 5. Content Outline
- H2: What is a candlestick? (anatomy table, scene map)
- H2: OHLC data structure (Python DataFrame example)
- H2: Body and wicks — the anatomy (formulas for body/wicks)
- H2: Bullish patterns (hammer, engulfing, morning star, marubozu + Python)
- H2: Bearish patterns (shooting star, evening star, dark cloud)
- H2: How market makers read candles (volume, stop hunts, dollar volume formula)
