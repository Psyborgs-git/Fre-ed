## 1. Route

`/quant-trading/regime-detection`

## 2. Learning Goal

Understand how financial markets cycle through distinct regimes (bull, bear, ranging), how Hidden Markov Models infer the active regime from observed returns, how volatility clustering generates persistent regime structure, and how to build regime-conditional strategy overlays.

## 3. Scene Concept

A long price line (80 points) is coloured green during bull phases, red during bear phases, and amber during ranging phases. After 60% scroll, three coloured spheres arranged in a triangle fade in to represent HMM hidden states, connected by curved arrows that represent state transition probabilities. Three model presets (HMM, Volatility, Trend) shift the node geometry slightly to illustrate different detection approaches.

## 4. Scroll Choreography

- **0 → 60 %**: Price line builds left-to-right, colour segments revealing each regime as the scroll advances.
- **60 → 100 %**: HMM triangle diagram cross-fades in at `(progress − 0.6) / 0.4` opacity while the price line is complete.

## 5. Content Outline

1. **Market regimes** — definition of bull/bear/ranging, why regime-awareness matters for strategy selection, simple MA-crossover classifier in Python.
2. **Hidden Markov Models** — HMM parameters (π, A, emissions), Baum-Welch EM fitting, Viterbi vs. forward-backward decoding, posterior state probabilities γₜ(k), Python example using hmmlearn.
3. **Volatility clustering** — autocorrelation of absolute returns, GARCH(1,1) specification, low/medium/high vol regime classification.
4. **Regime-conditional strategies** — strategy parameter table by regime, composite allocation by posterior probability, look-ahead bias warning for smoothed HMM states.
