import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { verifyPayOSSignature } from '@/lib/payosSignature';

describe('verifyPayOSSignature', () => {
  const checksumKey = 'test_checksum_key_secret_12345';

  function createValidSignature(data: Record<string, any>, key: string): string {
    const sortedKeys = Object.keys(data).sort();
    const dataStr = sortedKeys.map((k) => `${k}=${data[k] ?? ''}`).join('&');
    return crypto.createHmac('sha256', key).update(dataStr).digest('hex');
  }

  it('validates genuine PayOS HMAC SHA256 signature', () => {
    const data = {
      orderCode: 123456,
      amount: 50000,
      description: 'Thanh toan don hang',
    };
    const signature = createValidSignature(data, checksumKey);

    expect(verifyPayOSSignature(data, signature, checksumKey)).toBe(true);
  });

  it('rejects tampered amount or data payload', () => {
    const data = {
      orderCode: 123456,
      amount: 50000,
      description: 'Thanh toan',
    };
    const signature = createValidSignature(data, checksumKey);

    // Attacker modifies amount to 5000
    const tamperedData = { ...data, amount: 5000 };
    expect(verifyPayOSSignature(tamperedData, signature, checksumKey)).toBe(false);
  });

  it('validates regardless of incoming key ordering in the object', () => {
    const dataUnsorted = {
      z_field: 'end',
      amount: 200000,
      a_field: 'start',
      orderCode: 9999,
    };
    const signature = createValidSignature(dataUnsorted, checksumKey);

    expect(verifyPayOSSignature(dataUnsorted, signature, checksumKey)).toBe(true);
  });

  it('rejects when signature or checksumKey is missing/empty', () => {
    const data = { orderCode: 123, amount: 1000 };
    expect(verifyPayOSSignature(data, '', checksumKey)).toBe(false);
    expect(verifyPayOSSignature(data, 'some_sig', '')).toBe(false);
  });

  it('rejects wrong checksumKey', () => {
    const data = { orderCode: 123, amount: 1000 };
    const signature = createValidSignature(data, checksumKey);
    expect(verifyPayOSSignature(data, signature, 'wrong_key')).toBe(false);
  });
});
