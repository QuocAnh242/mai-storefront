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

export interface BlogBlock {
  id: string;
  type: 'paragraph' | 'heading' | 'image' | 'quote' | 'ad_banner';
  content: string;
  level?: 2 | 3;
  caption?: string;
  formatting?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    listType?: 'none' | 'bullet' | 'number';
    alignment?: 'left' | 'center' | 'right';
  };
  bannerImage?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
  bannerLink?: string;
  bannerCtaText?: string;
}

export interface BlogSection {
  id: string;
  sectionTitle?: string;
  blocks: BlogBlock[];
  hasAdAfter?: boolean;
  adConfig?: {
    bannerTitle?: string;
    bannerSubtitle?: string;
    bannerImage?: string;
    bannerLink?: string;
    bannerCtaText?: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category?: string;
  thumbnail: string;
  summary: string;
  content: string;
  sections?: BlogSection[];
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
