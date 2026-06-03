# Uncle's — Design Tokens (Locked)

These tokens are extracted directly from the production HTML deliverables Roma has already approved. Do not change any of them without explicit sign-off from Tom. Treat them as constants.

---

## Colour palette

| Token | Hex | Role |
|---|---|---|
| `--green-deep` | `#0E1914` | Page background base, deep shadow |
| `--green-base` | `#13241D` | Brand primary (Mallard Green) |
| `--green-mid` | `#1C2F26` | Subtle elevations, ambient highlights |
| `--gold` | `#C7A06A` | Antique gold accent — typography highlights, ornaments |
| `--gold-bright` | `#D9B681` | Hover state for gold |
| `--gold-soft` | `#A88654` | Operational caps colour, secondary accent |
| `--gold-faint` | `rgba(199, 160, 106, 0.22)` | Hairline rules, dividers |
| `--gold-line` | `rgba(199, 160, 106, 0.45)` | Frame borders |
| `--cream` | `#E8DDC7` | Body text |
| `--cream-soft` | `rgba(232, 221, 199, 0.78)` | Secondary body text, taglines |

**Usage ratio:** ~70% mallard fields / 25% gold accent / 5% cream content.

**Page background** for both customer and admin: `linear-gradient(160deg, var(--green-base) 0%, var(--green-deep) 100%)` with two radial gradient blooms layered over (see `uncles-mobile-menu-customer.html` `.ambient` for the exact spec).

---

## Typography

Two faces. Never a third.

### Display: Cormorant Garamond
Google Fonts. Weights used: 400, 500, 600, 700, plus 400 italic, 500 italic, 600 italic.

| Role | Weight | Size (mobile) | Size (desktop) | Letter-spacing |
|---|---|---|---|---|
| Brand mark | 700 | 56px | 64-88px | 0.045em |
| Section title | 500 | 17px | 22px | 0.42em UPPERCASE |
| Item name | 600 | 24-26px | 32-44px | 0.08em UPPERCASE |
| Price | 500 | 18-22px | 28-36px | 0.02em |
| Description | 400 italic | 14-15px | 18-22px | 0.005em |

### Operational: Inter
Google Fonts. Weights used: 300, 400, 500, 600.

| Role | Weight | Size | Letter-spacing |
|---|---|---|---|
| Eyebrow / column label | 400 | 9-10px | 0.32-0.42em UPPERCASE |
| Operational caps | 500 | 8-12px | 0.42em UPPERCASE |
| Page markers | 400 | 9px | 0.42em UPPERCASE |

---

## Ornament vocabulary

Three motifs. Used consistently. Do not invent new ones.

### Diamond ◆
Rotated 45°. Used as:
- Item row markers (small, 4-5px, opacity 0.5)
- Section title bookends (8-11px, full opacity gold)
- Corner ornaments on frames (3mm × 3mm with inner gold dot)
- Inline dividers in trios

### Hairline gold rule
0.3-0.5pt thick. Two patterns:
- **Solid:** for frame borders (uses `--gold-line`)
- **Gradient:** for section title bands (`linear-gradient(90deg, transparent, var(--gold) 80%)` and mirror)

### Section title band
Pattern: `[hairline-rule] · [diamond] · [TITLE] · [diamond] · [hairline-rule]`. Used as the dividing element between every section.

---

## Spacing scale

Working in `mm` for print contexts (A5 menu) and `px` for screen.

### Screen (px)
- Tight: 4, 6, 8
- Default: 12, 16, 18, 24
- Generous: 32, 40, 48
- Section gaps: 32, 40, 48, 60

### Print (mm)
- Tight: 1, 1.5, 2
- Default: 3, 4, 5
- Generous: 6, 8, 10
- Page padding: 9-14mm depending on format

---

## Component primitives

### Frames
Two-layer hairline frame system:
- Outer frame: `inset: 3mm` (print) or 10px (screen), 0.4pt/0.5px gold-line
- Inner frame: `inset: 5mm` (print) or 14px (screen), 0.3pt/0.3px gold-faint
- Corner ornaments at 1.5mm/8px from page edge, rotated 45°, with inner gold dot

### Section title band
Centred row: hairline rule (60px max-width) + diamond (8px) + title (uppercase, 0.42em letter-spacing) + diamond + hairline rule.

### Item rows
Either 3-column grid (1fr name+desc | 16mm classico | 16mm grande) for panuozzi-style, or 2-column (1fr name | auto price) for simple lists.

### Feature bands (Dolce, Desserts cards)
Bordered rectangle with diamond ornaments at left/right vertical centre. Subtle inset gradient `linear-gradient(135deg, rgba(199,160,106,0.06) 0%, rgba(199,160,106,0.02) 60%, transparent 100%)`.

---

## Tailwind config snippet

```ts
// tailwind.config.ts excerpt
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'green-deep': '#0E1914',
        'green-base': '#13241D',
        'green-mid': '#1C2F26',
        'gold': {
          DEFAULT: '#C7A06A',
          bright: '#D9B681',
          soft: '#A88654',
          faint: 'rgba(199, 160, 106, 0.22)',
          line: 'rgba(199, 160, 106, 0.45)',
        },
        'cream': {
          DEFAULT: '#E8DDC7',
          soft: 'rgba(232, 221, 199, 0.78)',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        'eyebrow': '0.42em',
        'caps': '0.32em',
        'title': '0.16em',
        'item': '0.08em',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

Full file in `starter/tailwind.config.ts`.

---

## Aesthetic adjective (the tiebreaker)

> **"Restrained Italian premium — closer to Lina Stores than to a country house hotel."**

Use this as the tiebreaker when a design decision goes either way. If something feels generic-luxury (Greek key borders, art deco flourishes, AI-default gold-on-black), it's wrong. If it feels Italian, considered, quiet, intentional, it's right.

Reference real brands for visual register: **Lina Stores, Padella, Mei Mei, Quo Vadis**. Avoid Pinterest "luxury menu" boards.

---

## No-go list (out of scope, do not add)

- No third typeface
- No images on the menu (Phase 2 photography commission only)
- No animation beyond the splash + parallax already in the customer mobile reference
- No QR codes unless explicitly requested
- No third-party UI kits / themes
- No light mode toggle (the brand is dark mode by default)
- No gradients beyond the existing radial blooms and 135deg gold-tint band fills
- No shadows beyond the existing `box-shadow: inset 0 0 60px rgba(14, 25, 20, 0.3)` for feature bands
