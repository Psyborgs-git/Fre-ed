import PostCard from '../../components/PostCard.jsx';
import { meta as linearAlgebraMeta } from '../intro-to-linear-algebra/meta.js';
import { meta as perceptronMeta } from '../ai-ml/perceptron/meta.js';

/**
 * Blog index — auto-populated from route meta.js files.
 * In a future build step this list will be generated from the route manifest.
 */
const ALL_POSTS = [
  { path: '/intro-to-linear-algebra', meta: linearAlgebraMeta },
  { path: '/ai-ml/perceptron', meta: perceptronMeta },
];

const ALL_TAGS = [...new Set(ALL_POSTS.flatMap((p) => p.meta.tags ?? []))].sort();

export default function Blog() {
  return (
    <div className="min-h-screen bg-bg-base pt-14">
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-20">
        {/* Header */}
        <header className="mb-12">
          <p className="text-sm font-mono text-accent-cyan tracking-widest uppercase mb-3">
            All articles
          </p>
          <h1 className="text-4xl font-display font-bold leading-display mb-4 text-ink-hi">
            Blog
          </h1>
          <p className="text-ink-lo max-w-xl leading-prose">
            Every article is a 3D learning experience. Scroll through spatial scenes that make
            complex ideas tangible.
          </p>
        </header>

        {/* Tag filter bar */}
        {ALL_TAGS.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {ALL_TAGS.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full border border-line bg-bg-elev text-ink-lo cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Posts grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {ALL_POSTS.map(({ path, meta }) => (
            <PostCard key={path} path={path} meta={meta} />
          ))}
        </div>

        {ALL_POSTS.length === 0 && (
          <p className="text-ink-lo text-center py-16">No articles yet. Check back soon.</p>
        )}
      </div>
    </div>
  );
}
