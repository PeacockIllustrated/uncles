import type { Config } from 'tailwindcss';

/**
 * Uncle's — Tailwind config.
 * Design tokens locked. See docs/design-tokens.md for the source of truth.
 * Font families resolve to the next/font CSS variables set in src/app/layout.tsx.
 */
export default {
  content: [
    './src/app/**/*.{ts,tsx,mdx}',
    './src/components/**/*.{ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          deep: '#0E1914',
          base: '#13241D',
          mid: '#1C2F26',
        },
        gold: {
          DEFAULT: '#C7A06A',
          bright: '#D9B681',
          soft: '#A88654',
          faint: 'rgba(199, 160, 106, 0.22)',
          line: 'rgba(199, 160, 106, 0.45)',
        },
        cream: {
          DEFAULT: '#E8DDC7',
          soft: 'rgba(232, 221, 199, 0.78)',
        },
      },

      fontFamily: {
        display: ['var(--font-display)', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },

      letterSpacing: {
        eyebrow: '0.42em',
        caps: '0.32em',
        title: '0.16em',
        item: '0.08em',
      },

      boxShadow: {
        'feature-inset': 'inset 0 0 60px rgba(14, 25, 20, 0.3)',
      },
    },
  },
  plugins: [],
} satisfies Config;
