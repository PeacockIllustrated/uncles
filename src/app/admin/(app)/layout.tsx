import { requireAdmin } from '@/lib/admin/auth';
import { ToastProvider } from '@/components/admin/Toast';

export const dynamic = 'force-dynamic';

// Guards every page in this group. Signed-out users are bounced to login,
// signed-in non-admins to the public site (handled in requireAdmin).
export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <ToastProvider>
      <div className="admin-shell">{children}</div>
    </ToastProvider>
  );
}
