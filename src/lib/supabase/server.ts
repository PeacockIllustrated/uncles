import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

type CookieToSet = { name: string; value: string; options?: Record<string, unknown> };

// Cookie-bound server client. Carries the signed-in admin's session, so writes
// run under their identity and RLS (uncles_is_admin) enforces access.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set({ name, value, ...(options as object) }),
            );
          } catch {
            // Called from a Server Component — the middleware refreshes the
            // session cookie instead, so this is safe to ignore.
          }
        },
      },
    },
  );
}
