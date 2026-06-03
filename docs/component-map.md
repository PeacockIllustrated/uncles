# Uncle's — Component Map

Suggested component breakdown for the Next.js build. Names are conventions, not gospel — rename freely if it improves clarity.

---

## Customer site components

```
src/
  app/
    (uncles)/
      layout.tsx                      → AmbientBackground + Vignette wrappers
      page.tsx                        → fetches menu, renders <Menu /> with splash
      about/page.tsx
      contact/page.tsx
      news/[id]/page.tsx              → optional, single-news permalink

  components/
    customer/
      Splash.tsx                      → Splash screen (the entrance moment)
      AmbientBackground.tsx           → Ambient parallax gradient, paper grain, vignette
      BrandMark.tsx                   → "UNCLE'S" wordmark with sub-line
      SectionTitle.tsx                → Hairline rule + diamond + title + diamond + rule
      Menu.tsx                        → Top-level menu renderer; iterates sections
      MenuSection.tsx                 → Renders one section (delegates to layout-hint)
      MenuSectionList.tsx             → "list" layout (Coffee, Drinks, Extras-as-row)
      MenuSectionGrid.tsx             → "grid" layout (Extras two-column)
      MenuSectionFeature.tsx          → "feature" layout (Dolce, Desserts cards)
      ItemRow.tsx                     → Standard row: name, desc, prices
      ItemRowFeature.tsx              → Feature row: bordered card with diamonds
      DolceBand.tsx                   → Special: shared label + Nutella/Pistachio rows
      Price.tsx                       → Formats pence → £x.xx, gold colour
      Diamond.tsx                     → Reusable rotated diamond ornament
      Eyebrow.tsx                     → Small caps with letter-spacing (operational)
      NewsBanner.tsx                  → Active news posts at top of menu (if any)

    customer/animation/
      useScrollParallax.ts            → Hook: subtle radial-gradient drift on scroll
      useSplashController.ts          → Hook: splash dismiss on tap/scroll/auto
```

### Notes on customer components

- **Splash** uses CSS keyframes only. No JS animation library. Reference `uncles-mobile-menu-customer.html` for the exact keyframe sequence (rule → diamond → brand → sub-line).
- **AmbientBackground** uses a fixed-position div with two radial gradients and a paper-noise SVG overlay. Parallax updates CSS custom properties on scroll via `requestAnimationFrame`.
- **Menu** is a Server Component. It fetches data once, server-side, and passes to children. Splash and parallax are Client Components.
- **DolceBand** is a special case: when the renderer encounters `is_feature: true` AND the item has multiple `sizes`, render the shared-label band. Otherwise treat as ordinary feature item.

---

## Admin components

```
src/
  app/
    (tenants)/uncles/admin/
      layout.tsx                      → Auth guard, AdminTopBar wrapper
      page.tsx                        → Dashboard home (cards + recent activity)
      login/page.tsx                  → Magic-link form
      menu/page.tsx                   → Section list
      menu/[section]/page.tsx         → Item list for one section
      news/page.tsx                   → News posts list
      news/[id]/page.tsx              → Edit one post
      settings/page.tsx               → Site settings

    api/admin/
      (Server Actions live in components, not API routes)

  components/
    admin/
      AdminTopBar.tsx                 → Persistent top bar with back, title, sign-out
      AdminCard.tsx                   → Bordered card with diamond ornaments
      AdminButton.tsx                 → Gold button, ghost button, destructive button
      AdminInput.tsx                  → Text input styled to brand
      AdminTextarea.tsx               → Multiline input
      InlinePriceInput.tsx            → Tap-to-edit price with debounced auto-save
      InlineTextEdit.tsx              → Tap-to-edit text with debounced auto-save
      AvailabilityToggle.tsx          → Checkbox styled as gold tick / faint cross
      ToastContainer.tsx              → Bottom-centre toasts (Saved / Error / Undo)
      DangerConfirm.tsx               → Two-tap delete pattern
      Sheet.tsx                       → Bottom sheet for add/edit forms (mobile)
      EmptyState.tsx                  → Friendly empty list message
      DragHandle.tsx                  → Touch-friendly reorder handle

    admin/sections/
      SectionRow.tsx                  → One section in the section list
      SectionForm.tsx                 → Add/edit section form

    admin/items/
      ItemCard.tsx                    → One item in the item list
      ItemForm.tsx                    → Add/edit item form (handles 1- and 2-size cases)
      SizeRow.tsx                     → One size row inside an item card

    admin/news/
      NewsRow.tsx                     → One news post in the news list
      NewsForm.tsx                    → Add/edit news form

    admin/audit/
      RecentActivity.tsx              → Last 5 audit entries, plain-English

  lib/admin/
    actions.ts                        → Server Actions for all admin mutations
    audit.ts                          → Helper to log audit entries
    auth.ts                           → Helper to check is_uncle_admin server-side
    formatPrice.ts                    → Format pence → £x.xx
    parsePrice.ts                     → Parse user input → pence

  stores/
    adminUiStore.ts                   → Zustand: optimistic state, toast queue
```

### Notes on admin components

- **InlinePriceInput** is the most-used component. Get this right and everything else follows.
  - Display: `£ X.XX` in gold Cormorant
  - On focus: text becomes input, numeric keyboard, decimal allowed
  - On change: debounce 600ms, call Server Action
  - Optimistic update: parent state changes immediately
  - On failure: roll back, show error toast
- **Server Actions** are used throughout. Don't create API routes for admin mutations.
- **Audit logging** is automatic in every Server Action. Always log before/after state.
- **AdminTopBar** uses the same brand mark and ornament vocabulary as the customer site. Visual continuity matters.
- **Sheet** is the bottom-up modal for forms on mobile. On desktop, use a side panel or centred modal of moderate width.

---

## Shared / utility components

```
src/components/shared/
  HairlineRule.tsx                    → Linear-gradient hairline (for section bands)
  GoldFrame.tsx                       → Two-layer hairline frame with corners
  CornerOrnament.tsx                  → Diamond corner with inner gold dot
  Footer.tsx                          → Trio with diamonds (different copy per page)
  TopMarkers.tsx                      → "North Shields" + "Menu N° 01" editorial markers
```

The customer site and admin both use these.

---

## File-level conventions

- One component per file
- File name matches default export
- Co-locate styles via Tailwind classes — no separate CSS files except `globals.css` for design tokens and resets
- Server Components by default; mark Client Components with `'use client'` only when needed (interactivity, hooks)
- Props typed via TypeScript interface inline; reuse types from generated Supabase types where possible

---

## Naming

- Customer components: PascalCase, descriptive, no "Customer" prefix (they're under `components/customer/`)
- Admin components: PascalCase, "Admin" prefix on shared admin primitives (AdminCard, AdminButton)
- Hooks: camelCase, `use` prefix
- Stores: camelCase, `Store` suffix
- Server Actions: camelCase verbs (`updatePrice`, `createItem`, `publishNews`)
