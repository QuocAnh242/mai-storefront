import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Validate if URL is a valid http/https URL
const isValidUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://');

const supabaseUrl = isValidUrl ? rawUrl : 'https://placeholder-supabase.supabase.co';
const supabaseAnonKey = rawKey || 'placeholder-anon-key';

// Client with public ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Client with SERVICE_ROLE_KEY (for Supabase Auth Admin API: listUsers, createUser, etc.)
export const supabaseAdmin = (isValidUrl && Boolean(rawServiceKey))
  ? createClient(supabaseUrl, rawServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export function isSupabaseConfigured(): boolean {
  return (
    isValidUrl &&
    Boolean(rawKey) &&
    supabaseUrl !== 'https://placeholder-supabase.supabase.co'
  );
}

export function isSupabaseAdminConfigured(): boolean {
  return isValidUrl && Boolean(rawServiceKey);
}
