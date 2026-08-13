export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subcategories: SubCategory[];
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  unit: string; // e.g., "hũ 100g", "kg", "cuộn", "chai"
  description: string;
  categoryId: string;
  categoryName: string;
  subcategoryId?: string;
  subcategoryName?: string;
  images: string[];
  isFeatured: boolean;
  displayOrder: number; // for drag and drop reordering
  inStock: boolean;
  specs?: Record<string, string>; // e.g. Color, Size, Origin
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  unit: string;
  quantity: number;
}

export type PaymentMethod = 'payos_qr' | 'zalo_contact' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'cancelled' | 'failed';

export interface Order {
  id: string;
  orderCode: string; // e.g. MKT1024
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  customerNote?: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  payosCheckoutUrl?: string;
  payosQrCodeUrl?: string;
  createdAt: string;
  paidAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  summary: string;
  content: string;
  author: string;
  isPublished: boolean;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  hotline: string;
  zaloPhone: string;
  email: string;
  facebookUrl: string;
  address: string;
  workingHours: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
}
