import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/admin/auth';
import LoginForm from '@/components/admin/LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const admin = await getAdmin();
  if (admin) redirect('/admin');

  const devLogin = process.env.NEXT_PUBLIC_DEV_LOGIN === 'true';

  return (
    <main className="admin-login">
      <div className="login-card">
        <h1 className="login-brand">UNCLE&apos;S</h1>
        <div className="login-sub">
          <span className="login-sub-line" />
          <span>Admin</span>
          <span className="login-sub-line" />
        </div>
        <LoginForm devLogin={devLogin} />
      </div>
    </main>
  );
}
