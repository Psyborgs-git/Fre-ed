import { meta as candlestickMeta } from './candlestick-charts/meta.js';
import { meta as movingAveragesMeta } from './moving-averages/meta.js';
import { meta as trendVsNoiseMeta } from './trend-vs-noise/meta.js';
import { meta as positionSizingMeta } from './position-sizing/meta.js';
import { meta as meanReversionMeta } from './mean-reversion/meta.js';
import { meta as sharpeRatioMeta } from './sharpe-ratio/meta.js';
import { meta as backtestingMeta } from './backtesting/meta.js';
import { meta as bollingerBandsMeta } from './bollinger-bands/meta.js';
import { meta as correlationHeatmapMeta } from './correlation-heatmap/meta.js';
import { meta as regimeDetectionMeta } from './regime-detection/meta.js';
import { meta as volatilitySurfaceMeta } from './volatility-surface/meta.js';
import { meta as efficientFrontierMeta } from './efficient-frontier/meta.js';

export const LIVE_QUANT_LESSONS = [
  { path: '/quant-trading/candlestick-charts', meta: candlestickMeta },
  { path: '/quant-trading/moving-averages', meta: movingAveragesMeta },
  { path: '/quant-trading/trend-vs-noise', meta: trendVsNoiseMeta },
  { path: '/quant-trading/position-sizing', meta: positionSizingMeta },
  { path: '/quant-trading/mean-reversion', meta: meanReversionMeta },
  { path: '/quant-trading/sharpe-ratio', meta: sharpeRatioMeta },
  { path: '/quant-trading/backtesting', meta: backtestingMeta },
  { path: '/quant-trading/bollinger-bands', meta: bollingerBandsMeta },
  { path: '/quant-trading/correlation-heatmap', meta: correlationHeatmapMeta },
  { path: '/quant-trading/regime-detection', meta: regimeDetectionMeta },
  { path: '/quant-trading/volatility-surface', meta: volatilitySurfaceMeta },
  { path: '/quant-trading/efficient-frontier', meta: efficientFrontierMeta },
];

export const COMING_SOON_QUANT_LESSONS = [
  {
    path: '/quant-trading/statistical-arbitrage',
    title: 'Statistical Arbitrage',
    desc: 'Exploit mean-reverting spreads between cointegrated assets. Z-score entry signals, pairs selection, and the Engle-Granger cointegration test.',
    status: 'coming-soon',
    tags: ['stat-arb', 'pairs-trading', 'intermediate'],
  },
  {
    path: '/quant-trading/volatility-surface-trading',
    title: 'Volatility Surface Trading',
    desc: 'Navigate the 3D implied-vol surface. Calendar spreads, skew trades, and arbitrage-free surface construction.',
    status: 'coming-soon',
    tags: ['options', 'vol-surface', 'expert'],
  },
  {
    path: '/quant-trading/order-flow-analysis',
    title: 'Order Flow Analysis',
    desc: 'Read the tape: level 2 data, order book imbalance, trade-flow toxicity (VPIN), and market microstructure edge.',
    status: 'coming-soon',
    tags: ['microstructure', 'order-flow', 'expert'],
  },
  {
    path: '/quant-trading/garch-models',
    title: 'GARCH Models',
    desc: 'Model time-varying volatility with GARCH(1,1) and its extensions. Forecast volatility clusters and option pricing implications.',
    status: 'coming-soon',
    tags: ['garch', 'volatility', 'intermediate'],
  },
  {
    path: '/quant-trading/rl-portfolios',
    title: 'Reinforcement Learning for Portfolios',
    desc: 'Train an RL agent to allocate capital. Policy gradients, reward shaping, and the continuous action space challenge.',
    status: 'coming-soon',
    tags: ['reinforcement-learning', 'portfolio', 'expert'],
  },
  {
    path: '/quant-trading/alternative-data',
    title: 'Alternative Data',
    desc: 'Satellite imagery, credit-card transactions, web scraping, and NLP sentiment as alpha signals. Legal and ethical boundaries.',
    status: 'coming-soon',
    tags: ['alt-data', 'alpha', 'intermediate'],
  },
  {
    path: '/quant-trading/risk-parity',
    title: 'Risk Parity Frameworks',
    desc: 'Equal risk contribution portfolios. From 60/40 to all-weather. Leverage and volatility targeting.',
    status: 'coming-soon',
    tags: ['risk-parity', 'portfolio', 'intermediate'],
  },
  {
    path: '/quant-trading/monte-carlo',
    title: 'Monte Carlo Simulation',
    desc: 'Simulate thousands of portfolio paths. Value at Risk, Expected Shortfall, and stress testing with correlated shocks.',
    status: 'coming-soon',
    tags: ['monte-carlo', 'risk', 'intermediate'],
  },
];
