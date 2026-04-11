import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/blog', label: 'Blog' },
  { to: '/ai-ml', label: 'AI / ML' },
  { to: '/about', label: 'About' },
];

export default function Nav() {
  const { pathname } = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-line bg-bg-base/80 backdrop-blur-md">
      <nav
        className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="font-display font-bold text-xl text-ink-hi hover:text-accent-cyan transition-colors no-underline"
          aria-label="Fre-ed home"
        >
          <span className="text-accent-cyan">Fre</span>
          <span className="text-line">-</span>
          <span>ed</span>
        </Link>

        {/* Links */}
        <ul className="flex items-center gap-6 list-none m-0 p-0" role="list">
          {NAV_LINKS.map(({ to, label }) => {
            const active = pathname === to || pathname.startsWith(to + '/');
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={[
                    'text-sm font-medium transition-colors no-underline',
                    active ? 'text-accent-cyan' : 'text-ink-lo hover:text-ink-hi',
                  ].join(' ')}
                  aria-current={active ? 'page' : undefined}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
