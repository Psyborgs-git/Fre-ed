import { Link } from 'react-router-dom';

const baseClass =
  'inline-block text-xs px-2.5 py-1 rounded-full border border-line bg-bg-elev text-accent-cyan transition-colors';

export default function TagPill({ tag, linked = false }) {
  if (linked) {
    return (
      <Link
        to={`/tags/${tag}`}
        className={`${baseClass} hover:border-accent-cyan/50 no-underline`}
      >
        #{tag}
      </Link>
    );
  }

  return <span className={baseClass}>#{tag}</span>;
}
