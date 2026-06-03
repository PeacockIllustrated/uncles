# Uncle's — Admin Dashboard UX Spec

The admin dashboard is the value of the Studio tier. Roma uses it from his phone, behind the counter, between customers. Every interaction must be:

- **Fast** — load instantly, save instantly, no spinners on common actions
- **Phone-first** — every flow must work cleanly at 390×844px
- **Plain English** — Roma's English is second language, and he is not a technical user
- **Visually consistent with the customer site** — same mallard, gold, cream, fonts. Not a generic admin theme.
- **Forgiving** — undoable actions, confirmations on destructive ones, audit log

---

## Auth

### `/admin/login`

Magic-link only. No passwords.

- Centered card on the standard mallard background
- UNCLE'S brand mark at top
- One field: "Email"
- One button: "Send me a sign-in link"
- Below: tiny "Need access? Contact Tom" line
- After submit: "Check your email for the link" message

**Implementation**: Supabase `signInWithOtp`. Redirect URL → `/admin`. Server-side check on `/admin` protects all admin routes — if user is not in `uncle_admin_users`, redirect to `/` with a friendly message.

---

## `/admin` — Dashboard home

The home page when Roma opens the admin. Snapshot of state.

**Layout (mobile):**

```
┌────────────────────────────┐
│  UNCLE'S  ·  ADMIN         │
│  ────────────────────      │
│                            │
│  Hello, Roma               │
│  Your menu is up to date.  │
│                            │
│  ┌──────────────────────┐  │
│  │  MENU                │  │
│  │  Last updated 2 days │  │
│  │  ago.                │  │
│  │  [ Edit menu →     ] │  │
│  └──────────────────────┘  │
│                            │
│  ┌──────────────────────┐  │
│  │  NEWS                │  │
│  │  No active posts.    │  │
│  │  [ Manage news →   ] │  │
│  └──────────────────────┘  │
│                            │
│  ┌──────────────────────┐  │
│  │  SETTINGS            │  │
│  │  Opening hours, etc. │  │
│  │  [ Open settings → ] │  │
│  └──────────────────────┘  │
│                            │
│  Recently changed:         │
│  · Roma price updated      │
│  · Salami added back       │
│                            │
└────────────────────────────┘
```

**Cards** use the same bordered-band treatment as Dolce / dessert cards on the customer site. Diamond ornaments at left/right vertical centre. Subtle gradient fill.

**Recent changes** pulls last 5 entries from `uncle_admin_audit`, formatted in plain English ("Roma price updated", not "UPDATE on uncle_item_sizes").

---

## `/admin/menu` — Section list

Lists all sections in display order. Each section row shows: name, item count, visibility toggle.

```
┌────────────────────────────┐
│  ←  MENU                   │
│  ────────────────────      │
│                            │
│  Drag to reorder. Tap to   │
│  edit items.               │
│                            │
│  ┌──────────────────────┐  │
│  │ ☰  Signature Panuozzi│  │
│  │    6 items     [ON]  │  │
│  └──────────────────────┘  │
│  ┌──────────────────────┐  │
│  │ ☰  Italian Coffee    │  │
│  │    5 items     [ON]  │  │
│  └──────────────────────┘  │
│  ...                       │
│                            │
│  [ + Add a new section ]   │
└────────────────────────────┘
```

**Drag to reorder** uses a touch-friendly handle on the left. On desktop, drag the whole row. On mobile, tap-and-hold the handle.

**Visibility toggle** flips `visible` on the section. Hides it from customer site immediately.

**Tap a row** → `/admin/menu/[section-slug]`.

**Add a new section** → modal/sheet with: title, slug auto-derived, tagline (optional), display order placed at end.

---

## `/admin/menu/[section]` — Item list for one section

The most-used page. Roma comes here to update prices.

```
┌────────────────────────────┐
│  ←  SIGNATURE PANUOZZI     │
│  ────────────────────      │
│                            │
│  ┌──────────────────────┐  │
│  │ ROMA                 │  │
│  │ Prosciutto crudo,..  │  │
│  │ Classico  £ 8.95  ✓  │  │
│  │ Grande    £11.45  ✓  │  │
│  └──────────────────────┘  │
│                            │
│  ┌──────────────────────┐  │
│  │ MILANO               │  │
│  │ Mortadella al pist.. │  │
│  │ Classico  £ 8.95  ✓  │  │
│  │ Grande    £11.45  ✓  │  │
│  └──────────────────────┘  │
│  ...                       │
│                            │
│  [ + Add a new item ]      │
└────────────────────────────┘
```

**Each item card has:**
- Name (tap to edit inline)
- Description (tap to edit inline, multiline)
- Each size as a row: label, price input, available checkbox
- Tap "..." on the card for delete / duplicate / reorder

**Inline price editing:**
- The price displays as `£ 8.95`
- Tap → input becomes editable, focus auto, numeric keyboard, decimal allowed
- Type new price → debounced 600ms → auto-save → tiny gold "Saved" toast bottom-right
- If save fails → red "Couldn't save" toast with retry button, value rolls back
- Pressing tab/enter triggers immediate save

**Available checkbox:**
- Unchecked = item is hidden from customer site (`available = false`)
- Useful for "we ran out of mortadella today"
- Roma can re-enable instantly

**Add a new item:**
- Sheet/modal with: name, description (optional), sizes (one or two)
- For "one size" items (coffee, drinks), single price field
- For "two size" items (panuozzi-style), dual fields with size labels
- Display order auto-placed at end

---

## `/admin/news` — News posts

```
┌────────────────────────────┐
│  ←  NEWS                   │
│  ────────────────────      │
│                            │
│  ┌──────────────────────┐  │
│  │ Closed Sunday        │  │
│  │ Staff training.      │  │
│  │ Active until Sun     │  │
│  │ [ Edit ] [ Hide ]    │  │
│  └──────────────────────┘  │
│                            │
│  Drafts (1)                │
│  ┌──────────────────────┐  │
│  │ Easter hours         │  │
│  │ (not published)      │  │
│  │ [ Edit ] [ Publish ] │  │
│  └──────────────────────┘  │
│                            │
│  [ + Write a new post ]    │
└────────────────────────────┘
```

**News post fields:**
- Title (required, short)
- Body (required, short paragraph — no rich text editor needed; plain text with line breaks)
- Optional schedule: Starts at, Ends at — Roma can write a post on Wednesday for Sunday closure and it'll auto-show then auto-hide
- Published toggle

---

## `/admin/settings` — Site settings

```
┌────────────────────────────┐
│  ←  SETTINGS               │
│  ────────────────────      │
│                            │
│  TAGLINE                   │
│  Freshly baked daily ·     │
│  premium ingredients       │
│                            │
│  ADDRESS                   │
│  [ Address line 1     ]    │
│  [ Address line 2     ]    │
│  [ NE30               ]    │
│                            │
│  CONTACT                   │
│  [ Phone              ]    │
│  [ Email              ]    │
│                            │
│  OPENING HOURS             │
│  Monday    [11:00 - 21:00] │
│  Tuesday   [11:00 - 21:00] │
│  ...                       │
│                            │
│  GOOGLE MAPS LINK          │
│  [ https://maps.app...]    │
│                            │
│  [ Save settings ]         │
└────────────────────────────┘
```

Settings page has a single "Save" button — unlike menu pages, settings changes batch together. Less frequent edits, more deliberate.

---

## Cross-cutting requirements

### Toasts

Bottom-centre on mobile, bottom-right on desktop. Slide up + fade in, 0.2s. Auto-dismiss at 2.4s. Dismissible by tap.

- **Saved toast:** small gold pill with "Saved" + check icon
- **Error toast:** muted red pill with message + retry button
- **Undo toast:** for destructive actions, "Item deleted · Undo" with 6s window

### Confirmations

Inline only — no full-screen modals. When Roma taps "Delete", the button transforms in place into "Tap again to delete" for 3 seconds, then reverts. Two-tap pattern, no modal.

### Loading states

Avoid spinners on most actions. Use optimistic UI:
- Inline edit → display new value immediately, persist in background
- Add item → append optimistically, replace with server-returned ID on success
- Delete → fade out optimistically, undo if error

Only show spinners for genuine multi-second operations (e.g. bulk export — but we don't have any of those).

### Errors

When a Server Action fails:
1. Roll back the optimistic UI change
2. Show error toast in plain English ("Couldn't save price — try again?")
3. Log to Sentry (or whatever's wired up in the Onesign monolith)
4. **Never** show a stack trace or technical error to Roma

### Empty states

Each list page has a friendly empty state:
- Menu sections empty → "No menu yet. Add your first section."
- Items empty → "This section is empty. Add an item."
- News empty → "No news posts. Roma's first post might announce opening day."

### Admin top bar

Persistent across all admin pages. Shows:
- ← back button (only on subpages)
- Page title (centre)
- Roma's avatar/initial + sign out (right)

Minimal. No menu hamburgers, no breadcrumbs, no shortcuts. Roma navigates by tapping cards on `/admin` home.
