import AdminTopBar from '@/components/admin/AdminTopBar';
import NewsManager from '@/components/admin/NewsManager';
import { requireAdmin } from '@/lib/admin/auth';
import { createClient } from '@/lib/supabase/server';
import type { AdminNews } from '@/lib/admin/types';

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from('uncles_news')
    .select('id, title, body, published, starts_at, ends_at')
    .order('created_at', { ascending: false });

  const news = (data as unknown as AdminNews[] | null) ?? [];

  return (
    <>
      <AdminTopBar title="News" backHref="/admin" />
      <div className="admin-page">
        <p className="admin-hint">Post a short notice for customers, like a closure or a special.</p>
        <NewsManager news={news} />
      </div>
    </>
  );
}
