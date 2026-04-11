import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard.jsx';
import { meta as linearAlgebraMeta } from './intro-to-linear-algebra/meta.js';
import { meta as perceptronMeta } from './ai-ml/perceptron/meta.js';
import { meta as mlpMeta } from './ai-ml/mlp/meta.js';

const FEATURED = [
  { path: '/intro-to-linear-algebra', meta: linearAlgebraMeta },
  { path: '/ai-ml/perceptron', meta: perceptronMeta },
  { path: '/ai-ml/mlp', meta: mlpMeta },
];

const FEATURES = [
  {
    symbol: '⬡',
    title: '3D Visualizations',
    desc: 'Every article ships with a scroll-linked Three.js scene — scroll to animate it, not just look at it.',
  },
  {
    symbol: '∑',
    title: 'Math-first intuition',
    desc: 'Intuition before formulas. KaTeX-rendered math alongside interactive scenes makes abstraction tangible.',
  },
  {
    symbol: '◇',
    title: 'Open and free',
    desc: 'All content is open source. Contribute articles, fix typos, or build better scenes via PR.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen pt-14" style={{ background: 'var(--bg-base)' }}>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pt-24 pb-20 text-center">
        <p
          className="text-sm font-mono tracking-widest uppercase mb-5"
          style={{ color: 'var(--accent-cyan)' }}
        >
          3D Interactive Learning
        </p>
        <h1
          className="text-5xl sm:text-6xl font-display font-bold leading-display mb-6"
          style={{ color: 'var(--ink-hi)' }}
        >
          Learn in{' '}
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            three dimensions
          </span>
        </h1>
        <p
          className="text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'var(--ink-lo)' }}
        >
          Complex topics in CS, mathematics, and machine learning — taught through 3D
          visualizations you scroll through and interact with.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/blog"
            className="px-7 py-3 font-semibold rounded-lg no-underline text-sm transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent-cyan)', color: 'var(--bg-base)' }}
          >
            Browse articles
          </Link>
          <Link
            to="/ai-ml"
            className="px-7 py-3 font-medium rounded-lg no-underline text-sm transition-colors"
            style={{
              border: '1px solid var(--line)',
              color: 'var(--ink-hi)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent-violet) 50%, transparent)';
              e.currentTarget.style.color = 'var(--accent-violet)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--line)';
              e.currentTarget.style.color = 'var(--ink-hi)';
            }}
          >
            AI / ML lab →
          </Link>
        </div>
      </section>

      {/* ── Featured posts ────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h2
          className="text-xl font-display font-semibold mb-6"
          style={{ color: 'var(--ink-hi)' }}
        >
          Featured articles
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {FEATURED.map(({ path, meta }) => (
            <PostCard key={path} path={path} meta={meta} />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            to="/blog"
            className="text-sm no-underline transition-colors"
            style={{ color: 'var(--ink-lo)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-cyan)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-lo)')}
          >
            View all articles →
          </Link>
        </div>
      </section>

      {/* ── Feature grid ─────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid var(--line)', background: 'var(--bg-elev)' }}>
        <div className="max-w-4xl mx-auto px-4 py-16 grid sm:grid-cols-3 gap-10">
          {FEATURES.map(({ symbol, title, desc }) => (
            <div key={title} className="text-center">
              <div
                className="text-3xl mb-4 font-mono"
                style={{ color: 'var(--accent-cyan)' }}
              >
                {symbol}
              </div>
              <h3
                className="font-display font-semibold mb-2"
                style={{ color: 'var(--ink-hi)' }}
              >
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-lo)' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
