import PostCard from '../../components/PostCard.jsx';
import { meta as linearAlgebraMeta } from '../ai-ml/intro-to-linear-algebra/meta.js';
import { meta as perceptronMeta } from '../ai-ml/perceptron/meta.js';
import { meta as mlpMeta } from '../ai-ml/mlp/meta.js';
import { meta as backpropMeta } from '../ai-ml/backprop/meta.js';
import { meta as transformerMeta } from '../ai-ml/transformer/meta.js';
import { meta as moeMeta } from '../ai-ml/moe/meta.js';
import { meta as ragMeta } from '../ai-ml/rag/meta.js';
import { meta as loraMeta } from '../ai-ml/lora/meta.js';
import { meta as fineTuningMeta } from '../ai-ml/fine-tuning/meta.js';
import { meta as cnnMeta } from '../ai-ml/cnn-from-scratch/meta.js';

/**
 * Blog index — ordered by learning progression.
 * In a future build step this list will be generated from the route manifest.
 */
const ALL_POSTS = [
  { path: '/intro-to-linear-algebra', meta: linearAlgebraMeta },
  { path: '/ai-ml/perceptron', meta: perceptronMeta },
  { path: '/ai-ml/mlp', meta: mlpMeta },
  { path: '/ai-ml/backprop', meta: backpropMeta },
  { path: '/ai-ml/cnn-from-scratch', meta: cnnMeta },
  { path: '/ai-ml/transformer', meta: transformerMeta },
  { path: '/ai-ml/moe', meta: moeMeta },
  { path: '/ai-ml/rag', meta: ragMeta },
  { path: '/ai-ml/lora', meta: loraMeta },
  { path: '/ai-ml/fine-tuning', meta: fineTuningMeta },
];

const ALL_TAGS = [...new Set(ALL_POSTS.flatMap((p) => p.meta.tags ?? []))].sort();

export default function Blog() {
  return (
    <div className="min-h-screen pt-14" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-20">
        {/* Header */}
        <header className="mb-12">
          <p
            className="text-sm font-mono tracking-widest uppercase mb-3"
            style={{ color: 'var(--accent-cyan)' }}
          >
            All articles
          </p>
          <h1
            className="text-4xl font-display font-bold leading-display mb-4"
            style={{ color: 'var(--ink-hi)' }}
          >
            Blog
          </h1>
          <p className="max-w-xl leading-relaxed" style={{ color: 'var(--ink-lo)' }}>
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
                className="text-xs px-3 py-1 rounded-full cursor-default"
                style={{
                  border: '1px solid var(--line)',
                  background: 'var(--bg-elev)',
                  color: 'var(--ink-lo)',
                }}
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
          <p className="text-center py-16" style={{ color: 'var(--ink-lo)' }}>
            No articles yet. Check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
