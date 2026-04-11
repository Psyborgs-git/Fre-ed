import { useState } from 'react';
import { trackCodeCopy } from '../lib/analytics.js';

/**
 * Styled code block with language header and copy button.
 * Theme-aware via CSS variables.
 */
export default function CodeBlock({ children, language, filename }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text =
      typeof children === 'string'
        ? children
        : children?.props?.children ?? '';

    try {
      await navigator.clipboard.writeText(
        typeof text === 'string' ? text.trim() : String(text),
      );
      setCopied(true);
      trackCodeCopy(window.location.pathname, language ?? 'unknown');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — fail silently
    }
  };

  return (
    <div
      className="relative my-6 rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--line)' }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          background: 'var(--bg-elev)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <span className="text-xs font-mono" style={{ color: 'var(--ink-lo)' }}>
          {filename ?? (language ? `.${language}` : 'code')}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs px-2.5 py-1 rounded transition-colors"
          style={{
            background: 'var(--bg-base)',
            border: '1px solid var(--line)',
            color: copied ? 'var(--accent-cyan)' : 'var(--ink-lo)',
          }}
          aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code area */}
      <pre
        className="p-4 overflow-x-auto text-sm leading-relaxed m-0 font-mono"
        style={{ background: 'var(--bg-base)', color: 'var(--ink-hi)' }}
      >
        {children}
      </pre>
    </div>
  );
}
