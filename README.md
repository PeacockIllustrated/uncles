# Uncle's — Claude Init Pack

For starting the website + admin dashboard build with Claude Code.

## What this is

The complete context Claude Code needs to build the Uncle's customer website and self-service admin dashboard. The visual language, menu data, and architectural decisions are all locked. Claude Code's job is to implement, not redesign.

## How to use

1. **Drop this whole folder into a fresh repo** (or into the Onesign monolith under the appropriate tenant route group).
2. **Open `CLAUDE.md` first** — it's the master brief.
3. **Then read `docs/` in this order:**
   - `design-tokens.md` — locked colours, typography, ornaments
   - `data-schema.md` — Supabase DDL with RLS
   - `seed-data.json` — every menu item with locked prices
   - `admin-ux-spec.md` — detailed admin dashboard spec
   - `component-map.md` — suggested React breakdown
4. **Reference `assets/reference/`** for the existing HTML deliverables — these are patterns, not files to copy.
5. **Use `starter/`** for `package.json`, `tailwind.config.ts`, and `.env.example` to scaffold the project.

## What's in this pack

```
uncles-init-pack/
├── README.md                      ← you are here
├── CLAUDE.md                      ← MASTER BRIEF — read first
├── docs/
│   ├── design-tokens.md           ← locked palette, typography, spacing
│   ├── data-schema.md             ← Supabase DDL + RLS policies
│   ├── seed-data.json             ← every menu item, locked
│   ├── admin-ux-spec.md           ← detailed admin spec
│   └── component-map.md           ← suggested React breakdown
├── assets/
│   └── reference/
│       ├── README.md              ← how to use the reference HTMLs
│       └── (7 production HTMLs Roma already has)
└── starter/
    ├── package.json
    ├── tailwind.config.ts
    └── .env.example
```

## Quick start (for Tom)

When ready to start Session 1:

```bash
# 1. Create the working repo (or open the monolith)
git clone git@github.com:PeacockIllustrated/onesign-monolith.git
cd onesign-monolith

# 2. Drop this init pack into the tenant folder
cp -r /path/to/uncles-init-pack ./tenants/uncles
# OR for standalone scaffold:
mkdir uncles && cd uncles && cp -r /path/to/uncles-init-pack/* .

# 3. Open Claude Code and point it at the folder
claude code .

# 4. Tell Claude: "Read CLAUDE.md and start Session 1"
```

## Session plan summary

| # | Focus |
|---|---|
| 1 | Scaffold + Supabase schema + seed + design tokens |
| 2 | Customer site — menu page, parallax, splash |
| 3 | Customer site — about/contact + SEO + polish |
| 4 | Admin auth + dashboard layout + menu list |
| 5 | Admin item editing + news + settings |
| 6 | Audit log, polish, deploy, walkthrough doc |

5-6 sessions of 2-3 hours each. Tom + Claude collaborative pace, not solo-dev hours.

## Honest reminders

- **Do not redesign the brand.** It's locked.
- **Do not invent menu data.** It's in seed-data.json.
- **Do not add scope creep features.** No ordering, reservations, loyalty, etc.
- **Phone-first for both customer and admin.** Roma uses both from his phone.
- **No em dashes anywhere.** Tom's preference.
- **Audit log every admin mutation.** Roma needs to be able to undo.
