import { createRemoteJWKSet, jwtVerify, JWTVerifyResult } from 'jose';

/**
 * Local JWT verification against the Supabase Auth JWKS.
 *
 * Verifying the token signature + expiration locally avoids a network
 * roundtrip to supabase.auth.getUser() on every request (proxy + API routes).
 * The JWKS is cached in-process by `jose` and re-fetched only on key rotation.
 */

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks(): ReturnType<typeof createRemoteJWKSet> {
  if (jwks) return jwks;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  jwks = createRemoteJWKSet(new URL(`${url}/auth/v1/.well-known/jwks.json`), {
    cooldownDuration: 300_000, // 5 min between fetches for unknown keys
    cacheMaxAge: 600_000,      // 10 min cache of the JWKS itself
  });
  return jwks;
}

export interface VerifiedAdminToken {
  userId: string;
  email?: string;
  role?: string;
}

function isJwksAvailable(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  return url.startsWith('https://');
}

/**
 * Verify a Supabase Auth access token locally (signature + exp + issuer).
 * Returns null when the token is invalid, expired, or cannot be verified.
 *
 * Note: Supabase legacy JWTs are signed with the project's JWKS (ES256);
 * legacy tokens signed with the HS256 secret are not supported here —
 * callers fall back to the network path for those.
 */
export async function verifyAdminTokenLocally(token: string): Promise<VerifiedAdminToken | null> {
  if (!isJwksAvailable() || !token) return null;

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const { payload } = await jwtVerify(token, getJwks(), {
      issuer: `${url}/auth/v1`,
      // Supabase access tokens carry aud: 'authenticated' (legacy) or an array containing it
      audience: 'authenticated',
      clockTolerance: 5,
    });

    const userId = typeof payload.sub === 'string' ? payload.sub : null;
    if (!userId) return null;

    return {
      userId,
      email: typeof payload.email === 'string' ? payload.email : undefined,
      role: payload.role ? String(payload.role) : undefined,
    };
  } catch {
    // Invalid signature, expired, malformed — treat as unverified; caller falls
    // back to refresh/network verification before rejecting.
    return null;
  }
}

export type { JWTVerifyResult };
