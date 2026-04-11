import { Suspense, useRef, useEffect } from 'react';
import { useScrollProgress } from '../lib/ScrollContext.jsx';
import TagPill from './TagPill.jsx';

function SceneFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-bg-base">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
        <p className="text-ink-lo text-sm">Loading 3D scene…</p>
      </div>
    </div>
  );
}

/**
 * Two-segment page layout as defined in 02-architecture.md.
 *
 * Segment A: 3D interactive scene (top, 70vh)
 * Segment B: Written content from Page.mdx (below)
 *
 * Scroll progress through segment B is tracked and published to ScrollContext,
 * which Scene components consume via useScrollProgress().
 */
export default function RouteLayout({ Scene, children, meta }) {
  const { setProgress } = useScrollProgress();
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const totalHeight = el.scrollHeight;
      const scrolledPast = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolledPast / totalHeight);
      setProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount to initialise
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setProgress]);

  return (
    <main className="pt-14 min-h-screen bg-bg-base">
      {/* ── Segment A — 3D Scene ──────────────────────────────────── */}
      {Scene && (
        <section
          className="relative w-full h-[70vh] bg-bg-base overflow-hidden"
          aria-hidden="true"
        >
          <Suspense fallback={<SceneFallback />}>
            <Scene />
          </Suspense>
        </section>
      )}

      {/* ── Segment B — Written Content ───────────────────────────── */}
      <section
        ref={contentRef}
        className="relative bg-bg-base"
        aria-label="Article content"
      >
        {/* Article header */}
        {meta && (
          <header className="max-w-prose mx-auto px-4 pt-12 pb-8">
            {meta.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {meta.tags.map((tag) => (
                  <TagPill key={tag} tag={tag} />
                ))}
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl font-display font-bold leading-display mb-4 text-ink-hi">
              {meta.title}
            </h1>

            <p className="text-lg text-ink-lo mb-6 leading-relaxed">{meta.description}</p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-lo border-t border-line pt-4">
              {meta.author && (
                <span>
                  By <span className="text-ink-hi">{meta.author}</span>
                </span>
              )}
              {meta.published && (
                <time dateTime={meta.published}>
                  {new Date(meta.published).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
              {meta.updated && meta.updated !== meta.published && (
                <span className="text-xs">
                  Updated{' '}
                  {new Date(meta.updated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>
          </header>
        )}

        {/* MDX prose */}
        <div className="prose-content px-4 pb-20">{children}</div>
      </section>
    </main>
  );
}
