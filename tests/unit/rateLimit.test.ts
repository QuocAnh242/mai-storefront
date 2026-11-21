import { describe, it, expect } from 'vitest';
import { checkRateLimit, enforceRateLimit } from '@/lib/rateLimit';

describe('rateLimit', () => {
  it('allows requests within limit', () => {
    const id = `test_user_${Date.now()}`;
    const res1 = checkRateLimit(id, 3, 10);
    expect(res1.allowed).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = checkRateLimit(id, 3, 10);
    expect(res2.allowed).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = checkRateLimit(id, 3, 10);
    expect(res3.allowed).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it('rejects requests exceeding limit and provides resetSeconds', () => {
    const id = `test_limit_${Date.now()}`;
    checkRateLimit(id, 2, 5);
    checkRateLimit(id, 2, 5);

    const blocked = checkRateLimit(id, 2, 5);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetSeconds).toBeGreaterThanOrEqual(1);
  });

  it('enforceRateLimit falls back to in-memory check when Redis is unconfigured', async () => {
    const id = `test_async_${Date.now()}`;
    const res = await enforceRateLimit(id, 5, 60);
    expect(res.allowed).toBe(true);
    expect(res.remaining).toBe(4);
  });
});
