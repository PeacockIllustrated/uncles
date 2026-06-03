import { notFound } from 'next/navigation';
import AdminTopBar from '@/components/admin/AdminTopBar';
import ItemList from '@/components/admin/ItemList';
import { requireAdmin } from '@/lib/admin/auth';
import { createClient } from '@/lib/supabase/server';
import type { AdminItem } from '@/lib/admin/types';

export const dynamic = 'force-dynamic';

interface SectionData {
  id: string;
  slug: string;
  title: string;
  items: AdminItem[];
}

export default async function SectionItemsPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const admin = await requireAdmin();
  const { section: slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from('uncles_menu_sections')
    .select(
      `id, slug, title,
       items:uncles_menu_items (
         id, slug, name, description, available, is_feature, display_order,
         sizes:uncles_item_sizes ( id, size_label, price_pence, note, display_order )
       )`,
    )
    .eq('slug', slug)
    .maybeSingle();

  const section = data as unknown as SectionData | null;
  if (!section) notFound();

  const items = (section.items ?? [])
    .slice()
    .sort((a, b) => a.display_order - b.display_order)
    .map((item) => ({
      ...item,
      sizes: (item.sizes ?? []).slice().sort((a, b) => a.display_order - b.display_order),
    }));

  const initial = (admin.displayName?.[0] ?? admin.email[0]).toUpperCase();

  return (
    <>
      <AdminTopBar title={section.title} backHref="/admin/menu" initial={initial} />
      <div className="admin-page">
        <ItemList sectionId={section.id} sectionSlug={section.slug} items={items} />
      </div>
    </>
  );
}
