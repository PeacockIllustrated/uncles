import { createBrowserClient } from '@supabase/ssr';

// Browser client for the login form. Stores the session in cookies (via
// @supabase/ssr) so the server can read it on the next request.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
