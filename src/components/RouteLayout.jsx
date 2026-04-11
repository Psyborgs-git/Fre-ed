import { Suspense, useRef, useEffect } from 'react';
import { useScrollProgress } from '../lib/ScrollContext.jsx';
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
 * Brilliant-inspired two-panel article layout.
 *
 * Desktop (≥ lg):
 *   Left 55 %  — Article content scrolls (drives 3D animation via ScrollContext)
 *   Right 45 % — 3D scene, sticky, fills viewport height below nav
 *
 * Mobile (< lg):
 *   Top          — 3D scene (45 vh)
 *   Below        — Article content scrolls
 */
export default function RouteLayout({ Scene, children, meta, chapters }) {
  const { setProgress, progress } = useScrollProgress();
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const scrolledPast = Math.max(0, -el.getBoundingClientRect().top);
      setProgress(Math.min(1, scrolledPast / el.scrollHeight));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setProgress]);

  const sceneContent = Scene ? (
    <div className="relative w-full h-full" style={{ background: 'var(--bg-scene)' }}>
      <SceneProgressBar progress={progress} />
      <Suspense fallback={<SceneFallback />}>
        <Scene />
      </Suspense>
      <SceneChapterOverlay progress={progress} chapters={chapters} />
    </div>
  ) : null;

  if (!Scene) {
    return (
      <div className="min-h-screen pt-14" style={{ background: 'var(--bg-base)' }}>
        <main ref={contentRef} aria-label="Article content">
          <ArticleHeader meta={meta} />
          <div className="prose-content px-4 pb-24">{children}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-14" style={{ background: 'var(--bg-base)' }}>
      {/*
       * Flex column on mobile: scene (order-1) sits above content (order-2).
       * Flex row on desktop:   content (order-1) left, scene (order-2) sticky right.
       */}
      <div className="flex flex-col lg:flex-row lg:items-start">

        {/* ── 3D Scene: top on mobile, sticky right panel on desktop ── */}
        <aside
          className="order-1 lg:order-2 flex-shrink-0 overflow-hidden lg:sticky lg:top-14"
          style={{
            /* mobile */ height: '45vh',
            width: '100%',
          }}
          aria-hidden="true"
          // Override with desktop dimensions via a data attribute + CSS
          data-scene-panel="true"
        >
          {sceneContent}
        </aside>

        {/* ── Article content: below scene on mobile, left column on desktop ── */}
        <main
          ref={contentRef}
          className="order-2 lg:order-1 lg:flex-1 lg:min-w-0"
          aria-label="Article content"
        >
          <ArticleHeader meta={meta} />
          <div className="prose-content px-4 lg:px-8 pb-32">{children}</div>
        </main>
      </div>

      {/* Inject desktop-breakpoint overrides for the scene panel */}
      <style>{`
        @media (min-width: 1024px) {
          [data-scene-panel] {
            width: 45vw;
            height: calc(100vh - 3.5rem);
            border-left: 1px solid var(--line);
          }
        }
      `}</style>
    </div>
  );
}

function ArticleHeader({ meta }) {
  if (!meta) return null;
  return (
    <header className="max-w-prose mx-auto px-4 lg:px-8 pt-12 pb-8">
      {meta.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {meta.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      )}

      <h1
        className="text-4xl sm:text-5xl font-display font-bold leading-display mb-4"
        style={{ color: 'var(--ink-hi)' }}
      >
        {meta.title}
      </h1>

      <p className="text-lg mb-6 leading-relaxed" style={{ color: 'var(--ink-lo)' }}>
        {meta.description}
      </p>

      <div
        className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm pt-4"
        style={{ color: 'var(--ink-lo)', borderTop: '1px solid var(--line)' }}
      >
        {meta.author && (
          <span>
            By <span style={{ color: 'var(--ink-hi)' }}>{meta.author}</span>
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
  );
}
