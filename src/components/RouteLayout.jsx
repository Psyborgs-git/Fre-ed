import { Suspense, useCallback, useEffect, useRef } from 'react';
import { useScrollProgress } from '../lib/ScrollContext.jsx';
import { getScrollableProgress } from '../lib/scrollProgress.js';
import TagPill from './TagPill.jsx';

function SceneFallback() {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: 'var(--bg-scene)' }}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--accent-cyan)', borderTopColor: 'transparent' }}
        />
        <p className="text-sm" style={{ color: 'var(--ink-lo)' }}>
          Loading 3D scene…
        </p>
      </div>
    </div>
  );
}

function SceneMetaOverlay({ meta }) {
  if (!meta) return null;

  return (
    <div className="lesson-scene-meta">
      <span className="lesson-scene-kicker">Interactive lesson</span>
      <p className="lesson-scene-title">{meta.title}</p>
      <p className="lesson-scene-copy">{meta.description}</p>
    </div>
  );
}

/**
 * Animated chapter label + dot indicators at the bottom of the scene.
 * Each chapter = equal slice of 0→1 progress.
 */
function SceneChapterOverlay({ progress, chapters }) {
  if (!chapters?.length) return null;
  const idx = Math.min(Math.floor(progress * chapters.length), chapters.length - 1);

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none select-none">
      <span
        className="text-xs font-mono tracking-widest uppercase px-3 py-1 rounded-full"
        style={{
          color: 'var(--accent-cyan)',
          background: 'rgba(10,10,15,0.75)',
          border: '1px solid rgba(34,211,238,0.28)',
        }}
      >
        {chapters[idx]}
      </span>
      <div className="flex items-center gap-1.5">
        {chapters.map((_, i) => (
          <span
            key={i}
            className="block rounded-full"
            style={{
              width: i === idx ? '18px' : '6px',
              height: '6px',
              background: i === idx ? 'var(--accent-cyan)' : 'rgba(154,154,168,0.4)',
              transition: 'width 0.35s ease, background 0.35s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SceneHint() {
  return (
    <div className="lesson-scene-hint" aria-hidden="true">
      Drag to orbit · Scroll the lesson below to animate
    </div>
  );
}

/** Thin gradient reading-progress bar across the top of the scene panel. */
function SceneProgressBar({ progress }) {
  return (
    <div
      className="absolute top-0 left-0 right-0 h-0.5 z-10"
      aria-hidden="true"
      style={{ background: 'rgba(38,38,47,0.5)' }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress * 100}%`,
          background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-violet))',
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  );
}

/**
 * Brilliant-inspired lesson shell.
 *
 * The route is split into two persistent panes below the fixed nav:
 *   Top pane    — the canvas and 3D lesson overlay
 *   Bottom pane — a scrollable “paper” surface for the article content
 *
 * The bottom pane owns scroll progress so the scene stays visible while the
 * writing advances the animation.
 */
export default function RouteLayout({ Scene, children, meta, chapters }) {
  const { setProgress, progress } = useScrollProgress();
  const contentRef = useRef(null);

  const handleContentScroll = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;

    setProgress(getScrollableProgress(el.scrollTop, el.scrollHeight, el.clientHeight));
  }, [setProgress]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    window.scrollTo({ top: 0, behavior: 'auto' });
    el.scrollTop = 0;
    handleContentScroll();
  }, [handleContentScroll, meta?.title]);

  const sceneContent = Scene ? (
    <div className="lesson-scene-surface">
      <SceneProgressBar progress={progress} />
      <SceneMetaOverlay meta={meta} />
      <Suspense fallback={<SceneFallback />}>
        <Scene />
      </Suspense>
      <SceneHint />
      <SceneChapterOverlay progress={progress} chapters={chapters} />
    </div>
  ) : null;

  if (!Scene) {
    return (
      <div className="min-h-screen pt-14" style={{ background: 'var(--bg-base)' }}>
        <main aria-label="Article content" className="px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <article className="lesson-article-card lesson-article-card-static">
            <ArticleHeader meta={meta} />
            <div className="prose-content px-6 pb-24 pt-2 md:px-8 lg:px-12">{children}</div>
          </article>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-14" style={{ background: 'var(--bg-base)' }}>
      <section className="lesson-shell" aria-label="Interactive lesson layout">
        <aside
          className="lesson-scene-panel"
          aria-hidden="true"
        >
          {sceneContent}
        </aside>

        <main
          ref={contentRef}
          className="lesson-content-panel"
          aria-label="Article content"
          onScroll={handleContentScroll}
          tabIndex={0}
        >
          <article className="lesson-article-card">
            <ArticleHeader meta={meta} headingId="lesson-route-title" />
            <div className="prose-content px-6 pb-24 pt-2 md:px-8 lg:px-12">{children}</div>
          </article>
        </main>
      </section>
    </div>
  );
}

function ArticleHeader({ meta, headingId }) {
  if (!meta) return null;
  return (
    <header className="max-w-4xl mx-auto px-6 lg:px-12 pt-12 pb-10">
      <p
        className="text-xs font-semibold uppercase tracking-[0.32em] mb-4"
        style={{ color: 'var(--accent-cyan)' }}
      >
        Interactive lesson
      </p>

      {meta.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {meta.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      )}

      <h1
        id={headingId}
        className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-display mb-4"
        style={{ color: 'var(--ink-hi)' }}
      >
        {meta.title}
      </h1>

      <p
        className="text-lg md:text-xl mb-6 leading-relaxed max-w-3xl"
        style={{ color: 'var(--ink-lo)' }}
      >
        {meta.description}
      </p>

      <div className="flex flex-wrap items-center gap-3 text-sm pt-4">
        {meta.author && (
          <span className="lesson-meta-chip">
            By <span style={{ color: 'var(--ink-hi)' }}>{meta.author}</span>
          </span>
        )}
        {meta.published && (
          <time className="lesson-meta-chip" dateTime={meta.published}>
            {new Date(meta.published).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}
        {meta.updated && meta.updated !== meta.published && (
          <span className="lesson-meta-chip text-xs">
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
  );
}
