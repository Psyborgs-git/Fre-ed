import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard.jsx';
import { meta as linearAlgebraMeta } from './intro-to-linear-algebra/meta.js';
import { meta as perceptronMeta } from './ai-ml/perceptron/meta.js';

const FEATURED = [
  { path: '/intro-to-linear-algebra', meta: linearAlgebraMeta },
  { path: '/ai-ml/perceptron', meta: perceptronMeta },
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
    <div className="min-h-screen bg-bg-base pt-14">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pt-24 pb-20 text-center">
        <p className="text-sm font-mono text-accent-cyan tracking-widest uppercase mb-5">
          3D Interactive Learning
        </p>
        <h1 className="text-5xl sm:text-6xl font-display font-bold leading-display mb-6 text-ink-hi">
          Learn in{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-violet">
            three dimensions
          </span>
        </h1>
        <p className="text-xl text-ink-lo max-w-2xl mx-auto mb-10 leading-prose">
          Complex topics in CS, mathematics, and machine learning — taught through 3D
          visualizations you scroll through and interact with.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/blog"
            className="px-7 py-3 bg-accent-cyan text-bg-base font-semibold rounded-lg hover:bg-accent-cyan/90 transition-colors no-underline text-sm"
          >
            Browse articles
          </Link>
          <Link
            to="/ai-ml"
            className="px-7 py-3 border border-line text-ink-hi font-medium rounded-lg hover:border-accent-violet/50 hover:text-accent-violet transition-colors no-underline text-sm"
          >
            AI / ML lab →
          </Link>
        </div>
      </section>

      {/* ── Featured posts ────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-xl font-display font-semibold mb-6 text-ink-hi">
          Featured articles
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURED.map(({ path, meta }) => (
            <PostCard key={path} path={path} meta={meta} />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            to="/blog"
            className="text-sm text-ink-lo hover:text-accent-cyan transition-colors"
          >
            View all articles →
          </Link>
        </div>
      </section>

      {/* ── Feature grid ─────────────────────────────────────────── */}
      <section className="border-t border-line bg-bg-elev">
        <div className="max-w-4xl mx-auto px-4 py-16 grid sm:grid-cols-3 gap-10">
          {FEATURES.map(({ symbol, title, desc }) => (
            <div key={title} className="text-center">
              <div className="text-3xl mb-4 text-accent-cyan font-mono">{symbol}</div>
              <h3 className="font-display font-semibold mb-2 text-ink-hi">{title}</h3>
              <p className="text-ink-lo text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
