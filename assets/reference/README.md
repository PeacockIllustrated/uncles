# Reference assets

These are the production HTML deliverables Roma has already approved. Treat them as **patterns to study**, not files to copy or convert.

| File | What it shows |
|---|---|
| `screen-1-panuozzi-production.html` | TV Screen 1 layout: brand mark, panuozzi list with two prices per item, Dolce shared band |
| `screen-2-production.html` | TV Screen 2 layout: 2×2 quadrant grid for Coffee, Drinks, Extras, Desserts |
| `uncles-mobile-menu-customer.html` | **The closest reference for the website**. Customer-facing mobile menu with splash screen and subtle parallax. Single-scroll layout. |
| `uncles-mobile-menu.html` | Older mobile menu with editable prices and save-as-PDF (the inline-edit pattern is useful for the admin) |
| `uncles-table-menu-a5.html` | A5 print menu (front + back) with `@page` rules |
| `uncles-brand-pack.html` | Brand reference document |
| `uncles-scope-pack.html` | The scope/pricing pack Roma signed off on (read for understanding what's IN scope) |

## How to use these

**Read them, don't port them.**

Open the file, study the structure, the spacing, the splash sequence keyframes, the parallax script, the section-band pattern. Then write **fresh React components** using the locked Tailwind tokens. Don't try to copy the HTML class-by-class — the HTML uses inline `<style>` blocks, and the React version will use Tailwind classes plus the design tokens system.

The patterns to extract:

- **Splash screen sequence** (in `uncles-mobile-menu-customer.html`) — the keyframe timing for rule draw → diamond pop → brand settle → sub-line draw → tap-to-skip hint. Copy the timing values, not the HTML.
- **Ambient parallax** (same file) — the `useScrollParallax` hook in the React version should mirror the JS at the bottom of this file. CSS custom properties drift on scroll, very subtly.
- **Section title band** (every file) — `[hairline] · [diamond] · [TITLE] · [diamond] · [hairline]`. Reusable component.
- **DolceBand** (in `screen-1-panuozzi-production.html` and `uncles-mobile-menu-customer.html`) — the shared label + two flavour rows pattern. Special case for items where `is_feature: true` and `sizes.length === 2`.
- **Inline price edit** (in `uncles-mobile-menu.html`) — `contenteditable="true" inputmode="decimal"`. The admin's `InlinePriceInput` should mirror the UX, not the HTML implementation.

## What NOT to bring forward

- The static HTML's inline `<style>` blocks — Tailwind replaces these
- The page-level layout assumptions (e.g. fixed mm sizing for print) — the website is fluid
- The pypdf overflow-strip workaround — only relevant for the print menu, not for web
- The `contenteditable` mechanism — admin uses controlled React inputs instead

## What to bring forward

- The **vocabulary** (mallard + gold + cream, Cormorant + Inter, diamonds + hairlines)
- The **spatial rhythm** (item rows have specific padding, sections have specific gaps)
- The **animation timings** (splash sequence, parallax velocity)
- The **language patterns** ("Sweet Panuozzo · Dolce", "Add to any panuozzo", "Freshly baked daily · premium ingredients")
- The **no-go list** (no images, no third typeface, no animation libraries, no QR codes)
