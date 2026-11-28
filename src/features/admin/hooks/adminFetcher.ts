import { BlogPost, Order, Product } from '@/shared/types';

export interface DbProductRow {
  id: string;
  title: string;
  slug: string;
  price: number | string;
  original_price?: number | string | null;
  unit?: string | null;
  description?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  subcategory_id?: string | null;
  subcategory_name?: string | null;
  images?: string[] | null;
  is_featured?: boolean | null;
  display_order?: number | string | null;
  in_stock?: boolean | null;
  specs?: Record<string, string> | null;
  created_at?: string | null;
}

export interface DbBlogRow {
  id: string;
  title: string;
  slug: string;
  category?: string | null;
  thumbnail?: string | null;
  summary?: string | null;
  content?: string | null;
  sections?: BlogPost['sections'] | null;
  author?: string | null;
  is_published?: boolean | null;
  created_at?: string | null;
}

export interface DbOrderRow {
  id: string;
  order_code?: string;
  orderCode?: string;
  customer_name?: string;
  customerName?: string;
  customer_phone?: string;
  customerPhone?: string;
  customer_address?: string;
  customerAddress?: string;
  customer_note?: string;
  notes?: string;
  total_amount?: number | string;
  totalAmount?: number | string;
  payment_status?: Order['paymentStatus'];
  paymentStatus?: Order['paymentStatus'];
  payment_method?: Order['paymentMethod'];
  paymentMethod?: Order['paymentMethod'];
  items?: Order['items'] | null;
  created_at?: string;
  createdAt?: string;
  paid_at?: string;
  paidAt?: string;
}

export async function adminFetch<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  let res = await fetch(url, {
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  if (res.status === 401) {
    try {
      const syncRes = await fetch('/api/auth/session');
      if (syncRes.ok) {
        res = await fetch(url, {
          ...init,
          headers: {
            ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
            ...init?.headers,
          },
        });
      }
    } catch {
      // ignore session refresh fallback failure
    }
  }

  const text = await res.text();
  let json: { message?: string; error?: string } | null = null;
  try {
    json = text ? (JSON.parse(text) as { message?: string; error?: string }) : null;
  } catch {
    json = null;
  }

  if (!res.ok) {
    const err = new Error(
      json?.message ||
        json?.error ||
        (res.status === 401
          ? 'Phiên đăng nhập quản trị viên đã hết hạn. Vui lòng đăng nhập lại.'
          : `Yêu cầu thất bại (${res.status})`),
    ) as Error & { data?: unknown };
    err.data = json;
    throw err;
  }

  return json as T;
}

export function mapAdminProduct(item: DbProductRow): Product {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    price: Number(item.price) || 0,
    originalPrice: item.original_price ? Number(item.original_price) : undefined,
    isContactPrice: Number(item.price) <= 1,
    unit: item.unit || 'Kg',
    description: item.description || '',
    categoryId: item.category_id || '',
    categoryName: item.category_name || '',
    subcategoryId: item.subcategory_id || undefined,
    subcategoryName: item.subcategory_name || undefined,
    images: Array.isArray(item.images) ? item.images : [],
    isFeatured: Boolean(item.is_featured),
    displayOrder: Number(item.display_order) || 0,
    inStock: item.in_stock !== false,
    specs: item.specs || {},
    createdAt: item.created_at || new Date().toISOString(),
  };
}

export function mapAdminBlog(item: DbBlogRow): BlogPost {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    category: item.category || 'Mẹo hay',
    thumbnail: item.thumbnail || '',
    summary: item.summary || '',
    content: item.content || '',
    sections: Array.isArray(item.sections) ? item.sections : [],
    author: item.author || 'Chị Mai Kim Tuyến',
    isPublished: item.is_published ?? true,
    createdAt: item.created_at
      ? new Date(item.created_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  };
}

export function mapAdminOrder(o: DbOrderRow): Order {
  return {
    id: o.id,
    orderCode: o.order_code || o.orderCode || '',
    customerName: o.customer_name || o.customerName || '',
    customerPhone: o.customer_phone || o.customerPhone || '',
    customerAddress: o.customer_address || o.customerAddress,
    customerNote: o.customer_note || o.notes,
    totalAmount: Number(o.total_amount ?? o.totalAmount) || 0,
    paymentStatus: (o.payment_status || o.paymentStatus || 'pending') as Order['paymentStatus'],
    paymentMethod: (o.payment_method || o.paymentMethod || 'zalo_contact') as Order['paymentMethod'],
    items: Array.isArray(o.items) ? o.items : [],
    createdAt: o.created_at || o.createdAt || new Date().toISOString(),
    paidAt: o.paid_at || o.paidAt,
  };
}
