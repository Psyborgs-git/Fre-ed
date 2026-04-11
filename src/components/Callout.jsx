const VARIANTS = {
  note: {
    borderColor: 'var(--accent-cyan)',
    bg: 'rgba(34,211,238,0.06)',
    label: 'Note',
    labelColor: 'var(--accent-cyan)',
  },
  warning: {
    borderColor: 'var(--accent-warn)',
    bg: 'rgba(245,158,11,0.06)',
    label: 'Warning',
    labelColor: 'var(--accent-warn)',
  },
  tip: {
    borderColor: 'var(--accent-violet)',
    bg: 'rgba(167,139,250,0.06)',
    label: 'Tip',
    labelColor: 'var(--accent-violet)',
  },
  danger: {
    borderColor: '#ef4444',
    bg: 'rgba(239,68,68,0.06)',
    label: 'Danger',
    labelColor: '#f87171',
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
      role="note"
      style={{
        borderLeft: `4px solid ${v.borderColor}`,
        background: v.bg,
        borderRadius: '0 0.5rem 0.5rem 0',
        padding: '1rem 1.25rem',
        margin: '1.5rem 0',
      }}
    >
      <p
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.5rem',
          color: v.labelColor,
        }}
      >
        {v.label}
      </p>
      <div
        style={{
          fontSize: '0.875rem',
          color: 'var(--ink-lo)',
          lineHeight: '1.6',
        }}
      >
        {children}
      </div>
    </aside>
  );
}
