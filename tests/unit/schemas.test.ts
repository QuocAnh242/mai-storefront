import { describe, it, expect } from 'vitest';
import {
  LoginSchema,
  CreateReviewSchema,
  CreateOrderSchema,
  PayOSWebhookPayloadSchema,
  ProductInputSchema,
} from '@/lib/validation/schemas';

describe('Validation Schemas', () => {
  describe('LoginSchema', () => {
    it('accepts valid credentials', () => {
      const res = LoginSchema.safeParse({ email: 'admin@example.com', password: 'secretpassword123' });
      expect(res.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const res = LoginSchema.safeParse({ email: 'not-an-email', password: 'secretpassword123' });
      expect(res.success).toBe(false);
    });

    it('rejects short passwords', () => {
      const res = LoginSchema.safeParse({ email: 'admin@example.com', password: '123' });
      expect(res.success).toBe(false);
    });
  });

  describe('CreateReviewSchema', () => {
    it('accepts valid review payload', () => {
      const res = CreateReviewSchema.safeParse({
        productId: 'prod_123',
        authorName: 'Nguyen Van A',
        rating: 5,
        content: 'San pham rat dep va chat luong tuyet voi!',
      });
      expect(res.success).toBe(true);
    });

    it('rejects rating outside 1..5', () => {
      const res0 = CreateReviewSchema.safeParse({
        productId: 'prod_123',
        authorName: 'Nguyen Van A',
        rating: 0,
        content: 'San pham rat tot',
      });
      const res6 = CreateReviewSchema.safeParse({
        productId: 'prod_123',
        authorName: 'Nguyen Van A',
        rating: 6,
        content: 'San pham rat tot',
      });
      expect(res0.success).toBe(false);
      expect(res6.success).toBe(false);
    });

    it('rejects content shorter than 5 chars', () => {
      const res = CreateReviewSchema.safeParse({
        productId: 'prod_123',
        authorName: 'Nguyen Van A',
        rating: 5,
        content: 'tot',
      });
      expect(res.success).toBe(false);
    });
  });

  describe('CreateOrderSchema', () => {
    it('accepts valid order creation parameters', () => {
      const res = CreateOrderSchema.safeParse({
        orderCode: '123456',
        amount: 50000,
        description: 'Thanh toan don hang #123456',
      });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.orderCode).toBe(123456);
      }
    });

    it('rejects order amount less than 1,000 VND', () => {
      const res = CreateOrderSchema.safeParse({
        orderCode: 123456,
        amount: 500,
      });
      expect(res.success).toBe(false);
    });
  });

  describe('PayOSWebhookPayloadSchema', () => {
    it('validates complete webhook structure', () => {
      const payload = {
        code: '00',
        desc: 'success',
        data: {
          orderCode: 998877,
          amount: 150000,
          description: 'Thanh toan PayOS',
        },
        signature: 'valid_hmac_hex_string',
      };
      const res = PayOSWebhookPayloadSchema.safeParse(payload);
      expect(res.success).toBe(true);
    });

    it('rejects payload missing signature', () => {
      const payload = {
        code: '00',
        desc: 'success',
        data: { orderCode: 998877, amount: 150000 },
        signature: '',
      };
      const res = PayOSWebhookPayloadSchema.safeParse(payload);
      expect(res.success).toBe(false);
    });
  });

  describe('ProductInputSchema', () => {
    it('accepts valid product payload', () => {
      const res = ProductInputSchema.safeParse({
        title: 'Bột Kim Tuyến Vàng 0.2mm',
        price: 150000,
        categoryId: 'cat-kim-tuyen',
      });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.unit).toBe('Kg');
        expect(res.data.inStock).toBe(true);
      }
    });

    it('rejects empty product title', () => {
      const res = ProductInputSchema.safeParse({
        title: '',
        price: 150000,
        categoryId: 'cat-kim-tuyen',
      });
      expect(res.success).toBe(false);
    });

    it('rejects missing categoryId', () => {
      const res = ProductInputSchema.safeParse({
        title: 'Bột Kim Tuyến',
        price: 150000,
        categoryId: '',
      });
      expect(res.success).toBe(false);
    });
  });
});
