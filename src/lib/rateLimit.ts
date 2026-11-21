import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
}

// ── In-memory fallback (single instance / local dev) ─────────────────────────

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < 3600 * 1000);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}

export function checkRateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  let record = rateLimitStore.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(identifier, record);
  }

  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const resetSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.max(resetSeconds, 1),
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: limit - record.timestamps.length,
    resetSeconds: windowSeconds,
  };
}

// ── Upstash Redis rate limiter (serverless-safe, shared across instances) ───

// Cache one client per (limit, window) combination — Upstash requires the
// window at construction time, so we build a small memoized set of limiters.
const limiterCache = new Map<string, Ratelimit>();

function getLimiterFor(limit: number, windowSeconds: number): Ratelimit {
  const cacheKey = `${limit}:${windowSeconds}`;
  const cached = limiterCache.get(cacheKey);
  if (cached) return cached;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const redis = new Redis({ url: url!, token: token! });

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
    prefix: `ratelimit:${cacheKey}`,
    timeout: 1000,
  });
  limiterCache.set(cacheKey, limiter);
  return limiter;
}

/**
 * Unified async rate limiting check.
 *
 * Uses Upstash Redis (shared across serverless instances) when configured via
 * UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN; otherwise falls back to
 * the in-memory limiter. On Redis errors the request is ALLOWED (fail-open) —
 * rate limiting is a protection layer, not an availability dependency.
 */
export async function enforceRateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      const limiter = getLimiterFor(limit, windowSeconds);
      const result = await limiter.limit(identifier);
      return {
        allowed: result.success,
        remaining: result.remaining,
        resetSeconds: Math.max(Math.ceil((result.reset - Date.now()) / 1000), 1),
      };
    } catch (err) {
      console.warn('Redis rate limit check failed — allowing request (fail-open):', err);
      return checkRateLimit(identifier, limit, windowSeconds);
    }
  }

  return checkRateLimit(identifier, limit, windowSeconds);
}
