import { describe, it, expect } from 'vitest';
import {
  DEFAULT_PRODUCT_IMAGE,
  formatDateVN,
  formatVND,
  getDiscountPercent,
  getSafeImageUrl,
  isContactProduct,
} from '@/lib/format';

describe('format utilities', () => {
  describe('isContactProduct', () => {
    it('returns true when isContactPrice is true or price <= 1', () => {
      expect(isContactProduct({ price: 0 })).toBe(true);
      expect(isContactProduct({ price: 1 })).toBe(true);
      expect(isContactProduct({ price: 50000, isContactPrice: true })).toBe(true);
    });

    it('returns false when price > 1 and isContactPrice is falsy', () => {
      expect(isContactProduct({ price: 25000 })).toBe(false);
      expect(isContactProduct({ price: 25000, isContactPrice: false })).toBe(false);
    });
  });

  describe('formatVND', () => {
    it('formats VND currency consistently', () => {
      const formatted = formatVND(150000);
      expect(formatted).toContain('150.000');
      expect(formatted).toContain('₫');
    });

    it('falls back to 0 for NaN values', () => {
      expect(formatVND(Number.NaN)).toContain('0');
    });
  });

  describe('getDiscountPercent', () => {
    it('computes rounded discount percentage when originalPrice > price', () => {
      expect(getDiscountPercent(150000, 200000)).toBe(25);
    });

    it('returns 0 for contact price or non-discounted items', () => {
      expect(getDiscountPercent(0, 200000)).toBe(0);
      expect(getDiscountPercent(100000, 200000, true)).toBe(0);
      expect(getDiscountPercent(200000, 150000)).toBe(0);
      expect(getDiscountPercent(100000)).toBe(0);
    });
  });

  describe('formatDateVN', () => {
    it('formats ISO date with and without time', () => {
      const dateStr = '2026-05-09T07:05:00.000Z';
      expect(formatDateVN(dateStr, false)).toMatch(/^\d{2}\/\d{2}\/2026$/);
      expect(formatDateVN(dateStr, true)).toMatch(/^\d{2}\/\d{2}\/2026 \d{2}:\d{2}$/);
    });

    it('handles empty and invalid inputs gracefully', () => {
      expect(formatDateVN('')).toBe('');
      expect(formatDateVN('invalid-date')).toBe('invalid-date');
    });
  });

  describe('getSafeImageUrl', () => {
    it('returns fallback image for null/empty/whitespace URLs', () => {
      expect(getSafeImageUrl(null)).toBe(DEFAULT_PRODUCT_IMAGE);
      expect(getSafeImageUrl(undefined)).toBe(DEFAULT_PRODUCT_IMAGE);
      expect(getSafeImageUrl('   ')).toBe(DEFAULT_PRODUCT_IMAGE);
    });

    it('preserves valid image URLs', () => {
      expect(getSafeImageUrl('/hero.jpg')).toBe('/hero.jpg');
    });
  });
});
