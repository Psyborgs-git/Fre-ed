import { Link } from 'react-router-dom';
import { COMING_SOON_QUANT_LESSONS, LIVE_QUANT_LESSONS } from './registry.js';

const STAGE_META = {
  beginner:     { label: 'Beginner',     color: '#34d399', bg: 'bg-[#34d399]/10', border: 'border-[#34d399]/30', text: 'text-[#34d399]' },
  intermediate: { label: 'Intermediate', color: '#22d3ee', bg: 'bg-[#22d3ee]/10', border: 'border-[#22d3ee]/30', text: 'text-[#22d3ee]' },
  expert:       { label: 'Expert',       color: '#a78bfa', bg: 'bg-[#a78bfa]/10', border: 'border-[#a78bfa]/30', text: 'text-[#a78bfa]' },
};

const STAGE_ORDER = ['beginner', 'intermediate', 'expert'];

function StageBadge({ stage }) {
  const s = STAGE_META[stage] ?? STAGE_META.beginner;
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${s.bg} ${s.border} ${s.text}`}>
      {s.label}
    </span>
  );
}

function LessonCard({ path, meta }) {
  return (
    <Link
      to={path}
      className="group relative bg-bg-elev border border-line rounded-xl p-6 no-underline hover:border-accent-cyan/50 cursor-pointer transition-all duration-200"
    >
      <div className="absolute top-4 right-4">
        <StageBadge stage={meta.stage} />
      </div>

      <h3 className="font-display font-semibold mb-2 leading-snug text-ink-hi group-hover:text-accent-cyan transition-colors pr-20">
        {meta.title}
      </h3>

      <p className="text-ink-lo text-sm leading-relaxed mb-4">{meta.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {meta.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full border border-line text-ink-lo bg-bg-base"
          >
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

function ComingSoonCard({ path, title, desc, tags }) {
  return (
    <div className="relative bg-bg-elev border border-line rounded-xl p-6 opacity-60 cursor-default">
      <span className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full border bg-bg-base text-ink-lo border-line">
        Soon
      </span>
      <h3 className="font-display font-semibold mb-2 leading-snug text-ink-lo pr-16">{title}</h3>
      <p className="text-ink-lo text-sm leading-relaxed mb-4">{desc}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full border border-line text-ink-lo bg-bg-base"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function StageSection({ stage, lessons }) {
  const s = STAGE_META[stage];
  if (!lessons.length) return null;
  return (
    <section className="mb-14">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
        <h2 className="font-display font-bold text-xl" style={{ color: s.color }}>
          {s.label}
        </h2>
        <span className="text-ink-lo text-sm">
          {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lessons.map(({ path, meta }) => (
          <LessonCard key={path} path={path} meta={meta} />
        ))}
      </div>
    </section>
  );
}

export default function QuantTradingHub() {
  const byStage = STAGE_ORDER.reduce((acc, stage) => {
    acc[stage] = LIVE_QUANT_LESSONS.filter(({ meta }) => meta.stage === stage);
    return acc;
  }, {});

  const totalLive = LIVE_QUANT_LESSONS.length;

  return (
    <div className="min-h-screen bg-bg-base pt-14">
      <div className="max-w-5xl mx-auto px-4 pt-16 pb-20">
        {/* Header */}
        <header className="mb-14 max-w-2xl">
          <p className="text-sm font-mono text-[#f59e0b] tracking-widest uppercase mb-3">
            Quant Trading
          </p>
          <h1 className="text-4xl font-display font-bold leading-display mb-5 text-ink-hi">
            Markets,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34d399] to-[#22d3ee]">
              made walkable
            </span>
          </h1>
          <p className="text-ink-lo leading-prose text-lg">
            From candlestick anatomy to volatility surfaces — every quantitative trading concept
            rendered as an interactive 3D world. Walk through price series, risk frameworks, and
            strategy mechanics step by step.
          </p>
          <div className="mt-6 flex items-center gap-3 text-sm text-ink-lo">
            <span className="font-mono text-[#34d399]">{totalLive}</span>
            <span>interactive lessons available</span>
          </div>
        </header>

        {/* Stage legend */}
        <div className="flex flex-wrap gap-4 mb-10">
          {STAGE_ORDER.map((stage) => {
            const s = STAGE_META[stage];
            return (
              <div key={stage} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                <span className="text-xs text-ink-lo">{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Live lessons by stage */}
        {STAGE_ORDER.map((stage) => (
          <StageSection key={stage} stage={stage} lessons={byStage[stage]} />
        ))}

        {/* Coming soon */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-ink-lo flex-shrink-0" />
            <h2 className="font-display font-bold text-xl text-ink-lo">Coming Soon</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMING_SOON_QUANT_LESSONS.map((lesson) => (
              <ComingSoonCard key={lesson.path} {...lesson} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
