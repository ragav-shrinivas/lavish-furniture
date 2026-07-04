import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client (service role).
 *
 * All Lavish data access happens in server components / API routes, so the
 * service-role key never reaches the browser. If the env vars aren't set the
 * factory returns null and every data helper falls back to code defaults —
 * the site renders identically to its pre-Supabase state, so nothing breaks
 * before the keys are configured.
 *
 * Required env vars (set in .env.local and in Vercel → Settings → Env Vars):
 *   SUPABASE_URL                 e.g. https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY    Settings → API → service_role secret
 */

export const STORAGE_BUCKET = 'lavish-media';

let cached: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  cached = url && key
    ? createClient(url, key, { auth: { persistSession: false } })
    : null;

  return cached;
}

export function isSupabaseConfigured(): boolean {
  return getSupabase() !== null;
}
