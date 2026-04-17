import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', background: 'var(--bg-base)' }}>
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-display font-semibold mb-1" style={{ color: 'var(--ink-hi)' }}>
            <span style={{ color: 'var(--accent-cyan)' }}>Fre</span>-ed
          </p>
          <p className="text-sm" style={{ color: 'var(--ink-lo)' }}>
            Learning through 3D — open and free.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <ul
            className="flex flex-wrap gap-x-6 gap-y-2 list-none m-0 p-0 text-sm"
            style={{ color: 'var(--ink-lo)' }}
          >
            {[
              { to: '/blog', label: 'Blog' },
              { to: '/ai-ml', label: 'AI/ML' },
              { to: '/quant-trading', label: 'Quant' },
              { to: '/about', label: 'About' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="no-underline transition-colors"
                  style={{ color: 'var(--ink-lo)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink-hi)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-lo)')}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://github.com/psyborgs-git/fre-ed"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                style={{ color: 'var(--ink-lo)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink-hi)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-lo)')}
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div style={{ borderTop: '1px solid var(--line)' }}>
        <p
          className="max-w-6xl mx-auto px-4 py-3 text-center text-xs"
          style={{ color: 'var(--ink-lo)' }}
        >
          © {new Date().getFullYear()} Fre-ed. Content is open source.
        </p>
      </div>
    </footer>
  );
}
