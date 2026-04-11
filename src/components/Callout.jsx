const VARIANTS = {
  note: {
    border: 'border-accent-cyan',
    bg: 'bg-accent-cyan/5',
    label: 'Note',
    labelColor: 'text-accent-cyan',
  },
  warning: {
    border: 'border-accent-warn',
    bg: 'bg-accent-warn/5',
    label: 'Warning',
    labelColor: 'text-accent-warn',
  },
  tip: {
    border: 'border-accent-violet',
    bg: 'bg-accent-violet/5',
    label: 'Tip',
    labelColor: 'text-accent-violet',
  },
  danger: {
    border: 'border-red-500',
    bg: 'bg-red-500/5',
    label: 'Danger',
    labelColor: 'text-red-400',
  },
};

/**
 * Inline callout box for MDX prose.
 * Usage in MDX: <Callout type="note">…</Callout>
 */
export default function Callout({ type = 'note', children }) {
  const v = VARIANTS[type] ?? VARIANTS.note;

  return (
    <aside
      className={`border-l-4 ${v.border} ${v.bg} rounded-r-lg px-5 py-4 my-6`}
      role="note"
    >
      <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${v.labelColor}`}>
        {v.label}
      </p>
      <div className="text-sm text-ink-lo leading-relaxed [&>p]:mb-0">{children}</div>
    </aside>
  );
}
