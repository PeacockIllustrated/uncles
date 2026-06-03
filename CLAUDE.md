# UNCLE'S — Customer Website + Self-Service Admin Dashboard

This is the master init document for the Uncle's Panuozzo & Sandwiches website build, the next phase of the Studio package delivery.

---

## Project context

**Client:** Roma. Owner of Uncle's Panuozzo & Sandwiches, North Shields, NE30. Italian heritage, English second language. Friend-rate client. Studio tier paid 50/50, hardware (2× Android sticks + Fully Kiosk licences) already procured and arriving.

**Product:** A small marketing website with menu, opening hours, location, and a customer-facing mobile menu. Plus a private admin dashboard where Roma can update prices, edit menu items, toggle availability, and post short news (e.g. "Closed Sunday for staff training").

**Why it matters:** Roma has paid for the Studio tier specifically to get the admin dashboard. He has been calling Tom every time a price needed updating on his old menus. The dashboard ends those calls. This is the core value of the Studio tier.

**Visual language:** Already locked. **Do NOT reinvent the brand.** Mallard green primary `#13241D`, antique gold accent `#C7A06A`, cream `#E8DDC7`, Cormorant Garamond display, Inter operational, diamond ornaments, hairline gold rules, "restrained Italian premium" aesthetic adjective.

Reference deliverables already shipped to Roma — the website should be a port of these, not a redesign:
- `screen-1-panuozzi-production.html` (TV Screen 1 — Signature Panuozzi)
- `screen-2-production.html` (TV Screen 2 — Coffee, Drinks, Extras, Desserts)
- `uncles-mobile-menu-customer.html` (the customer-facing single-page mobile menu — the closest reference for the website)
- `uncles-table-menu-a5.html` (printed table menu)
- `uncles-brand-pack.html` (brand reference)

These are in `assets/reference/`. Read them as patterns, not files to copy directly. Build fresh React components using the locked tokens.

---

## Tech stack — Tom's standard, no deviations

| Layer | Choice |
|---|---|
| Framework | Next.js 15 App Router |
| Language | TypeScript strict |
| Styling | Tailwind CSS with custom design tokens (see `docs/design-tokens.md`) |
| Database | Supabase (Postgres + Auth + RLS) |
| Hosting | Vercel |
| Auth | Supabase Auth, magic-link email for admin |
| State (admin) | Zustand for client-side admin UI state |
| Animation | None on the customer site beyond what's in the reference HTML — the splash + parallax. No new animation libraries. |
| Forms (admin) | React Hook Form + Zod |
| Icons | Lucide React |

**Do not add:** styled-components, CSS-in-JS libraries, Material UI, ChakraUI, framer-motion, animation libraries, GraphQL, tRPC, Drizzle, Prisma, custom auth providers. The stack is settled.

---

## Architecture — Onesign monolith integration

This site lives inside the **Onesign multi-tenant monolith**, not as a standalone repo. The Onesign monolith was consolidated in late March: one Next.js codebase, one Supabase instance, one Vercel deployment, with subdomains routed via Wix DNS CNAME.

Uncle's gets:
- Subdomain: **`uncles.onesign.io`** (or whatever DNS resolves — confirm with Tom before deploying)
- Tenant ID in Supabase: `tenant_uncles` (UUID generated, but slug-key is `uncles`)
- All Supabase tables for Uncle's data prefixed `uncle_` (matches the project's data naming pattern alongside `stick_` for Durham Stickmakers etc.)
- Routes scoped under `/(tenants)/uncles/...` route group in the App Router
- Admin dashboard at `/(tenants)/uncles/admin` behind auth gate

If working in a fresh repo to scaffold first, fine — but the final integration target is the monolith. Don't add tenant-isolation logic that fights the Onesign middleware (already in place at the monolith level).

Confirm with Tom which mode you're in:
- **Mode A:** scaffolding standalone for rapid iteration, will merge into monolith after
- **Mode B:** building directly into the Onesign monolith from session 1

Default to **Mode A** unless told otherwise. Faster iteration, less overhead.

---

## Data model — Supabase schema

See `docs/data-schema.md` for the full DDL. Summary:

```
uncle_menu_sections      — Panuozzi, Coffee, Drinks, Extras, Desserts (ordered, toggleable)
uncle_menu_items         — Items belonging to sections (with sizes, descriptions, prices, available flag)
uncle_item_sizes         — For panuozzi (Classico/Grande), Dolce (Nutella/Pistachio)
uncle_news               — Short news posts ("Closed Sunday")
uncle_settings           — Opening hours, contact, address, tagline
uncle_admin_users        — Linked to Supabase auth.users (Roma's account)
```

RLS policies:
- Public **read** access on `uncle_menu_sections`, `uncle_menu_items`, `uncle_item_sizes`, `uncle_news`, `uncle_settings`
- Admin **write** access only for users in `uncle_admin_users`
- Roma's email gets seeded into `uncle_admin_users` on first deploy

Initial data is in `docs/seed-data.json` — every panuozzi, coffee, drink, extra, dessert with their locked prices. Use this as the seed; do not invent or guess menu items.

---

## What to build — prioritised

### Phase 1: Customer site (the easy half)

The customer site is a Next.js port of `uncles-mobile-menu-customer.html`. Same content, same visual language, same splash screen, same subtle parallax. But:

- Server-rendered React, not static HTML
- Menu data fetched from Supabase (see schema)
- Mobile-first responsive (the reference is already mobile-shaped)
- SEO basics — meta description, Open Graph, structured data for restaurant
- Lighthouse 95+ on mobile

**Pages:**
- `/` — full menu (single scroll, like the reference)
- `/about` — short paragraph, opening hours, location, address
- `/contact` — phone, email, map embed (Google Maps for North Shields, NE30)

**Do NOT build:**
- Online ordering / cart / checkout — out of scope, confirmed
- Reservations — out of scope
- Loyalty / accounts — out of scope
- Newsletter signup — out of scope unless Roma asks
- Blog beyond the news/announcements — out of scope

### Phase 2: Admin dashboard (the value)

Routes under `/(tenants)/uncles/admin/`. Auth-gated. The admin dashboard is what makes this the Studio tier.

**Pages, in build order:**

1. `/admin/login` — Supabase magic-link, email-based, no password
2. `/admin` — dashboard home, status overview ("Menu last updated X", "5 items unavailable", recent news)
3. `/admin/menu` — section list with drag-handle reorder, click section to manage items
4. `/admin/menu/[section]` — items list, edit prices/descriptions inline, toggle availability, add/remove items
5. `/admin/news` — list news posts, create/edit/publish/unpublish
6. `/admin/settings` — opening hours, contact, address, tagline

**Key UX requirements (these are the non-obvious bits):**

- **Inline editable prices** — Roma should tap a price and type. No modal, no separate form. Mirror the pattern from `uncles-mobile-menu.html` (the original mobile menu had editable prices via `contenteditable`). In React, use a controlled input that shows as plain text until tapped.
- **Save without explicit save button where possible** — debounced auto-save on inline edits. Show a small "Saved" toast. Roma will not remember to hit save buttons.
- **Mobile-first admin** — Roma will use this from his phone, behind the counter, between customers. The admin must be fully usable on mobile, not just "responsive". Test every flow on a 390×844 viewport.
- **Confirmation on destructive actions** — deleting an item, taking down news. Use a small inline confirm, not a modal that requires accuracy on a phone.
- **Visual consistency with the customer site** — same mallard, gold, cream, same fonts. The admin should feel like the same brand, not a generic admin theme. Reference `docs/design-tokens.md`.

**Technical requirements:**

- Optimistic UI updates with rollback on error
- All admin actions logged to `uncle_admin_audit` (timestamp, user, action, before/after JSON) — Roma should be able to undo a recent change if he hits the wrong button
- TypeScript types generated from Supabase schema, not hand-written
- Server Components for read-heavy pages; Client Components only for interactive admin forms

### Phase 3: Polish + handover

- Set up Vercel deployment with the Uncle's subdomain
- Seed Roma's admin account
- Walk Roma through the dashboard on launch day
- Document the dashboard in plain English (for Roma) — saved as `docs/uncles-admin-guide.md`

---

## Estimated session count

5-6 sessions of 2-3 hours each. Tom + Claude collaborative, not solo-dev hours.

| Session | Focus |
|---|---|
| 1 | Project scaffold, Supabase schema, seed data, design token setup |
| 2 | Customer site — menu page, parallax, splash |
| 3 | Customer site — about/contact, SEO, polish |
| 4 | Admin auth + admin dashboard layout + menu list |
| 5 | Admin menu item editing + news + settings |
| 6 | Audit log, polish, deploy, walkthrough doc |

Adjust as needed. Don't pad.

---

## What NOT to do — guardrails

1. **Do not redesign the brand.** Mallard, gold, cream, Cormorant, Inter, diamonds, hairlines. If something seems to need a new visual element, the brand pack is wrong — flag it, don't improvise.
2. **Do not invent menu data.** Every item, every price, every description comes from `docs/seed-data.json`. If something seems missing, ask.
3. **Do not add scope creep features.** No ordering, no reservations, no loyalty, no newsletter signup unless Roma explicitly asks. The scope was set with Roma in the scope pack — re-reading is allowed.
4. **Do not skip RLS.** Public-read, admin-write. Test the RLS policies before deploying.
5. **Do not build admin features without considering Roma's English level.** Plain language, no jargon, no abbreviations. "Save" not "Persist". "Hide from menu" not "Toggle availability".
6. **Do not write a 200-line Server Action when a 20-line one will do.** Lean code. Tom + Claude move fast — don't pad.
7. **Do not use em dashes** in any user-facing copy or comments. Tom's preference.
8. **Do not use animation libraries.** The splash + parallax patterns from the reference HTML use plain CSS animations and a tiny IntersectionObserver. That stays.

---

## Reference files in this init pack

| Path | What it is |
|---|---|
| `CLAUDE.md` | This file. Read first. |
| `docs/design-tokens.md` | Locked colours, typography, spacing, ornament patterns |
| `docs/data-schema.md` | Full Supabase DDL with RLS policies |
| `docs/seed-data.json` | Locked menu data — every item, price, description |
| `docs/admin-ux-spec.md` | Detailed spec for each admin page |
| `docs/component-map.md` | Suggested React component breakdown |
| `assets/reference/` | The 6 HTML deliverables Roma already has — read as patterns |
| `starter/package.json` | Recommended dependencies |
| `starter/tailwind.config.ts` | Pre-configured with Uncle's design tokens |
| `starter/.env.example` | Env vars needed |

---

## On working with Tom

- Direct, honest, no sugar-coating. Push back where warranted.
- Mobile-first thinking — Tom often works from his phone.
- "Field notes" = log as backlog, do NOT implement. Acknowledge and move on.
- "Y N" responses → single word answer, no explanation.
- No em dashes.
- Phone-friendly responses — short paragraphs, lists where useful.
- The project-pricing skill applies if scope/cost decisions come up. Run a structured workup.

---

## On the customer

Roma is Italian, second-language English, family-friendly takeaway. Respect his time. The dashboard exists because every call to Tom was a call away from his customers and his oven. Build the dashboard so he never has to call again about menu changes. That's the standard.
