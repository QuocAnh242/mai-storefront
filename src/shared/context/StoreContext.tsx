'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, BlogPost, Order, StoreSettings } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_BLOGS, INITIAL_STORE_SETTINGS } from '../constants/initialData';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  blogs: BlogPost[];
  orders: Order[];
  settings: StoreSettings;
  featuredProducts: Product[];
  selectedCategory: string | null;
  setSelectedCategory: (catId: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  clearAllProducts: () => void;
  reorderFeaturedProducts: (reorderedList: Product[]) => void;

  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addBlogPost: (blog: Omit<BlogPost, 'id' | 'createdAt'>) => void;
  updateBlogPost: (id: string, blog: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;

  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'orderCode'>) => Promise<Order>;
  updateOrderStatus: (orderCode: string, status: Order['paymentStatus']) => void;
  deleteOrder: (orderCode: string) => Promise<{ success: boolean; message: string }>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Load all data from Supabase on mount
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // No DB: use hardcoded initial data
      setProducts(INITIAL_PRODUCTS);
      setCategories(INITIAL_CATEGORIES);
      setBlogs(INITIAL_BLOGS);
      return;
    }

    // Products
    supabase.from('products').select('*').then(({ data }) => {
      if (data && data.length > 0) {
        setProducts(data.map((item: any) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          price: Number(item.price),
          originalPrice: item.original_price ? Number(item.original_price) : undefined,
          unit: item.unit,
          description: item.description,
          categoryId: item.category_id,
          categoryName: item.category_name,
          subcategoryId: item.subcategory_id,
          subcategoryName: item.subcategory_name,
          images: item.images || [],
          isFeatured: item.is_featured,
          displayOrder: item.display_order || 0,
          inStock: item.in_stock,
          specs: item.specs || {},
          createdAt: item.created_at,
        })));
      } else {
        setProducts(INITIAL_PRODUCTS);
      }
    });

    // Categories
    supabase.from('categories').select('*').then(({ data }) => {
      if (data && data.length > 0) {
        setCategories(data.map((item: any) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          description: item.description,
          subcategories: item.subcategories || [],
        })));
      } else {
        setCategories(INITIAL_CATEGORIES);
      }
    });

    // Blogs
    supabase.from('blogs').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data && data.length > 0) {
        setBlogs(data.map((item: any) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          category: item.category || 'Mẹo hay',
          thumbnail: item.thumbnail,
          summary: item.summary,
          content: item.content || '',
          sections: item.sections || [],
          author: item.author || 'Chị Mai Kim Tuyến',
          isPublished: item.is_published ?? true,
          createdAt: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        })));
      } else {
        setBlogs(INITIAL_BLOGS);
      }
    });

    // Orders
    supabase.from('orders').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) {
        setOrders(data.map((item: any) => ({
          id: item.id,
          orderCode: item.order_code,
          customerName: item.customer_name,
          customerPhone: item.customer_phone,
          customerAddress: item.customer_address,
          customerNote: item.customer_note,
          totalAmount: Number(item.total_amount),
          paymentMethod: item.payment_method,
          paymentStatus: item.payment_status,
          items: item.items || [],
          payosCheckoutUrl: item.payos_checkout_url,
          payosQrCodeUrl: item.payos_qr_code_url,
          createdAt: item.created_at,
          paidAt: item.paid_at,
        })));
      }
    });
  }, []);

  // Derived featured products sorted by displayOrder
  const featuredProducts = products
    .filter((p) => p.isFeatured)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // ── Product Actions ──────────────────────────────────────────────────────────
  const addProduct = (newProd: Omit<Product, 'id' | 'createdAt'>) => {
    const product: Product = {
      ...newProd,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts((prev) => [product, ...prev]);

    if (isSupabaseConfigured()) {
      supabase.from('products').insert([{
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        original_price: product.originalPrice,
        unit: product.unit,
        description: product.description,
        category_id: product.categoryId,
        category_name: product.categoryName,
        subcategory_id: product.subcategoryId,
        subcategory_name: product.subcategoryName,
        images: product.images,
        is_featured: product.isFeatured,
        display_order: product.displayOrder,
        in_stock: product.inStock,
        specs: product.specs,
      }]).then();
    }
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)));

    if (isSupabaseConfigured()) {
      const dbPayload: any = {};
      if (updatedFields.title !== undefined) dbPayload.title = updatedFields.title;
      if (updatedFields.slug !== undefined) dbPayload.slug = updatedFields.slug;
      if (updatedFields.price !== undefined) dbPayload.price = updatedFields.price;
      if (updatedFields.originalPrice !== undefined) dbPayload.original_price = updatedFields.originalPrice;
      if (updatedFields.unit !== undefined) dbPayload.unit = updatedFields.unit;
      if (updatedFields.description !== undefined) dbPayload.description = updatedFields.description;
      if (updatedFields.categoryId !== undefined) dbPayload.category_id = updatedFields.categoryId;
      if (updatedFields.categoryName !== undefined) dbPayload.category_name = updatedFields.categoryName;
      if (updatedFields.subcategoryId !== undefined) dbPayload.subcategory_id = updatedFields.subcategoryId;
      if (updatedFields.subcategoryName !== undefined) dbPayload.subcategory_name = updatedFields.subcategoryName;
      if (updatedFields.images !== undefined) dbPayload.images = updatedFields.images;
      if (updatedFields.isFeatured !== undefined) dbPayload.is_featured = updatedFields.isFeatured;
      if (updatedFields.displayOrder !== undefined) dbPayload.display_order = updatedFields.displayOrder;
      if (updatedFields.inStock !== undefined) dbPayload.in_stock = updatedFields.inStock;
      supabase.from('products').update(dbPayload).eq('id', id).then();
    }
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (isSupabaseConfigured()) {
      supabase.from('products').delete().eq('id', id).then();
    }
  };

  const clearAllProducts = () => {
    setProducts([]);
    if (isSupabaseConfigured()) {
      supabase.from('products').delete().neq('id', '').then();
    }
  };

  const reorderFeaturedProducts = (reorderedList: Product[]) => {
    const updatedProducts = products.map((p) => {
      const idx = reorderedList.findIndex((item) => item.id === p.id);
      return idx !== -1 ? { ...p, displayOrder: idx + 1 } : p;
    });
    setProducts(updatedProducts);

    if (isSupabaseConfigured()) {
      reorderedList.forEach((prod, index) => {
        supabase.from('products').update({ display_order: index + 1 }).eq('id', prod.id).then();
      });
    }
  };

  // ── Category Actions ─────────────────────────────────────────────────────────
  const addCategory = (cat: Omit<Category, 'id'>) => {
    const category: Category = { ...cat, id: `cat-${Date.now()}` };
    setCategories((prev) => [...prev, category]);
  };

  const updateCategory = (id: string, cat: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...cat } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // ── Blog Actions ─────────────────────────────────────────────────────────────
  const addBlogPost = async (blog: Omit<BlogPost, 'id' | 'createdAt'>) => {
    const post: BlogPost = {
      ...blog,
      id: `blog-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setBlogs((prev) => [post, ...prev]);

    if (isSupabaseConfigured()) {
      const fullPayload = {
        id: post.id,
        title: post.title,
        slug: post.slug,
        category: post.category || 'Mẹo hay',
        thumbnail: post.thumbnail,
        summary: post.summary,
        content: post.content,
        sections: post.sections || [],
        author: post.author,
        is_published: post.isPublished,
      };

      const { error: fullErr } = await supabase.from('blogs').insert([fullPayload]);

      if (fullErr) {
        console.warn('Supabase full blog insert error, trying legacy fallback:', fullErr.message);

        // Fallback: Embed sections and category into content JSON string if DB table lacks new columns
        const fallbackContent = JSON.stringify({
          category: post.category || 'Mẹo hay',
          sections: post.sections || [],
          rawContent: post.content,
        });

        const legacyPayload = {
          id: post.id,
          title: post.title,
          slug: post.slug,
          thumbnail: post.thumbnail,
          summary: post.summary,
          content: fallbackContent,
          author: post.author,
          is_published: post.isPublished,
        };

        const { error: legacyErr } = await supabase.from('blogs').insert([legacyPayload]);
        if (legacyErr) {
          console.error('Error inserting blog into Supabase fallback:', legacyErr.message);
        }
      }
    }
  };

  const updateBlogPost = async (id: string, blog: Partial<BlogPost>) => {
    setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, ...blog } : b)));

    if (isSupabaseConfigured()) {
      const dbPayload: any = {};
      if (blog.title !== undefined) dbPayload.title = blog.title;
      if (blog.slug !== undefined) dbPayload.slug = blog.slug;
      if (blog.category !== undefined) dbPayload.category = blog.category;
      if (blog.thumbnail !== undefined) dbPayload.thumbnail = blog.thumbnail;
      if (blog.summary !== undefined) dbPayload.summary = blog.summary;
      if (blog.content !== undefined) dbPayload.content = blog.content;
      if (blog.sections !== undefined) dbPayload.sections = blog.sections;
      if (blog.author !== undefined) dbPayload.author = blog.author;
      if (blog.isPublished !== undefined) dbPayload.is_published = blog.isPublished;

      const { error: updateErr } = await supabase.from('blogs').update(dbPayload).eq('id', id);

      if (updateErr) {
        console.warn('Supabase blog update error, trying legacy fallback:', updateErr.message);
        delete dbPayload.category;
        delete dbPayload.sections;
        if (blog.sections || blog.category) {
          dbPayload.content = JSON.stringify({
            category: blog.category || 'Mẹo hay',
            sections: blog.sections || [],
            rawContent: blog.content || '',
          });
        }
        await supabase.from('blogs').update(dbPayload).eq('id', id);
      }
    }
  };

  const deleteBlogPost = (id: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    if (isSupabaseConfigured()) {
      supabase
        .from('blogs')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('Error deleting blog from Supabase:', error);
        });
    }
  };

  // ── Order Actions ────────────────────────────────────────────────────────────
  const createOrder = async (
    orderInput: Omit<Order, 'id' | 'createdAt' | 'orderCode'>
  ): Promise<Order> => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `MKT${randomNum}`;
    const newOrder: Order = {
      ...orderInput,
      id: `ord-${Date.now()}`,
      orderCode,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    if (isSupabaseConfigured()) {
      await supabase.from('orders').insert([{
        id: newOrder.id,
        order_code: newOrder.orderCode,
        customer_name: newOrder.customerName,
        customer_phone: newOrder.customerPhone,
        customer_address: newOrder.customerAddress,
        customer_note: newOrder.customerNote,
        total_amount: newOrder.totalAmount,
        payment_method: newOrder.paymentMethod,
        payment_status: newOrder.paymentStatus,
        items: newOrder.items,
      }]);
    }

    return newOrder;
  };

  const updateOrderStatus = (orderCode: string, status: Order['paymentStatus']) => {
    const paidAt = status === 'paid' ? new Date().toISOString() : undefined;
    setOrders((prev) =>
      prev.map((o) => (o.orderCode === orderCode ? { ...o, paymentStatus: status, paidAt: paidAt ?? o.paidAt } : o))
    );

    if (isSupabaseConfigured()) {
      supabase
        .from('orders')
        .update({ payment_status: status, ...(paidAt ? { paid_at: paidAt } : {}) })
        .eq('order_code', orderCode)
        .then(({ error }) => {
          if (error) console.error('Failed to update order status in Supabase:', error);
        });
    }
  };

  const deleteOrder = async (orderCode: string): Promise<{ success: boolean; message: string }> => {
    const order = orders.find((o) => o.orderCode === orderCode);
    if (!order) return { success: false, message: 'Không tìm thấy đơn hàng.' };
    if (order.paymentStatus === 'paid') {
      return { success: false, message: 'Không thể xóa đơn hàng đã thanh toán.' };
    }

    setOrders((prev) => prev.filter((o) => o.orderCode !== orderCode));

    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('orders').delete().eq('order_code', orderCode);
      if (error) {
        console.error('Failed to delete order from Supabase:', error);
        return { success: false, message: 'Xóa thất bại: ' + error.message };
      }
    }

    return { success: true, message: `Đã xóa đơn ${orderCode}.` };
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        blogs,
        orders,
        settings,
        featuredProducts,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        addProduct,
        updateProduct,
        deleteProduct,
        clearAllProducts,
        reorderFeaturedProducts,
        addCategory,
        updateCategory,
        deleteCategory,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        createOrder,
        updateOrderStatus,
        deleteOrder,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
