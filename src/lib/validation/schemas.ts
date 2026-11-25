import { z } from 'zod';

/**
 * Authentication login schema
 */
export const LoginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

/**
 * Review creation schema
 */
export const CreateReviewSchema = z.object({
  productId: z.string().min(1, 'Thiếu thông tin sản phẩm'),
  authorName: z.string().min(2, 'Tên người dùng tối thiểu 2 ký tự').max(50, 'Tên tối đa 50 ký tự'),
  rating: z.number().int().min(1, 'Đánh giá tối thiểu 1').max(5, 'Đánh giá tối đa 5'),
  content: z.string().min(5, 'Cảm nhận tối thiểu 5 ký tự').max(1000, 'Cảm nhận tối đa 1000 ký tự'),
});

export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;

/**
 * PayOS create order schema
 */
export const CreateOrderSchema = z.object({
  orderCode: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
  amount: z.number().min(1000, 'Số tiền tối thiểu 1.000đ'),
  description: z.string().max(250).optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  returnUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

/**
 * PayOS webhook data payload schema
 */
export const PayOSWebhookDataSchema = z.object({
  orderCode: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
  amount: z.number(),
  description: z.string().optional(),
  accountNumber: z.string().optional(),
  reference: z.string().optional(),
  transactionDateTime: z.string().optional(),
  currency: z.string().optional(),
  paymentLinkId: z.string().optional(),
  code: z.string().optional(),
  desc: z.string().optional(),
});

export const PayOSWebhookPayloadSchema = z.object({
  code: z.string(),
  desc: z.string(),
  data: PayOSWebhookDataSchema,
  signature: z.string().min(1, 'Thiếu chữ ký xác thực'),
});

export type PayOSWebhookPayload = z.infer<typeof PayOSWebhookPayloadSchema>;

/**
 * Product creation / update schema
 */
export const ProductInputSchema = z.object({
  title: z.string().min(1, 'Vui lòng nhập tên sản phẩm').max(255, 'Tên sản phẩm tối đa 255 ký tự'),
  slug: z.string().optional(),
  price: z.number().min(0, 'Giá bán không được âm').default(0),
  originalPrice: z.number().min(0, 'Giá niêm yết không được âm').optional().nullable(),
  isContactPrice: z.boolean().default(false),
  unit: z.string().default('Kg'),
  description: z.string().default(''),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  categoryName: z.string().optional(),
  subcategoryId: z.string().optional().nullable(),
  subcategoryName: z.string().optional().nullable(),
  images: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().default(99),
  inStock: z.boolean().default(true),
  specs: z.record(z.string(), z.any()).default({}),
});

export type ProductInput = z.infer<typeof ProductInputSchema>;
