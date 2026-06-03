import Link from 'next/link';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { requireAdmin } from '@/lib/admin/auth';
import { createClient } from '@/lib/supabase/server';
import { describeAudit, timeAgo } from '@/lib/admin/format';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const [{ data: lastItem }, { count: hiddenCount }, { count: activeNews }, { data: auditData }] =
    await Promise.all([
      supabase.from('uncles_menu_items').select('updated_at').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('uncles_menu_items').select('id', { count: 'exact', head: true }).eq('available', false),
      supabase.from('uncles_news').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('uncles_admin_audit').select('action, created_at').order('created_at', { ascending: false }).limit(5),
    ]);

  const lastUpdated = (lastItem as { updated_at: string } | null)?.updated_at;
  const hidden = hiddenCount ?? 0;
  const news = activeNews ?? 0;
  const recent = (auditData as { action: string; created_at: string }[] | null) ?? [];
  const name = admin.displayName || admin.email.split('@')[0];

  return (
    <>
      <AdminTopBar title="Uncle's Admin" initial={(name[0] || 'A').toUpperCase()} />
      <div className="admin-page">
        <p className="admin-hello">Hello, {name}</p>
        <p className="admin-sub">
          {hidden === 0 ? 'Your menu is all showing.' : `${hidden} item${hidden === 1 ? '' : 's'} hidden right now.`}
        </p>

        <Link href="/admin/menu" className="admin-card">
          <div className="admin-card-title">Menu</div>
          <div className="admin-card-meta">
            {lastUpdated ? `Last updated ${timeAgo(lastUpdated)}` : 'Tap to edit your menu and prices'}
          </div>
          <div className="admin-card-cta">Edit menu →</div>
        </Link>

        <Link href="/admin/news" className="admin-card">
          <div className="admin-card-title">News</div>
          <div className="admin-card-meta">
            {news === 0 ? 'No posts showing.' : `${news} post${news === 1 ? '' : 's'} showing.`}
          </div>
          <div className="admin-card-cta">Manage news →</div>
        </Link>

        <Link href="/admin/settings" className="admin-card">
          <div className="admin-card-title">Settings</div>
          <div className="admin-card-meta">Opening hours, address, contact</div>
          <div className="admin-card-cta">Open settings →</div>
        </Link>

        {recent.length > 0 ? (
          <div className="admin-recent">
            <div className="admin-recent-title">Recently changed</div>
            {recent.map((r, i) => (
              <div className="admin-recent-row" key={i}>
                <span className="admin-recent-diamond">◆</span>
                <span className="admin-recent-text">{describeAudit(r.action)}</span>
                <span className="admin-recent-time">{timeAgo(r.created_at)}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
