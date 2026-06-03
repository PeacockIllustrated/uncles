'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getAdmin } from './auth';
import type { ActionResult } from './types';

type Supa = Awaited<ReturnType<typeof createClient>>;

// Best-effort audit entry. A failed audit write never blocks the real change.
async function logAudit(
  supabase: Supa,
  userId: string,
  action: string,
  entityType: string,
  entityId: string | null,
  before: unknown,
  after: unknown,
) {
  await supabase.from('uncles_admin_audit').insert({
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    before_state: before ?? null,
    after_state: after ?? null,
  });
}

function refresh() {
  // Customer site is force-dynamic, but revalidate keeps any cached views fresh.
  revalidatePath('/');
  revalidatePath('/admin', 'layout');
}

// ---- Prices --------------------------------------------------------------

export async function updatePrice(sizeId: string, pricePence: number): Promise<ActionResult> {
  const ctx = await getAdmin();
  if (!ctx) return { ok: false, error: 'Please sign in again' };
  if (!Number.isInteger(pricePence) || pricePence < 0 || pricePence > 100000) {
    return { ok: false, error: 'That price does not look right' };
  }

  const supabase = await createClient();
  const { data: before } = await supabase
    .from('uncles_item_sizes')
    .select('*')
    .eq('id', sizeId)
    .single();

  const { error } = await supabase
    .from('uncles_item_sizes')
    .update({ price_pence: pricePence })
    .eq('id', sizeId);
  if (error) return { ok: false, error: 'Could not save the price' };

  await logAudit(supabase, ctx.userId, 'update_price', 'item_size', sizeId, before, {
    ...before,
    price_pence: pricePence,
  });
  refresh();
  return { ok: true };
}

// ---- Availability / visibility ------------------------------------------

export async function setItemAvailable(itemId: string, available: boolean): Promise<ActionResult> {
  const ctx = await getAdmin();
  if (!ctx) return { ok: false, error: 'Please sign in again' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('uncles_menu_items')
    .update({ available })
    .eq('id', itemId);
  if (error) return { ok: false, error: 'Could not update the item' };

  await logAudit(supabase, ctx.userId, available ? 'show_item' : 'hide_item', 'menu_item', itemId, null, {
    available,
  });
  refresh();
  return { ok: true };
}

export async function setSectionVisible(sectionId: string, visible: boolean): Promise<ActionResult> {
  const ctx = await getAdmin();
  if (!ctx) return { ok: false, error: 'Please sign in again' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('uncles_menu_sections')
    .update({ visible })
    .eq('id', sectionId);
  if (error) return { ok: false, error: 'Could not update the section' };

  await logAudit(supabase, ctx.userId, visible ? 'show_section' : 'hide_section', 'menu_section', sectionId, null, { visible });
  refresh();
  return { ok: true };
}

// ---- Item text -----------------------------------------------------------

export async function updateItemText(
  itemId: string,
  fields: { name?: string; description?: string | null },
): Promise<ActionResult> {
  const ctx = await getAdmin();
  if (!ctx) return { ok: false, error: 'Please sign in again' };
  if (fields.name !== undefined && fields.name.trim() === '') {
    return { ok: false, error: 'Name cannot be empty' };
  }

  const supabase = await createClient();
  const patch: Record<string, unknown> = {};
  if (fields.name !== undefined) patch.name = fields.name.trim();
  if (fields.description !== undefined) {
    patch.description = fields.description?.trim() ? fields.description.trim() : null;
  }

  const { error } = await supabase.from('uncles_menu_items').update(patch).eq('id', itemId);
  if (error) return { ok: false, error: 'Could not save your change' };

  await logAudit(supabase, ctx.userId, 'edit_item', 'menu_item', itemId, null, patch);
  refresh();
  return { ok: true };
}

// ---- Add / remove items --------------------------------------------------

export async function addItem(
  sectionId: string,
  input: { name: string; description?: string | null; sizes: { label: string | null; pricePence: number }[] },
): Promise<ActionResult<{ id: string }>> {
  const ctx = await getAdmin();
  if (!ctx) return { ok: false, error: 'Please sign in again' };
  if (!input.name.trim()) return { ok: false, error: 'Give the item a name' };
  if (input.sizes.length === 0) return { ok: false, error: 'Add at least one price' };

  const supabase = await createClient();
  const slug =
    input.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ||
    `item-${Date.now()}`;

  const { data: last } = await supabase
    .from('uncles_menu_items')
    .select('display_order')
    .eq('section_id', sectionId)
    .order('display_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (last?.display_order ?? 0) + 10;

  const { data: item, error } = await supabase
    .from('uncles_menu_items')
    .insert({ section_id: sectionId, slug, name: input.name.trim(), description: input.description?.trim() || null, display_order: nextOrder })
    .select('id')
    .single();
  if (error || !item) return { ok: false, error: 'Could not add the item' };

  const sizeRows = input.sizes.map((s, i) => ({
    item_id: item.id,
    size_label: s.label,
    display_order: (i + 1) * 10,
    price_pence: s.pricePence,
  }));
  const { error: sizeErr } = await supabase.from('uncles_item_sizes').insert(sizeRows);
  if (sizeErr) return { ok: false, error: 'Item added but prices failed, please check' };

  await logAudit(supabase, ctx.userId, 'add_item', 'menu_item', item.id, null, { name: input.name });
  refresh();
  return { ok: true, id: item.id };
}

export async function deleteItem(itemId: string): Promise<ActionResult> {
  const ctx = await getAdmin();
  if (!ctx) return { ok: false, error: 'Please sign in again' };

  const supabase = await createClient();
  const { data: before } = await supabase.from('uncles_menu_items').select('*').eq('id', itemId).single();
  const { error } = await supabase.from('uncles_menu_items').delete().eq('id', itemId);
  if (error) return { ok: false, error: 'Could not remove the item' };

  await logAudit(supabase, ctx.userId, 'delete_item', 'menu_item', itemId, before, null);
  refresh();
  return { ok: true };
}

// ---- News ----------------------------------------------------------------

export async function saveNews(input: {
  id?: string;
  title: string;
  body: string | null;
  published: boolean;
  startsAt: string | null;
  endsAt: string | null;
}): Promise<ActionResult<{ id: string }>> {
  const ctx = await getAdmin();
  if (!ctx) return { ok: false, error: 'Please sign in again' };
  if (!input.title.trim()) return { ok: false, error: 'Give the post a title' };

  const supabase = await createClient();
  const row = {
    title: input.title.trim(),
    body: input.body?.trim() || null,
    published: input.published,
    starts_at: input.startsAt || null,
    ends_at: input.endsAt || null,
  };

  if (input.id) {
    const { error } = await supabase.from('uncles_news').update(row).eq('id', input.id);
    if (error) return { ok: false, error: 'Could not save the post' };
    await logAudit(supabase, ctx.userId, 'edit_news', 'news', input.id, null, row);
    refresh();
    return { ok: true, id: input.id };
  }

  const { data, error } = await supabase.from('uncles_news').insert(row).select('id').single();
  if (error || !data) return { ok: false, error: 'Could not create the post' };
  await logAudit(supabase, ctx.userId, 'create_news', 'news', data.id, null, row);
  refresh();
  return { ok: true, id: data.id };
}

export async function setNewsPublished(id: string, published: boolean): Promise<ActionResult> {
  const ctx = await getAdmin();
  if (!ctx) return { ok: false, error: 'Please sign in again' };

  const supabase = await createClient();
  const { error } = await supabase.from('uncles_news').update({ published }).eq('id', id);
  if (error) return { ok: false, error: 'Could not update the post' };
  await logAudit(supabase, ctx.userId, published ? 'publish_news' : 'unpublish_news', 'news', id, null, { published });
  refresh();
  return { ok: true };
}

export async function deleteNews(id: string): Promise<ActionResult> {
  const ctx = await getAdmin();
  if (!ctx) return { ok: false, error: 'Please sign in again' };

  const supabase = await createClient();
  const { data: before } = await supabase.from('uncles_news').select('*').eq('id', id).single();
  const { error } = await supabase.from('uncles_news').delete().eq('id', id);
  if (error) return { ok: false, error: 'Could not remove the post' };
  await logAudit(supabase, ctx.userId, 'delete_news', 'news', id, before, null);
  refresh();
  return { ok: true };
}

// ---- Settings ------------------------------------------------------------

export async function saveSettings(input: {
  tagline: string | null;
  address_line1: string | null;
  address_line2: string | null;
  postcode: string | null;
  phone: string | null;
  email: string | null;
  google_maps_url: string | null;
  opening_hours: Record<string, string> | null;
}): Promise<ActionResult> {
  const ctx = await getAdmin();
  if (!ctx) return { ok: false, error: 'Please sign in again' };

  const supabase = await createClient();
  const { data: existing } = await supabase.from('uncles_settings').select('id').limit(1).maybeSingle();

  const row = {
    tagline: input.tagline?.trim() || null,
    address_line1: input.address_line1?.trim() || null,
    address_line2: input.address_line2?.trim() || null,
    postcode: input.postcode?.trim() || null,
    phone: input.phone?.trim() || null,
    email: input.email?.trim() || null,
    google_maps_url: input.google_maps_url?.trim() || null,
    opening_hours: input.opening_hours,
  };

  const { error } = existing
    ? await supabase.from('uncles_settings').update(row).eq('id', existing.id)
    : await supabase.from('uncles_settings').insert(row);
  if (error) return { ok: false, error: 'Could not save settings' };

  await logAudit(supabase, ctx.userId, 'update_settings', 'settings', existing?.id ?? null, null, row);
  refresh();
  return { ok: true };
}
