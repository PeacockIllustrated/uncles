import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Anon, read-only client for public customer-facing data. No session/cookies.
// RLS exposes only visible sections, available items, sizes, settings, and
// published news. Returns null if env is not configured, so callers can fall
// back to the bundled seed data instead of crashing.
export function createPublicClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
