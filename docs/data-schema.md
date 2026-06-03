# Uncle's — Supabase Data Schema

Run this DDL against the Onesign monolith Supabase instance. All tables prefixed `uncle_` to coexist with other tenants.

> **Implemented 2026-06-03 (read the migration, not this doc, for the live shape).** The build went into the `personal-projects` Supabase project, which is a shared multi-app DB. Per instruction every object is prefixed **`uncles_`** (with an `s`), not `uncle_`. Differences from the DDL below as applied: helper functions are `uncles_set_updated_at()` / `uncles_is_admin()` (both `set search_path = ''`); `uncles_item_sizes` has an extra `note text` column (Dolce filling text / dessert size); admin policies are scoped `TO authenticated` and `anon`'s EXECUTE on `uncles_is_admin()` is revoked. Migrations: `uncles_init`, `uncles_harden_admin_policies`. The DDL below is kept as the original reference.

---

## Schema

```sql
-- Sections (Panuozzi, Coffee, Drinks, Extras, Desserts, etc.)
create table uncle_menu_sections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,                   -- 'panuozzi', 'coffee', 'drinks', 'extras', 'desserts'
  title text not null,                          -- 'Signature Panuozzi'
  tagline text,                                 -- 'Choose Classico or Grande'
  display_order int not null default 0,
  visible boolean not null default true,
  layout_hint text default 'list',              -- 'list', 'grid', 'feature' (drives renderer choice)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Items (Roma, Milano, Espresso, Mozzarella, Tiramisu, etc.)
create table uncle_menu_items (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references uncle_menu_sections(id) on delete cascade,
  slug text not null,                           -- 'roma', 'milano', 'espresso'
  name text not null,                           -- 'Roma', 'Milano', 'Espresso'
  description text,                             -- 'Prosciutto crudo, stracciatella, fresh tomato, rocket, balsamic glaze'
  display_order int not null default 0,
  available boolean not null default true,
  is_feature boolean not null default false,    -- true for Dolce-style feature bands
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (section_id, slug)
);

-- Sizes (Classico/Grande for panuozzi, Nutella/Pistachio for Dolce)
-- A simple item with one size has a single row here with size_label = null.
create table uncle_item_sizes (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references uncle_menu_items(id) on delete cascade,
  size_label text,                              -- 'Classico', 'Grande', 'Nutella', 'Pistachio', null for single-size
  display_order int not null default 0,
  price_pence int not null,                     -- £8.95 stored as 895 — avoids float drift
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- News / announcements
create table uncle_news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,                                    -- short paragraph
  published boolean not null default false,
  starts_at timestamptz,                        -- optional schedule
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Site settings (singleton row)
create table uncle_settings (
  id uuid primary key default gen_random_uuid(),
  tagline text default 'Freshly baked daily · premium ingredients',
  address_line1 text,
  address_line2 text,
  postcode text default 'NE30',
  phone text,
  email text,
  opening_hours jsonb,                          -- { mon: '11-21', tue: '11-21', ... }
  google_maps_url text,
  updated_at timestamptz not null default now()
);

-- Admin users (links to auth.users)
create table uncle_admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz not null default now()
);

-- Audit log for undo / accountability
create table uncle_admin_audit (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  action text not null,                         -- 'update_price', 'delete_item', 'publish_news'
  entity_type text not null,                    -- 'menu_item', 'item_size', 'news'
  entity_id uuid,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz not null default now()
);

-- updated_at triggers
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger uncle_menu_sections_updated before update on uncle_menu_sections
  for each row execute function set_updated_at();
create trigger uncle_menu_items_updated before update on uncle_menu_items
  for each row execute function set_updated_at();
create trigger uncle_item_sizes_updated before update on uncle_item_sizes
  for each row execute function set_updated_at();
create trigger uncle_news_updated before update on uncle_news
  for each row execute function set_updated_at();
create trigger uncle_settings_updated before update on uncle_settings
  for each row execute function set_updated_at();
```

---

## RLS policies

```sql
-- Enable RLS on every table
alter table uncle_menu_sections   enable row level security;
alter table uncle_menu_items      enable row level security;
alter table uncle_item_sizes      enable row level security;
alter table uncle_news            enable row level security;
alter table uncle_settings        enable row level security;
alter table uncle_admin_users     enable row level security;
alter table uncle_admin_audit     enable row level security;

-- Public read on customer-facing tables
create policy "public read sections"
  on uncle_menu_sections for select using (visible = true);

create policy "public read items"
  on uncle_menu_items for select using (available = true);

create policy "public read sizes"
  on uncle_item_sizes for select using (true);

create policy "public read published news"
  on uncle_news for select using (
    published = true
    and (starts_at is null or starts_at <= now())
    and (ends_at   is null or ends_at   >= now())
  );

create policy "public read settings"
  on uncle_settings for select using (true);

-- Helper: is current user an Uncle's admin?
create or replace function is_uncle_admin() returns boolean as $$
  select exists (
    select 1 from uncle_admin_users where user_id = auth.uid()
  );
$$ language sql stable security definer;

-- Admin write on every table
create policy "admin write sections"
  on uncle_menu_sections for all using (is_uncle_admin()) with check (is_uncle_admin());
create policy "admin write items"
  on uncle_menu_items for all using (is_uncle_admin()) with check (is_uncle_admin());
create policy "admin write sizes"
  on uncle_item_sizes for all using (is_uncle_admin()) with check (is_uncle_admin());
create policy "admin write news"
  on uncle_news for all using (is_uncle_admin()) with check (is_uncle_admin());
create policy "admin write settings"
  on uncle_settings for all using (is_uncle_admin()) with check (is_uncle_admin());

-- Admin can read their own admin_users row, not others
create policy "admin self read"
  on uncle_admin_users for select using (user_id = auth.uid() or is_uncle_admin());

-- Audit log: admins can read all, write triggered by Server Actions
create policy "admin read audit"
  on uncle_admin_audit for select using (is_uncle_admin());
create policy "admin insert audit"
  on uncle_admin_audit for insert with check (is_uncle_admin());
```

---

## Seeding Roma's admin account

After Roma signs up via magic-link with his email:

```sql
insert into uncle_admin_users (user_id, email, display_name)
select id, email, 'Roma'
from auth.users
where email = 'roma@uncles.example';  -- replace with Roma's actual email
```

Tom should run this after Roma's first sign-in. Or wire it into the onboarding flow to auto-seed on first login if email matches a hardcoded list of Uncle's admin emails — confirm approach with Tom.

---

## Queries Claude Code will need

### Get the full menu (customer site)

```ts
// One round-trip with nested selects via Supabase relationships
const { data: sections } = await supabase
  .from('uncle_menu_sections')
  .select(`
    id, slug, title, tagline, display_order, layout_hint,
    items:uncle_menu_items (
      id, slug, name, description, display_order, is_feature,
      sizes:uncle_item_sizes (id, size_label, display_order, price_pence)
    )
  `)
  .eq('visible', true)
  .eq('items.available', true)
  .order('display_order');
```

Format prices on the client: `'£' + (price_pence / 100).toFixed(2)`.

### Get active news

```ts
const { data: news } = await supabase
  .from('uncle_news')
  .select('*')
  .eq('published', true)
  .or(`starts_at.is.null,starts_at.lte.${new Date().toISOString()}`)
  .or(`ends_at.is.null,ends_at.gte.${new Date().toISOString()}`)
  .order('created_at', { ascending: false });
```

### Update a price (admin Server Action)

```ts
'use server';

export async function updatePrice(sizeId: string, newPence: number) {
  const supabase = await createServerClient();
  const { data: before } = await supabase
    .from('uncle_item_sizes')
    .select('*')
    .eq('id', sizeId)
    .single();

  const { error } = await supabase
    .from('uncle_item_sizes')
    .update({ price_pence: newPence })
    .eq('id', sizeId);

  if (error) throw new Error(error.message);

  await supabase.from('uncle_admin_audit').insert({
    action: 'update_price',
    entity_type: 'item_size',
    entity_id: sizeId,
    before_state: before,
    after_state: { ...before, price_pence: newPence },
  });

  revalidatePath('/');
  revalidatePath('/admin/menu');
}
```
