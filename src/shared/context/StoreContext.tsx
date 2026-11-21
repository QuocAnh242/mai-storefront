"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Category, BlogPost, Order, StoreSettings } from "../types";
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_BLOGS,
  INITIAL_STORE_SETTINGS,
} from "../constants/initialData";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

interface StoreContextType {
  isLoading: boolean;
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
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  clearAllProducts: () => void;
  reorderFeaturedProducts: (reorderedList: Product[]) => void;

  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addBlogPost: (blog: Omit<BlogPost, "id" | "createdAt">) => void;
  updateBlogPost: (id: string, blog: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;

  createOrder: (
    order: Omit<Order, "id" | "createdAt" | "orderCode">,
  ) => Promise<Order>;
  updateOrderStatus: (
    orderCode: string,
    status: Order["paymentStatus"],
  ) => void;
  deleteOrder: (
    orderCode: string,
  ) => Promise<{ success: boolean; message: string }>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Helper to ensure authenticated Supabase session on client for RLS operations
  const ensureAuthSession = async () => {
    if (!isSupabaseConfigured() || typeof window === "undefined") return;
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data?.session?.access_token) {
            await supabase.auth.setSession({
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
            });
            console.log("Admin session synchronized to Supabase client");
          }
        }
      }
    } catch (err) {
      console.warn("Session sync notice:", err);
    }
  };

  // Sync session on mount
  useEffect(() => {
    ensureAuthSession();
  }, []);

  // Load all data from Supabase on mount in parallel
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // No DB: use hardcoded initial data
      setProducts(INITIAL_PRODUCTS);
      setCategories(INITIAL_CATEGORIES);
      setBlogs(INITIAL_BLOGS);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    Promise.allSettled([
      supabase.from("products").select("*"),
      supabase.from("categories").select("*"),
      supabase.from("blogs").select("*").order("created_at", { ascending: false }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
    ]).then(([prodRes, catRes, blogRes, orderRes]) => {
      if (!isMounted) return;

      // 1. Process Products
      if (prodRes.status === "fulfilled" && prodRes.value.data && prodRes.value.data.length > 0) {
        setProducts(
          prodRes.value.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            price: Number(item.price),
            originalPrice: item.original_price ? Number(item.original_price) : undefined,
            isContactPrice: Boolean(item.is_contact_price || Number(item.price) <= 1),
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
          }))
        );
      } else {
        setProducts(INITIAL_PRODUCTS);
      }

      // 2. Process Categories
      if (catRes.status === "fulfilled" && catRes.value.data && catRes.value.data.length > 0) {
        const rawCats = catRes.value.data;
        const mainCats = rawCats.filter((c: any) => !c.parent_id);
        const subCats = rawCats.filter((c: any) => Boolean(c.parent_id));

        const mappedCategories = mainCats.map((main: any) => {
          const dbSubs = subCats
            .filter((s: any) => s.parent_id === main.id)
            .map((s: any) => ({
              id: s.id,
              name: s.name,
              slug: s.slug,
              categoryId: main.id,
            }));

          const initialMatch = INITIAL_CATEGORIES.find((ic) => ic.id === main.id);
          const initialSubs = initialMatch?.subcategories || [];

          const subMap = new Map();
          initialSubs.forEach((s) => subMap.set(s.id, s));
          dbSubs.forEach((s: any) => subMap.set(s.id, s));

          return {
            id: main.id,
            name: main.name,
            slug: main.slug,
            description: main.description,
            subcategories: Array.from(subMap.values()),
          };
        });

        setCategories(mappedCategories.length > 0 ? mappedCategories : INITIAL_CATEGORIES);
      } else {
        setCategories(INITIAL_CATEGORIES);
      }

      // 3. Process Blogs
      if (blogRes.status === "fulfilled" && blogRes.value.data && blogRes.value.data.length > 0) {
        setBlogs(
          blogRes.value.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            category: item.category || "Mẹo hay",
            thumbnail: item.thumbnail,
            summary: item.summary,
            content: item.content || "",
            sections: item.sections || [],
            author: item.author || "Chị Mai Kim Tuyến",
            isPublished: item.is_published ?? true,
            createdAt: item.created_at
              ? new Date(item.created_at).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
          }))
        );
      } else {
        setBlogs(INITIAL_BLOGS);
      }

      // 4. Process Orders
      if (orderRes.status === "fulfilled" && orderRes.value.data) {
        setOrders(
          orderRes.value.data.map((item: any) => ({
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
          }))
        );
      }

      setIsLoading(false);
    }).catch(() => {
      if (isMounted) {
        setProducts(INITIAL_PRODUCTS);
        setCategories(INITIAL_CATEGORIES);
        setBlogs(INITIAL_BLOGS);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Derived featured products sorted by displayOrder
  const featuredProducts = products
    .filter((p) => p.isFeatured)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // ── Product Actions ──────────────────────────────────────────────────────────
  const addProduct = async (newProd: Omit<Product, "id" | "createdAt">) => {
    const tempId = `p-${Date.now()}`;
    const product: Product = {
      ...newProd,
      id: tempId,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setProducts((prev) => [product, ...prev]);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProd),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const created: Product = {
            id: json.data.id,
            title: json.data.title,
            slug: json.data.slug,
            price: Number(json.data.price),
            originalPrice: json.data.original_price ? Number(json.data.original_price) : undefined,
            isContactPrice: Boolean(Number(json.data.price) <= 1),
            unit: json.data.unit,
            description: json.data.description,
            categoryId: json.data.category_id,
            categoryName: json.data.category_name,
            subcategoryId: json.data.subcategory_id,
            subcategoryName: json.data.subcategory_name,
            images: json.data.images || [],
            isFeatured: json.data.is_featured,
            displayOrder: json.data.display_order || 0,
            inStock: json.data.in_stock,
            specs: json.data.specs || {},
            createdAt: json.data.created_at,
          };
          setProducts((prev) => prev.map((p) => (p.id === tempId ? created : p)));
        }
      } else {
        console.error("❌ Add product failed:", await res.text());
      }
    } catch (err) {
      console.error("❌ Add product error:", err);
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)),
    );

    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updatedFields }),
      });
      if (!res.ok) {
        console.error("❌ Update product failed:", await res.text());
      }
    } catch (err) {
      console.error("❌ Update product error:", err);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        console.error("❌ Delete product failed:", await res.text());
      }
    } catch (err) {
      console.error("❌ Delete product error:", err);
    }
  };

  const clearAllProducts = () => {
    setProducts([]);
    if (isSupabaseConfigured()) {
      supabase.from("products").delete().neq("id", "").then();
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
        fetch("/api/admin/products", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: prod.id, displayOrder: index + 1 }),
        }).catch((err) => console.error("❌ Reorder error:", err));
      });
    }
  };

  // ── Category Actions ─────────────────────────────────────────────────────────
  const addCategory = async (cat: Omit<Category, "id">) => {
    const tempId = `cat-${Date.now()}`;
    const category: Category = { ...cat, id: tempId };
    setCategories((prev) => [...prev, category]);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cat),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setCategories((prev) =>
            prev.map((c) =>
              c.id === tempId
                ? {
                    ...c,
                    id: json.data.id,
                    name: json.data.name,
                    slug: json.data.slug,
                    description: json.data.description,
                  }
                : c
            )
          );
        }
      } else {
        console.error("❌ Add category failed:", await res.text());
      }
    } catch (err) {
      console.error("❌ Add category error:", err);
    }
  };

  const updateCategory = async (id: string, cat: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...cat } : c)),
    );

    try {
      const res = await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...cat }),
      });
      if (!res.ok) {
        console.error("❌ Update category failed:", await res.text());
      }
    } catch (err) {
      console.error("❌ Update category error:", err);
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));

    try {
      const res = await fetch(`/api/admin/categories?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        console.error("❌ Delete category failed:", await res.text());
      }
    } catch (err) {
      console.error("❌ Delete category error:", err);
    }
  };

  // ── Blog Actions ─────────────────────────────────────────────────────────────
  const addBlogPost = async (blog: Omit<BlogPost, "id" | "createdAt">) => {
    const post: BlogPost = {
      ...blog,
      id: `blog-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setBlogs((prev) => [post, ...prev]);

    if (isSupabaseConfigured()) {
      await ensureAuthSession();
      const fullPayload = {
        id: post.id,
        title: post.title,
        slug: post.slug,
        category: post.category || "Mẹo hay",
        thumbnail: post.thumbnail,
        summary: post.summary,
        content: post.content,
        sections: post.sections || [],
        author: post.author,
        is_published: post.isPublished,
      };

      const { error: fullErr } = await supabase
        .from("blogs")
        .insert([fullPayload]);

      if (fullErr) {
        console.warn(
          "Supabase full blog insert error, trying legacy fallback:",
          fullErr.message,
        );

        // Fallback: Embed sections and category into content JSON string if DB table lacks new columns
        const fallbackContent = JSON.stringify({
          category: post.category || "Mẹo hay",
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

        const { error: legacyErr } = await supabase
          .from("blogs")
          .insert([legacyPayload]);
        if (legacyErr) {
          console.error(
            "Error inserting blog into Supabase fallback:",
            legacyErr.message,
          );
        }
      }
    }
  };

  const updateBlogPost = async (id: string, blog: Partial<BlogPost>) => {
    setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, ...blog } : b)));

    if (isSupabaseConfigured()) {
      await ensureAuthSession();
      const dbPayload: any = {};
      if (blog.title !== undefined) dbPayload.title = blog.title;
      if (blog.slug !== undefined) dbPayload.slug = blog.slug;
      if (blog.category !== undefined) dbPayload.category = blog.category;
      if (blog.thumbnail !== undefined) dbPayload.thumbnail = blog.thumbnail;
      if (blog.summary !== undefined) dbPayload.summary = blog.summary;
      if (blog.content !== undefined) dbPayload.content = blog.content;
      if (blog.sections !== undefined) dbPayload.sections = blog.sections;
      if (blog.author !== undefined) dbPayload.author = blog.author;
      if (blog.isPublished !== undefined)
        dbPayload.is_published = blog.isPublished;

      const { error: updateErr } = await supabase
        .from("blogs")
        .update(dbPayload)
        .eq("id", id);

      if (updateErr) {
        console.warn(
          "Supabase blog update error, trying legacy fallback:",
          updateErr.message,
        );
        delete dbPayload.category;
        delete dbPayload.sections;
        if (blog.sections || blog.category) {
          dbPayload.content = JSON.stringify({
            category: blog.category || "Mẹo hay",
            sections: blog.sections || [],
            rawContent: blog.content || "",
          });
        }
        await supabase.from("blogs").update(dbPayload).eq("id", id);
      }
    }
  };

  const deleteBlogPost = async (id: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    if (isSupabaseConfigured()) {
      await ensureAuthSession();
      const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("id", id);
      if (error) console.error("Error deleting blog from Supabase:", error);
    }
  };

  // ── Order Actions ────────────────────────────────────────────────────────────
  const createOrder = async (
    orderInput: Omit<Order, "id" | "createdAt" | "orderCode">,
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
      await supabase.from("orders").insert([
        {
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
        },
      ]);
    }

    return newOrder;
  };

  const updateOrderStatus = async (
    orderCode: string,
    status: Order["paymentStatus"],
  ) => {
    const paidAt = status === "paid" ? new Date().toISOString() : undefined;
    setOrders((prev) =>
      prev.map((o) =>
        o.orderCode === orderCode
          ? { ...o, paymentStatus: status, paidAt: paidAt ?? o.paidAt }
          : o,
      ),
    );

    if (isSupabaseConfigured()) {
      await ensureAuthSession();
      const { error } = await supabase
        .from("orders")
        .update({
          payment_status: status,
          ...(paidAt ? { paid_at: paidAt } : {}),
        })
        .eq("order_code", orderCode);
      if (error)
        console.error("Failed to update order status in Supabase:", error);
    }
  };

  const deleteOrder = async (
    orderCode: string,
  ): Promise<{ success: boolean; message: string }> => {
    const order = orders.find((o) => o.orderCode === orderCode);
    if (!order) return { success: false, message: "Không tìm thấy đơn hàng." };
    if (order.paymentStatus === "paid") {
      return {
        success: false,
        message: "Không thể xóa đơn hàng đã thanh toán.",
      };
    }

    setOrders((prev) => prev.filter((o) => o.orderCode !== orderCode));

    if (isSupabaseConfigured()) {
      await ensureAuthSession();
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("order_code", orderCode);
      if (error) {
        console.error("Failed to delete order from Supabase:", error);
        return { success: false, message: "Xóa thất bại: " + error.message };
      }
    }

    return { success: true, message: `Đã xóa đơn ${orderCode}.` };
  };

  return (
    <StoreContext.Provider
      value={{
        isLoading,
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
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
