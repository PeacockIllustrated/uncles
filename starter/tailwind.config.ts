import type { Config } from 'tailwindcss';

/**
 * Uncle's — Tailwind config.
 * Design tokens locked. See docs/design-tokens.md for the source of truth.
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
          mid:  '#1C2F26',
        },
        gold: {
          DEFAULT: '#C7A06A',
          bright:  '#D9B681',
          soft:    '#A88654',
          faint:   'rgba(199, 160, 106, 0.22)',
          line:    'rgba(199, 160, 106, 0.45)',
        },
        cream: {
          DEFAULT: '#E8DDC7',
          soft:    'rgba(232, 221, 199, 0.78)',
        },
      },

      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
      },

      letterSpacing: {
        eyebrow: '0.42em',
        caps:    '0.32em',
        title:   '0.16em',
        item:    '0.08em',
      },

      backgroundImage: {
        'ambient-base': `
          radial-gradient(ellipse 70% 40% at var(--bg-x1, 25%) var(--bg-y1, 18%),
            rgba(45, 70, 56, 0.6) 0%, transparent 60%),
          radial-gradient(ellipse 80% 50% at var(--bg-x2, 78%) var(--bg-y2, 85%),
            rgba(8, 16, 12, 0.7) 0%, transparent 55%),
          linear-gradient(160deg, #13241D 0%, #0E1914 100%)
        `,
        'feature-band': `
          linear-gradient(135deg,
            rgba(199, 160, 106, 0.06) 0%,
            rgba(199, 160, 106, 0.02) 60%,
            transparent 100%)
        `,
      },

      boxShadow: {
        'feature-inset': 'inset 0 0 60px rgba(14, 25, 20, 0.3)',
      },

      animation: {
        // Splash sequence — keep these in step with the reference HTML
        'splash-rule':       'splashRuleDraw 0.7s 0.15s cubic-bezier(0.65,0,0.35,1) forwards',
        'splash-diamond':    'splashDiamondPop 0.4s 0.85s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'splash-brand':      'splashBrandSettle 0.8s 1.1s cubic-bezier(0.16,1,0.3,1) forwards',
        'splash-sub':        'splashSubFade 0.5s 1.7s ease-out forwards',
        'splash-hint':       'splashHintFade 0.6s 2.5s ease-out forwards',
      },

      keyframes: {
        splashRuleDraw:    { to: { transform: 'scaleX(1)' } },
        splashDiamondPop:  { to: { transform: 'rotate(45deg) scale(1)' } },
        splashBrandSettle: {
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        splashSubFade:     { to: { opacity: '1' } },
        splashHintFade:    { to: { opacity: '0.5' } },
      },
    },
  },
  plugins: [],
} satisfies Config;
