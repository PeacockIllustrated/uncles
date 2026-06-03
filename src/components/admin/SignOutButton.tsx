'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/browser';

export default function SignOutButton() {
  const router = useRouter();
  const signOut = async () => {
    await createClient().auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };
  return (
    <button type="button" className="admin-signout" onClick={signOut} aria-label="Sign out">
      <LogOut size={16} strokeWidth={1.5} />
    </button>
  );
}
