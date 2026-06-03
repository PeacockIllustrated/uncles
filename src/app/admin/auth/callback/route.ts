import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Magic-link landing. Exchanges the one-time code for a session cookie, then
// forwards to the admin home (or wherever `next` points).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/admin';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/admin/login?error=link`);
}
