import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export interface AdminContext {
  userId: string;
  email: string;
  displayName: string | null;
}

// Returns the admin context if the current session belongs to a user listed in
// uncles_admin_users, otherwise null. The self-read RLS policy lets a signed-in
// user read their own admin row (and no one else's).
export async function getAdmin(): Promise<AdminContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('uncles_admin_users')
    .select('user_id, email, display_name')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!data) return null;
  return { userId: data.user_id, email: data.email, displayName: data.display_name };
}

// Guard for admin pages: send signed-out users to login, signed-in non-admins
// back to the public site with a friendly notice.
export async function requireAdmin(): Promise<AdminContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const ctx = await getAdmin();
  if (!ctx) redirect('/?notice=no-access');
  return ctx;
}
