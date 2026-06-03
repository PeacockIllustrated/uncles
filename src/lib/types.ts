// Domain types for the Uncle's customer site.
// Mirror the Supabase schema in docs/data-schema.md so the data layer can swap
// from seed JSON (Phase 1) to live Supabase queries (Phase 2) without churn.

export interface Size {
  size_label: string | null;
  display_order: number;
  price_pence: number;
  // Optional UI annotation: Dolce filling description, dessert size (e.g. "15 cm").
  note?: string | null;
}

export interface MenuItem {
  slug: string;
  name: string;
  description: string | null;
  display_order: number;
  available: boolean;
  is_feature: boolean;
  sizes: Size[];
}

export interface MenuSection {
  slug: string;
  title: string;
  tagline: string | null;
  display_order: number;
  visible: boolean;
  layout_hint: 'list' | 'grid' | 'feature';
  items: MenuItem[];
}

export interface Settings {
  tagline: string | null;
  address_line1: string | null;
  address_line2: string | null;
  postcode: string | null;
  phone: string | null;
  email: string | null;
  opening_hours: unknown;
  google_maps_url: string | null;
}
