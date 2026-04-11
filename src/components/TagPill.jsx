import { Link } from 'react-router-dom';

const pillStyle = {
  display: 'inline-block',
  fontSize: '0.75rem',
  padding: '0.25rem 0.625rem',
  borderRadius: '9999px',
  border: '1px solid var(--line)',
  background: 'var(--bg-elev)',
  color: 'var(--accent-cyan)',
  transition: 'border-color 0.15s ease',
};

export default function TagPill({ tag, linked = false }) {
  if (linked) {
    return (
      <Link
        to={`/tags/${tag}`}
        style={pillStyle}
        className="no-underline"
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-cyan)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--line)')}
      >
        #{tag}
      </Link>
    );
  }

  return <span style={pillStyle}>#{tag}</span>;
}
