import { describe, it, expect } from 'vitest';
import { generateEntityId, generateOrderCode, extractPayOSOrderNumber } from '@/lib/ids';

describe('ids generation', () => {
  it('generates prefixed entity id with valid uuid', () => {
    const prodId = generateEntityId('prod');
    expect(prodId.startsWith('prod_')).toBe(true);

    const rawUuid = prodId.replace('prod_', '');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(rawUuid).toMatch(uuidRegex);
  });

  it('generates unique entity ids with no collisions across iterations', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(generateEntityId());
    }
    expect(ids.size).toBe(100);
  });

  it('generates order codes starting with MKT and sufficient entropy', () => {
    const orderCode = generateOrderCode();
    expect(orderCode.startsWith('MKT')).toBe(true);
    expect(orderCode.length).toBeGreaterThanOrEqual(12);
  });

  it('extractPayOSOrderNumber produces a consistent numeric id for the same order code', () => {
    const code = 'MKT123ABCDEF';
    const num1 = extractPayOSOrderNumber(code);
    const num2 = extractPayOSOrderNumber(code);

    expect(num1).toBe(num2);
    expect(typeof num1).toBe('number');
    expect(num1).toBeGreaterThan(0);
    expect(num1).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
  });
});
