/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,mdx,md,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: 'var(--bg-base)',
          elev: 'var(--bg-elev)',
          scene: 'var(--bg-scene)',
        },
        ink: {
          hi: 'var(--ink-hi)',
          lo: 'var(--ink-lo)',
        },
        accent: {
          cyan: 'var(--accent-cyan)',
          violet: 'var(--accent-violet)',
          warn: 'var(--accent-warn)',
        },
        line: 'var(--line)',
      },
      fontFamily: {
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      lineHeight: {
        prose: '1.6',
        display: '1.2',
      },
      maxWidth: {
        prose: '72ch',
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--ink-hi)',
            maxWidth: '72ch',
          },
        },
      },
    },
  },
  plugins: [],
};
