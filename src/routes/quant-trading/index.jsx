import { useState } from 'react';
import { Link } from 'react-router-dom';

const QUANT_TOPICS = [
  {
    category: 'Mathematics Foundations',
    color: '#a78bfa',
    topics: [
      { id: 'stochastic-calculus', title: 'Stochastic Calculus & Itô\'s Lemma', description: 'Brownian motion, Wiener processes, stochastic differential equations, and Itô\'s formula — the mathematical language of asset prices.' },
      { id: 'probability-stats', title: 'Probability & Statistical Inference', description: 'Distributions, moment generating functions, hypothesis testing, MLE, Bayesian inference applied to market data.' },
      { id: 'linear-algebra-quant', title: 'Linear Algebra for Portfolio Theory', description: 'Covariance matrices, eigendecomposition, PCA for factor extraction, Cholesky decomposition for correlated asset simulation.' },
      { id: 'time-series-analysis', title: 'Time Series Analysis', description: 'ARIMA, GARCH, VAR models, stationarity, autocorrelation, co-integration — the statistical toolkit for price series.' },
      { id: 'optimization-theory', title: 'Optimisation Theory', description: 'Convex optimisation, Lagrange multipliers, KKT conditions — how mean-variance optimisation and risk-budgeting work mathematically.' },
    ],
  },
  {
    category: 'Market Microstructure',
    color: '#22d3ee',
    topics: [
      { id: 'order-book', title: 'Order Book Mechanics', description: 'Limit order books, market orders, bid-ask spread, queue priority, and how price discovery emerges from order flow.' },
      { id: 'market-impact', title: 'Market Impact & Execution Costs', description: 'Temporary vs permanent impact, Almgren-Chriss optimal execution, VWAP/TWAP algorithms, and transaction cost analysis.' },
      { id: 'high-freq-trading', title: 'High-Frequency Trading Concepts', description: 'Latency arbitrage, co-location, market making, statistical arbitrage at tick frequency, and the arms race for speed.' },
      { id: 'liquidity', title: 'Liquidity & Slippage', description: 'Measuring market depth, Kyle\'s lambda, Roll\'s spread estimator, and how liquidity risk affects strategy capacity.' },
    ],
  },
  {
    category: 'Asset Pricing',
    color: '#f59e0b',
    topics: [
      { id: 'capm', title: 'CAPM & Factor Models', description: 'Capital Asset Pricing Model, beta, systematic vs idiosyncratic risk, Fama-French 3-factor and 5-factor models.' },
      { id: 'efficient-market', title: 'Efficient Market Hypothesis', description: 'Weak, semi-strong, and strong forms. Market anomalies, alpha decay, and what "beating the market" actually means.' },
      { id: 'options-pricing', title: 'Options Pricing: Black-Scholes & Beyond', description: 'Black-Scholes derivation, Greeks (delta, gamma, vega, theta), implied volatility, volatility smile and skew.' },
      { id: 'term-structure', title: 'Fixed Income & Term Structure', description: 'Yield curves, duration and convexity, Nelson-Siegel model, bond pricing, and interest rate derivatives.' },
      { id: 'crypto-defi', title: 'Crypto & DeFi Markets', description: 'AMM pricing (Uniswap x·y=k), impermanent loss, on-chain data as alpha signals, tokenomics and liquidity pools.' },
    ],
  },
  {
    category: 'Portfolio Construction',
    color: '#34d399',
    topics: [
      { id: 'mean-variance', title: 'Mean-Variance Optimisation', description: 'Markowitz efficient frontier, minimum variance portfolio, maximum Sharpe ratio, and the limitations of classical MVO.' },
      { id: 'risk-parity', title: 'Risk Parity & Factor Investing', description: 'Equal risk contribution, Bridgewater All Weather, smart beta, factor tilts (value, momentum, low-vol, quality).' },
      { id: 'position-sizing', title: 'Position Sizing & Kelly Criterion', description: 'Full Kelly, fractional Kelly, bet sizing under uncertainty, risk of ruin, and practical implementation.' },
      { id: 'drawdown-risk', title: 'Drawdown & Risk Management', description: 'Max drawdown, VaR, CVaR, Expected Shortfall, tail risk hedging, and stop-loss mechanics.' },
      { id: 'rebalancing', title: 'Rebalancing & Transaction Costs', description: 'Calendar vs threshold rebalancing, tax-loss harvesting, turnover constraints in portfolio optimisation.' },
    ],
  },
  {
    category: 'Quantitative Strategies',
    color: '#f43f5e',
    topics: [
      { id: 'momentum', title: 'Momentum Strategies', description: 'Time-series vs cross-sectional momentum, look-back periods, Jegadeesh-Titman, momentum crashes, and factor construction.' },
      { id: 'mean-reversion', title: 'Mean-Reversion & Statistical Arbitrage', description: 'Pairs trading, cointegration (Engle-Granger), Ornstein-Uhlenbeck process, z-score entry/exit signals.' },
      { id: 'trend-following', title: 'Trend Following & CTAs', description: 'Moving average crossovers, Donchian channels, ATR-based sizing, correlation across asset classes, CTA performance.' },
      { id: 'vol-strategies', title: 'Volatility Strategies', description: 'Volatility risk premium, VIX futures roll, dispersion trading, variance swaps, and realised-vs-implied vol arbitrage.' },
      { id: 'ml-quant', title: 'Machine Learning in Quant Finance', description: 'Feature engineering from OHLCV data, gradient boosting for alpha signals, LSTM for time series, reinforcement learning for execution.' },
      { id: 'alt-data', title: 'Alternative Data & Signal Generation', description: 'Satellite imagery, credit card data, sentiment from earnings calls, web scraping, ESG signals as alpha.' },
    ],
  },
  {
    category: 'Backtesting & Research',
    color: '#818cf8',
    topics: [
      { id: 'backtesting-fundamentals', title: 'Backtesting Fundamentals', description: 'Walk-forward testing, in-sample vs out-of-sample splits, avoiding look-ahead bias, survivorship bias correction.' },
      { id: 'performance-metrics', title: 'Performance Metrics', description: 'Sharpe ratio, Sortino ratio, Calmar ratio, information ratio, alpha/beta attribution, maximum drawdown.' },
      { id: 'overfitting-finance', title: 'Overfitting in Finance', description: 'The multiple comparisons problem, deflated Sharpe ratio (Lopez de Prado), combinatorial purged cross-validation.' },
      { id: 'transaction-costs-bt', title: 'Transaction Cost Modelling', description: 'Realistic slippage models, bid-ask spread estimation, market impact in backtests, capacity analysis.' },
      { id: 'regime-detection', title: 'Market Regime Detection', description: 'Hidden Markov Models for regime switching, volatility regimes, bull/bear classification, regime-conditional strategies.' },
    ],
  },
  {
    category: 'Risk & Derivatives',
    color: '#fb923c',
    topics: [
      { id: 'greeks-hedging', title: 'Greeks & Dynamic Hedging', description: 'Delta hedging, gamma scalping, vega exposure, theta decay — continuously maintaining a hedged options book.' },
      { id: 'var-models', title: 'VaR & Stress Testing', description: 'Historical simulation, parametric VaR, Monte Carlo VaR, stressed VaR, and regulatory frameworks (Basel III).' },
      { id: 'credit-risk', title: 'Credit Risk & CDS', description: 'Credit default swaps, probability of default, recovery rates, Merton model, CDO structuring basics.' },
      { id: 'monte-carlo', title: 'Monte Carlo Simulation', description: 'Path simulation, variance reduction (antithetic, control variates), quasi-Monte Carlo, and option pricing via simulation.' },
    ],
  },
];

function TopicRow({ topic, done, onToggle }) {
  return (
    <li className="quant-topic-row">
      <button
        type="button"
        className={`quant-checkbox${done ? ' quant-checkbox--done' : ''}`}
        onClick={() => onToggle(topic.id)}
        aria-label={done ? `Mark "${topic.title}" as pending` : `Mark "${topic.title}" as done`}
      >
        {done && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <polyline points="2,6 5,9 10,3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <div className="quant-topic-text">
        <p className={`quant-topic-title${done ? ' quant-topic-title--done' : ''}`}>{topic.title}</p>
        <p className="quant-topic-desc">{topic.description}</p>
      </div>
    </li>
  );
}

function CategorySection({ category, color, topics, doneSet, onToggle }) {
  const doneCount = topics.filter((t) => doneSet.has(t.id)).length;
  const allDone = doneCount === topics.length;

  return (
    <section className="quant-category">
      <div className="quant-category-header">
        <span className="quant-category-dot" style={{ background: color }} />
        <h2 className="quant-category-title" style={{ color }}>{category}</h2>
        <span className="quant-category-count" style={{ color }}>
          {doneCount}/{topics.length}
        </span>
      </div>
      <ul className="quant-topic-list">
        {topics.map((topic) => (
          <TopicRow
            key={topic.id}
            topic={topic}
            done={doneSet.has(topic.id)}
            onToggle={onToggle}
          />
        ))}
      </ul>
    </section>
  );
}

export default function QuantTradingTodo() {
  const [doneSet, setDoneSet] = useState(() => {
    try {
      const saved = localStorage.getItem('quant-todo-done');
      return new Set(saved ? JSON.parse(saved) : []);
    } catch {
      return new Set();
    }
  });

  const toggleDone = (id) => {
    setDoneSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem('quant-todo-done', JSON.stringify([...next]));
      } catch {}
      return next;
    });
  };

  const totalTopics = QUANT_TOPICS.reduce((s, c) => s + c.topics.length, 0);
  const totalDone   = doneSet.size;
  const pct = Math.round((totalDone / totalTopics) * 100);

  return (
    <div className="quant-todo-page">
      {/* Hero */}
      <div className="quant-todo-hero">
        <p className="quant-todo-kicker">Blog roadmap</p>
        <h1 className="quant-todo-heading">Quant Trading Fundamentals</h1>
        <p className="quant-todo-sub">
          Every concept you need to understand quantitative trading — from stochastic calculus
          to live strategy deployment. Check off topics as interactive lessons are published.
        </p>

        {/* Progress bar */}
        <div className="quant-progress-wrap" aria-label={`${pct}% of topics published`}>
          <div className="quant-progress-bar">
            <div className="quant-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="quant-progress-label">{totalDone} / {totalTopics} published</span>
        </div>
      </div>

      {/* Categories */}
      <div className="quant-todo-grid">
        {QUANT_TOPICS.map((cat) => (
          <CategorySection
            key={cat.category}
            {...cat}
            doneSet={doneSet}
            onToggle={toggleDone}
          />
        ))}
      </div>

      <p className="quant-todo-footer-note">
        Check off topics as you follow along — progress is saved in your browser.
        New interactive lessons will unlock these topics over time.{' '}
        <Link to="/blog" style={{ color: 'var(--accent-cyan)' }}>Browse existing lessons →</Link>
      </p>
    </div>
  );
}
