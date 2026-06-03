import seed from '@/data/seed-menu.json';
import type { MenuSection, Settings } from './types';
import { createPublicClient } from './supabase/public';

const byOrder = (a: { display_order: number }, b: { display_order: number }) =>
  a.display_order - b.display_order;

// Normalise (filter hidden/unavailable, sort everything) so the seed fallback
// and the live DB return identically shaped, ordered data.
function normalise(sections: MenuSection[]): MenuSection[] {
  return sections
    .filter((s) => s.visible)
    .slice()
    .sort(byOrder)
    .map((s) => ({
      ...s,
      items: (s.items ?? [])
        .filter((i) => i.available)
        .slice()
        .sort(byOrder)
        .map((i) => ({ ...i, sizes: (i.sizes ?? []).slice().sort(byOrder) })),
    }));
}

// Reads the menu from Supabase (uncles_ tables). Falls back to the bundled
// seed data if Supabase is unconfigured, errors, or returns nothing — the
// customer menu must never render blank. Swap nothing else: the return shape
// matches the seed.
export async function getMenu(): Promise<MenuSection[]> {
  const supabase = createPublicClient();
  if (!supabase) return normalise(seed.sections as MenuSection[]);

  const { data, error } = await supabase.from('uncles_menu_sections').select(
    `slug, title, tagline, display_order, visible, layout_hint,
     items:uncles_menu_items (
       slug, name, description, display_order, available, is_feature,
       sizes:uncles_item_sizes ( size_label, display_order, price_pence, note )
     )`,
  );

  if (error || !data || data.length === 0) {
    if (error) console.warn('[uncles] menu fetch failed, using seed fallback:', error.message);
    return normalise(seed.sections as MenuSection[]);
  }

  return normalise(data as unknown as MenuSection[]);
}

export async function getSettings(): Promise<Settings> {
  const supabase = createPublicClient();
  if (!supabase) return seed.settings as Settings;

  const { data, error } = await supabase
    .from('uncles_settings')
    .select('tagline, address_line1, address_line2, postcode, phone, email, opening_hours, google_maps_url')
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn('[uncles] settings fetch failed, using seed fallback:', error.message);
    return seed.settings as Settings;
  }
  return data as unknown as Settings;
}
