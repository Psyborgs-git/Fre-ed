import { Link } from 'react-router-dom';
import TagPill from './TagPill.jsx';

export default function PostCard({ meta, path }) {
  return (
    <article className="group bg-bg-elev border border-line rounded-xl p-6 hover:border-accent-cyan/40 transition-all duration-200">
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
          className="text-ink-hi group-hover:text-accent-cyan transition-colors no-underline"
        >
          {meta.title}
        </Link>
      </h2>

      <p className="text-ink-lo text-sm leading-relaxed mb-4 line-clamp-3">{meta.description}</p>

      <div className="flex items-center justify-between text-xs text-ink-lo">
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
