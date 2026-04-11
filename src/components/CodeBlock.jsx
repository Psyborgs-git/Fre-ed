import { useState } from 'react';
import { trackCodeCopy } from '../lib/analytics.js';

/**
 * Styled code block with filename header and copy button.
 * Used as the MDX `pre` element override so all fenced code blocks get this treatment.
 */
export default function CodeBlock({ children, language, filename }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Extract text content from the children (handles nested <code> elements)
    const el = document.createElement('div');
    // children may be a React element; convert to text via innerText trick
    const text =
      typeof children === 'string'
        ? children
        : children?.props?.children ?? '';

    try {
      await navigator.clipboard.writeText(
        typeof text === 'string' ? text.trim() : String(text)
      );
      setCopied(true);
      trackCodeCopy(window.location.pathname, language ?? 'unknown');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — fail silently
    }
  };

  return (
    <div className="relative my-6 rounded-xl border border-line overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-bg-elev border-b border-line px-4 py-2">
        <span className="text-xs font-mono text-ink-lo">
          {filename ?? (language ? `.${language}` : 'code')}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs px-2.5 py-1 rounded bg-bg-base border border-line text-ink-lo hover:text-ink-hi transition-colors"
          aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code area */}
      <pre className="bg-bg-base p-4 overflow-x-auto text-sm leading-relaxed m-0">
        {children}
      </pre>
    </div>
  );
}
