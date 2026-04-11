import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-bg-base pt-14">
      <div className="max-w-prose mx-auto px-4 pt-16 pb-20">
        <header className="mb-12">
          <p className="text-sm font-mono text-accent-cyan tracking-widest uppercase mb-3">
            About
          </p>
          <h1 className="text-4xl font-display font-bold leading-display mb-4 text-ink-hi">
            What is Fre-ed?
          </h1>
        </header>

        <div className="prose-content">
          <p>
            <strong>Fre-ed</strong> is an educational blog where every article is a{' '}
            <em>3D interactive experience</em>. Instead of reading walls of text, you scroll
            through spatial scenes that make complex concepts tangible.
          </p>

          <h2>The idea</h2>
          <p>
            Most educational content teaches <em>what</em> something is. We want to show you{' '}
            <em>what it looks like</em> — in three dimensions, animated to your scroll position.
          </p>
          <p>
            A neural network layer is not just a matrix multiply. It is a spatial transformation
            of data — rotating, stretching, and projecting points in high-dimensional space. We
            build 3D scenes that let you walk through that transformation.
          </p>

          <h2>Who is it for?</h2>
          <ul>
            <li>Self-taught developers who learn by doing</li>
            <li>CS and ML students who want intuition, not just formulas</li>
            <li>Curious engineers who've wondered "but what does it <em>look</em> like?"</li>
          </ul>

          <h2>The tech</h2>
          <p>
            Every article is a React component with two stacked segments:
          </p>
          <ul>
            <li>
              <strong>Segment A</strong> — a Three.js canvas rendered with React Three Fiber,
              animated by your scroll position.
            </li>
            <li>
              <strong>Segment B</strong> — MDX prose with KaTeX math, syntax-highlighted code,
              and callout components.
            </li>
          </ul>
          <p>
            The site is statically pre-rendered for fast load times and full SEO. Source is open
            on GitHub.
          </p>

          <h2>Contribute</h2>
          <p>
            Fre-ed is open source. If you find an error, have a better explanation, or want to
            add a new 3D scene, open a pull request. Every article must include a{' '}
            <code>docs/pages/&lt;route&gt;.md</code> documentation file — see the contributing
            guide for details.
          </p>
          <p>
            <a
              href="https://github.com/psyborgs-git/fre-ed"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/psyborgs-git/fre-ed →
            </a>
          </p>

          <h2>Roadmap</h2>
          <p>Fre-ed v1 targets ten launch articles — five general CS, five ML:</p>
          <ul>
            <li>
              <Link to="/intro-to-linear-algebra">Introduction to Linear Algebra</Link>{' '}
              <span className="text-accent-cyan text-xs">live</span>
            </li>
            <li>Sorting algorithms — visualised in 3D (coming soon)</li>
            <li>Graph traversal — BFS vs DFS in space (coming soon)</li>
            <li>Big-O complexity — visualised (coming soon)</li>
            <li>Fourier transforms — waves in 3D (coming soon)</li>
            <li>
              <Link to="/ai-ml/perceptron">Perceptron</Link>{' '}
              <span className="text-accent-cyan text-xs">live</span>
            </li>
            <li>Multi-layer perceptron (coming soon)</li>
            <li>Backpropagation (coming soon)</li>
            <li>Convolutional networks (coming soon)</li>
            <li>Attention mechanism (coming soon)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
