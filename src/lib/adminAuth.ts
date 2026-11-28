import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { verifyAdminTokenLocally } from '@/lib/jwtVerify';

export interface AdminAuthResult {
  authorized: boolean;
  newSession?: {
    access_token: string;
    refresh_token: string;
    expires_in?: number;
  };
}

/**
 * Admin session verification:
 * 1. Verify the JWT locally against the Supabase JWKS (no network roundtrip
 *    on the hot path — signature + expiration checked in-process).
 * 2. Fall back to `supabase.auth.getUser` when local verification is
 *    inconclusive (legacy HS256 tokens, key rotation mid-flight).
 * 3. Auto-refresh the session with the refresh token if the access token is expired.
 *
 * The `mkt_admin_logged_in` cookie fallback was removed (P1.2): an unsigned boolean
 * cookie cannot be revoked or tied to a user.
 */
export async function verifyAdminAuth(req: NextRequest): Promise<AdminAuthResult> {
  const accessToken = req.cookies.get('sb-access-token')?.value;
  const refreshToken = req.cookies.get('sb-refresh-token')?.value;

  // Support Authorization: Bearer <token> from client fetch
  const authHeader = req.headers.get('authorization');
  let bearerToken: string | undefined = undefined;
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    bearerToken = authHeader.substring(7).trim();
  }

  const tokenToVerify = accessToken || bearerToken;

  if (!isSupabaseConfigured()) {
    return { authorized: true };
  }

  // 1. Fast path: local JWT verification (no network)
  if (tokenToVerify) {
    const local = await verifyAdminTokenLocally(tokenToVerify);
    if (local) {
      return { authorized: true };
    }
  }

  // 2. Network fallback for tokens the local verifier cannot confirm
  //    (e.g. legacy signing keys) — still a valid user check via Supabase Auth.
  if (tokenToVerify) {
    try {
      const { data, error } = await supabase.auth.getUser(tokenToVerify);
      if (!error && data?.user) {
        return { authorized: true };
      }
    } catch (err) {
      console.warn('Verify admin token note:', err);
    }
  }

  // 3. Auto-refresh the session if the access token is missing or expired
  if (refreshToken) {
    try {
      const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
      if (!error && data?.session) {
        return {
          authorized: true,
          newSession: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_in: data.session.expires_in,
          },
        };
      }
    } catch (refreshErr) {
      console.warn('Verify admin refresh session note:', refreshErr);
    }
  }

  return { authorized: false };
}

/**
 * Apply refreshed session cookies to a NextResponse when available
 */
export function applySessionCookies(response: NextResponse, newSession?: AdminAuthResult['newSession']): NextResponse {
  if (newSession) {
    response.cookies.set('sb-access-token', newSession.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: newSession.expires_in || 86400,
    });
    response.cookies.set('sb-refresh-token', newSession.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 86400,
    });
  }
  return response;
}
