import AdminTopBar from '@/components/admin/AdminTopBar';
import SettingsForm from '@/components/admin/SettingsForm';
import { requireAdmin } from '@/lib/admin/auth';
import { getSettings } from '@/lib/menu';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getSettings();

  return (
    <>
      <AdminTopBar title="Settings" backHref="/admin" />
      <div className="admin-page">
        <SettingsForm settings={settings} />
      </div>
    </>
  );
}
