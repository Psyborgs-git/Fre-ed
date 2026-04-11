import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg-base">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-display font-semibold text-ink-hi mb-1">
            <span className="text-accent-cyan">Fre</span>-ed
          </p>
          <p className="text-ink-lo text-sm">Learning through 3D — open and free.</p>
        </div>

        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 list-none m-0 p-0 text-sm text-ink-lo">
            {[
              { to: '/blog', label: 'Blog' },
              { to: '/ai-ml', label: 'AI/ML' },
              { to: '/about', label: 'About' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="hover:text-ink-hi transition-colors no-underline">
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://github.com/psyborgs-git/fre-ed"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink-hi transition-colors"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-line">
        <p className="max-w-6xl mx-auto px-4 py-3 text-center text-xs text-ink-lo">
          © {new Date().getFullYear()} Fre-ed. Content is open source.
        </p>
      </div>
    </footer>
  );
}
