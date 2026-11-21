import { describe, it, expect } from 'vitest';
import { getCategories, getCategoryBySlug } from '@/lib/queries/categories';
import { getProducts, getFeaturedProducts, getProductBySlug, getRelatedProducts } from '@/lib/queries/products';
import { getBlogs, getBlogBySlug } from '@/lib/queries/blogs';

describe('Server Queries Layer', () => {
  describe('Categories Queries', () => {
    it('returns categories array safely', async () => {
      const categories = await getCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
      expect(categories[0]).toHaveProperty('id');
      expect(categories[0]).toHaveProperty('name');
      expect(categories[0]).toHaveProperty('slug');
    });

    it('returns category by slug or null if not found', async () => {
      const all = await getCategories();
      const first = all[0];
      const match = await getCategoryBySlug(first.slug);
      expect(match).not.toBeNull();
      expect(match?.id).toBe(first.id);

      const nonExistent = await getCategoryBySlug('slug-khong-ton-tai-12345');
      expect(nonExistent).toBeNull();
    });
  });

  describe('Products Queries', () => {
    it('returns paginated products list with correct shape', async () => {
      const res = await getProducts({ page: 1, limit: 10 });
      expect(Array.isArray(res.products)).toBe(true);
      expect(typeof res.total).toBe('number');
      expect(typeof res.totalPages).toBe('number');
      expect(res.currentPage).toBe(1);
    });

    it('returns featured products array', async () => {
      const featured = await getFeaturedProducts(6);
      expect(Array.isArray(featured)).toBe(true);
    });

    it('returns null for non-existent product slug', async () => {
      const prod = await getProductBySlug('san-pham-khong-ton-tai-99999');
      expect(prod).toBeNull();
    });

    it('handles array of slug params gracefully', async () => {
      const prod = await getProductBySlug(['bot-mau', '99999']);
      expect(prod).toBeNull();
    });

    it('returns related products array safely', async () => {
      const related = await getRelatedProducts('p-test', 'cat-kim-tuyen', 4);
      expect(Array.isArray(related)).toBe(true);
    });
  });

  describe('Blogs Queries', () => {
    it('returns paginated published blogs with correct shape', async () => {
      const res = await getBlogs({ page: 1, limit: 6 });
      expect(Array.isArray(res.blogs)).toBe(true);
      expect(typeof res.total).toBe('number');
    });

    it('returns null for non-existent blog slug', async () => {
      const blog = await getBlogBySlug('bai-viet-khong-ton-tai-99999');
      expect(blog).toBeNull();
    });
  });
});
