import { describe, it, expect } from 'vitest';
import { verifyAdminTokenLocally } from '@/lib/jwtVerify';

describe('jwtVerify (local JWKS verification)', () => {
  it('returns null when token is empty or undefined', async () => {
    expect(await verifyAdminTokenLocally('')).toBeNull();
    // @ts-expect-error test undefined
    expect(await verifyAdminTokenLocally(undefined)).toBeNull();
  });

  it('returns null for malformed or invalid JWT tokens', async () => {
    expect(await verifyAdminTokenLocally('not.a.valid.jwt')).toBeNull();
    expect(await verifyAdminTokenLocally('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.bad')).toBeNull();
  });
});
