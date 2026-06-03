// Shapes the admin UI passes from server pages to client components.

// Result of a Server Action. Kept here (not in the 'use server' module) so the
// actions file only exports async functions.
export type ActionResult<T = unknown> = ({ ok: true } & T) | { ok: false; error: string };

export interface AdminSize {
  id: string;
  size_label: string | null;
  price_pence: number;
  note: string | null;
  display_order: number;
}

export interface AdminItem {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  available: boolean;
  is_feature: boolean;
  display_order: number;
  sizes: AdminSize[];
}

export interface AdminSection {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  visible: boolean;
  display_order: number;
  item_count: number;
}

export interface AdminNews {
  id: string;
  title: string;
  body: string | null;
  published: boolean;
  starts_at: string | null;
  ends_at: string | null;
}
