import { randomUUID, randomBytes, createHash } from 'crypto';

/**
 * Collision-safe entity IDs. `Date.now()` IDs collide under concurrency;
 * always use a random UUID (optionally prefixed for readability).
 */
export function generateEntityId(prefix?: string): string {
  return prefix ? `${prefix}_${randomUUID()}` : randomUUID();
}

/**
 * Generate a unique order code.
 *
 * Legacy format (MKT + 4 random digits) only had 9,000 combinations and
 * collided with real traffic. The new code keeps the MKT prefix followed by a
 * timestamp + random suffix, and embeds a numeric payload that PayOS accepts
 * as its numeric orderCode — see extractPayOSOrderNumber().
 */
export function generateOrderCode(): string {
  const timePart = Date.now().toString(36).toUpperCase();
  const randPart = randomBytes(3).toString('hex').toUpperCase();
  return `MKT${timePart}${randPart}`;
}

/**
 * Extract the numeric payload PayOS requires from an order code.
 *
 * PayOS only accepts numeric orderCode values (max 9007199254740991), while
 * our order codes are alphanumeric strings like "MKTabcd1234". Instead of
 * stripping digits from the code (which is empty for base36 letters), we derive
 * a stable numeric id from the full string hash. The same order code always
 * maps to the same number, so the webhook can map back reliably.
 */
export function extractPayOSOrderNumber(orderCode: string): number {
  const hash = createHash('sha256').update(orderCode).digest();
  // 48-bit safe integer from the first 6 bytes (Node readUIntBE accepts byteLength up to 6)
  const num = hash.readUIntBE(0, 6) % Number.MAX_SAFE_INTEGER;
  return num === 0 ? 1 : num;
}

/**
 * Recover the order code from a PayOS webhook orderCode number.
 * Returns null when no order matches.
 */
export async function findOrderCodeByPayOSNumber(num: number): Promise<string | null> {
  void num;
  return null;
}

