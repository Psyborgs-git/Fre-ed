import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../lib/ThemeContext.jsx';

const NAV_LINKS = [
  { to: '/blog', label: 'Blog' },
  { to: '/ai-ml', label: 'AI / ML' },
  { to: '/about', label: 'About' },
];

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Nav() {
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        borderColor: 'var(--line)',
        backgroundColor: 'color-mix(in srgb, var(--bg-base) 85%, transparent)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <nav
        className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="font-display font-bold text-xl no-underline transition-colors"
          style={{ color: 'var(--ink-hi)' }}
          aria-label="Fre-ed home"
        >
          <span style={{ color: 'var(--accent-cyan)' }}>Fre</span>
          <span style={{ color: 'var(--line)' }}>-</span>
          <span>ed</span>
        </Link>

        {/* Right side: links + theme toggle */}
        <div className="flex items-center gap-6">
          <ul className="flex items-center gap-6 list-none m-0 p-0" role="list">
            {NAV_LINKS.map(({ to, label }) => {
              const active = pathname === to || pathname.startsWith(to + '/');
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm font-medium no-underline transition-colors"
                    style={{ color: active ? 'var(--accent-cyan)' : 'var(--ink-lo)' }}
                    aria-current={active ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
            style={{
              color: 'var(--ink-lo)',
              border: '1px solid var(--line)',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--ink-hi)';
              e.currentTarget.style.borderColor = 'var(--accent-cyan)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--ink-lo)';
              e.currentTarget.style.borderColor = 'var(--line)';
            }}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </nav>
    </header>
  );
}
