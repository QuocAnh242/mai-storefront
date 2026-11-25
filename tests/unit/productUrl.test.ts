import { describe, it, expect } from 'vitest';
import { getProductUrl, findProductBySlugOrId } from '@/lib/productUrl';
import { Product } from '@/shared/types';

function makeProduct(overrides: Partial<Product>): Product {
  return {
    id: 'p-1',
    title: 'Test Product',
    slug: 'test-product',
    price: 100000,
    unit: 'Kg',
    description: '',
    categoryId: 'cat-bot-mau',
    categoryName: 'Bột Màu',
    images: [],
    isFeatured: false,
    displayOrder: 1,
    inStock: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('productUrl utilities', () => {
  describe('getProductUrl', () => {
    it('keeps legacy numeric URLs for p-1 and timestamp IDs', () => {
      expect(
        getProductUrl({ id: 'p-1', slug: 'bot-mau-ba-bien', categoryId: 'cat-bot-mau' }),
      ).toBe('/products/bot-mau/1');

      expect(
        getProductUrl({ id: 'p-1791147443218', slug: 'bang-keo-giay', categoryId: 'cat-bang-keo' }),
      ).toBe('/products/bang-keo/1791147443218');
    });

    it('uses slug (never truncated UUID digits) for UUID-based product IDs', () => {
      const url = getProductUrl({
        id: 'p_47bf4dfe-7854-4c49-88f9-f01faad2c87b',
        slug: 'mua-3-kg-tang-1-kg',
        categoryId: 'cat_571b6977-8f0d-4291-9c12-75a113ce3ffa',
        categoryName: 'Khuyến Mãi Sản Phẩm 2026',
      });
      expect(url).toBe('/products/khuyen-mai-san-pham-2026/mua-3-kg-tang-1-kg');
    });

    it('falls back to full UUID ID when slug is omitted', () => {
      const url = getProductUrl({
        id: 'p_8c2a29aa-aaa5-452e-89ff-f007fc940c42',
        categoryId: 'cat-camay',
      });
      expect(url).toBe('/products/camay/p_8c2a29aa-aaa5-452e-89ff-f007fc940c42');
    });
  });

  describe('findProductBySlugOrId', () => {
    const legacy = makeProduct({ id: 'p-47', slug: 'bot-legacy-47' });
    const uuidProd = makeProduct({
      id: 'p_47bf4dfe-7854-4c49-88f9-f01faad2c87b',
      slug: 'mua-3-kg-tang-1-kg',
      categoryId: 'cat_571b6977-8f0d-4291-9c12-75a113ce3ffa',
    });

    it('matches UUID products by slug or full ID without colliding on leading UUID digits', () => {
      expect(findProductBySlugOrId([uuidProd], ['khuyen-mai-san-pham-2026', 'mua-3-kg-tang-1-kg'])?.id).toBe(
        uuidProd.id,
      );
      expect(findProductBySlugOrId([uuidProd], uuidProd.id)?.id).toBe(uuidProd.id);
      // Partial digits extracted from UUID must NOT hijack legacy numeric lookup
      expect(findProductBySlugOrId([uuidProd, legacy], ['bot-mau', '47'])?.id).toBe('p-47');
    });
  });
});
