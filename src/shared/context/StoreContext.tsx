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
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Load Initial Data from LocalStorage or Supabase
  useEffect(() => {
    const localProds = localStorage.getItem('mkt_products');
    const localCats = localStorage.getItem('mkt_categories');
    const localBlogs = localStorage.getItem('mkt_blogs');
    const localOrders = localStorage.getItem('mkt_orders');

    if (localProds) setProducts(JSON.parse(localProds));
    else setProducts(INITIAL_PRODUCTS);

    if (localCats) setCategories(JSON.parse(localCats));
    else setCategories(INITIAL_CATEGORIES);

    if (localBlogs) setBlogs(JSON.parse(localBlogs));
    else setBlogs(INITIAL_BLOGS);

    if (localOrders) setOrders(JSON.parse(localOrders));

    // Async sync with Supabase if configured
    if (isSupabaseConfigured()) {
      supabase.from('products').select('*').then(({ data }) => {
        if (data && data.length > 0) {
          // Map DB fields to camelCase
          const mapped: Product[] = data.map((item: any) => ({
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
          }));
          setProducts(mapped);
        } else if (data && data.length === 0) {
          setProducts([]);
          localStorage.removeItem('mkt_products');
        }
      });
    }
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    if (products.length) {
      localStorage.setItem('mkt_products', JSON.stringify(products));
    } else {
      localStorage.removeItem('mkt_products');
    }
  }, [products]);

  useEffect(() => {
    if (categories.length) localStorage.setItem('mkt_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    if (blogs.length) localStorage.setItem('mkt_blogs', JSON.stringify(blogs));
  }, [blogs]);

  useEffect(() => {
    if (orders.length) localStorage.setItem('mkt_orders', JSON.stringify(orders));
  }, [orders]);

  // Derived featured products sorted by displayOrder
  const featuredProducts = products
    .filter((p) => p.isFeatured)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Product Actions
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
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );

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
    localStorage.removeItem('mkt_products');
    if (isSupabaseConfigured()) {
      supabase.from('products').delete().neq('id', '').then();
    }
  };

  const reorderFeaturedProducts = (reorderedList: Product[]) => {
    const updatedProducts = products.map((p) => {
      const idx = reorderedList.findIndex((item) => item.id === p.id);
      if (idx !== -1) {
        return { ...p, displayOrder: idx + 1 };
      }
      return p;
    });
    setProducts(updatedProducts);

    if (isSupabaseConfigured()) {
      reorderedList.forEach((prod, index) => {
        supabase.from('products').update({ display_order: index + 1 }).eq('id', prod.id).then();
      });
    }
  };

  // Category Actions
  const addCategory = (cat: Omit<Category, 'id'>) => {
    const category: Category = { ...cat, id: `cat-${Date.now()}` };
    setCategories((prev) => [...prev, category]);
  };

  const updateCategory = (id: string, cat: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...cat } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Blog Actions
  const addBlogPost = (blog: Omit<BlogPost, 'id' | 'createdAt'>) => {
    const post: BlogPost = {
      ...blog,
      id: `blog-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setBlogs((prev) => [post, ...prev]);
  };

  const updateBlogPost = (id: string, blog: Partial<BlogPost>) => {
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...blog } : b))
    );
  };

  const deleteBlogPost = (id: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  };

  // Order Actions
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
    setOrders((prev) =>
      prev.map((o) => (o.orderCode === orderCode ? { ...o, paymentStatus: status, paidAt: status === 'paid' ? new Date().toISOString() : o.paidAt } : o))
    );
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
