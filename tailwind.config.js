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
          base: '#0a0a0f',
          elev: '#15151d',
        },
        ink: {
          hi: '#f5f5f7',
          lo: '#9a9aa8',
        },
        accent: {
          cyan: '#22d3ee',
          violet: '#a78bfa',
          warn: '#f59e0b',
        },
        line: '#26262f',
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
            color: '#f5f5f7',
            maxWidth: '72ch',
          },
        },
      },
    },
  },
  plugins: [],
};
