import { Link } from 'react-router-dom';
import TagPill from './TagPill.jsx';

export default function PostCard({ meta, path }) {
  return (
    <article
      className="group rounded-xl p-6 transition-all duration-200"
      style={{
        background: 'var(--bg-elev)',
        border: '1px solid var(--line)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent-cyan) 40%, transparent)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--line)';
      }}
    >
      {meta.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {meta.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      )}

      <h2 className="text-lg font-display font-semibold mb-2 leading-snug">
        <Link
          to={path}
          className="no-underline transition-colors"
          style={{ color: 'var(--ink-hi)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-cyan)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-hi)')}
        >
          {meta.title}
        </Link>
      </h2>

      <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--ink-lo)' }}>
        {meta.description}
      </p>

      <div
        className="flex items-center justify-between text-xs"
        style={{ color: 'var(--ink-lo)' }}
      >
        {meta.author && <span>{meta.author}</span>}
        {meta.published && (
          <time dateTime={meta.published}>
            {new Date(meta.published).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
        )}
      </div>
    </article>
  );
}
