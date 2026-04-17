# Page Doc — `quant-trading/trend-vs-noise`

## 1. Route
- **Path:** `/quant-trading/trend-vs-noise`
- **Title:** Trend vs Noise — Signal Decomposition
- **Author:** Fre-ed Team
- **Published:** 2026-04-17
- **Last updated:** 2026-04-17

## 2. Learning Goal
The reader understands the additive decomposition of price series (trend + cycle + noise), how to extract each component using regression, filters, and Fourier analysis, what the Hurst exponent measures, and why distinguishing trend from noise is critical for strategy design.

## 3. Scene Concept
- **Core visual metaphor:** Two animated lines — raw noisy signal (amber, dims with scroll) and underlying trend (cyan, brightens with scroll). The visual transition embodies the act of "extracting" signal from noise.
- **Camera:** `[0, 0, 6]` looking at origin.
- **Key objects:**
  - Amber `line` (native THREE): raw signal = trend + cycle + noise (60 points)
  - Cyan `line` (native THREE): pure linear trend component
  - Both lines use `useFrame` to animate `material.opacity` based on `progress`
  - Horizontal grid lines for reference
- **Scroll animation:**
  - Raw line opacity: `max(0.15, 1 - progress * 0.75)` — dims from 1 to 0.15
  - Trend line opacity: `min(1, progress * 1.5)` — brightens from 0 to 1

## 4. Scroll Choreography
| Scroll % | Raw line opacity | Trend line opacity |
|----------|-----------------|-------------------|
| 0%       | 1.0             | 0.0               |
| 33%      | 0.75            | 0.5               |
| 67%      | 0.5             | 1.0               |
| 100%     | 0.15            | 1.0               |

## 5. Content Outline
- H2: Signal and noise (overview, additive decomposition formula, scene map)
- H2: What is a trend? (formal decomposition, component descriptions)
- H2: Smoothing — extracting signal (linear regression, Savitzky-Golay, HP filter, Python)
- H2: Autocorrelation and memory (ACF formula, interpretation table, Python plot)
- H2: Hurst exponent — is it trending? (H formula, interpretation table)
- H2: Spectral decomposition (Fourier formula, low-pass filter, Python FFT code)
- H2: The noise floor (SNR definition, over-fitting connection)
