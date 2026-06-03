import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import AdminTopBar from '@/components/admin/AdminTopBar';
import Toggle from '@/components/admin/Toggle';
import { requireAdmin } from '@/lib/admin/auth';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

interface SectionRow {
  id: string;
  slug: string;
  title: string;
  visible: boolean;
  items: { count: number }[];
}

export default async function MenuSectionsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from('uncles_menu_sections')
    .select('id, slug, title, visible, display_order, items:uncles_menu_items(count)')
    .order('display_order');

  const sections = (data as unknown as SectionRow[] | null) ?? [];

  return (
    <>
      <AdminTopBar title="Menu" backHref="/admin" />
      <div className="admin-page">
        <p className="admin-hint">Tap a section to edit its items and prices.</p>

        {sections.length === 0 ? (
          <p className="admin-empty">No menu yet. Add your first section.</p>
        ) : (
          <div className="section-list">
            {sections.map((s) => (
              <div className="section-row" key={s.id}>
                <Link href={`/admin/menu/${s.slug}`} className="section-row-main">
                  <span className="section-row-title">{s.title}</span>
                  <span className="section-row-count">{s.items?.[0]?.count ?? 0} items</span>
                </Link>
                <div className="section-row-side">
                  <Toggle id={s.id} on={s.visible} kind="section" />
                  <Link href={`/admin/menu/${s.slug}`} className="section-row-arrow" aria-label="Open section">
                    <ChevronRight size={18} strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
