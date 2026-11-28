import crypto from 'crypto';

/**
 * PayOS webhook signature verification (HMAC SHA256 over sorted key=value pairs).
 */
export function verifyPayOSSignature(
  data: Record<string, unknown>,
  signature: string,
  checksumKey: string,
): boolean {
  if (!signature || !checksumKey) return false;

  const sortedKeys = Object.keys(data).sort();
  const dataStr = sortedKeys.map((key) => `${key}=${data[key] ?? ''}`).join('&');

  const computedSignature = crypto
    .createHmac('sha256', checksumKey)
    .update(dataStr)
    .digest('hex');

  return computedSignature === signature;
}
