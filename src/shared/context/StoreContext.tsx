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
import { generateOrderCode, generateEntityId } from "@/lib/ids";
import { useToast } from "@/shared/context/ToastContext";

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
  addProduct: (
    product: Omit<Product, "id" | "createdAt">,
  ) => Promise<{ success: boolean; error?: string; data?: Product }>;
  updateProduct: (
    id: string,
    product: Partial<Product>,
  ) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (id: string) => Promise<{ success: boolean; error?: string }>;
  clearAllProducts: () => Promise<void> | void;
  reorderFeaturedProducts: (reorderedList: Product[]) => Promise<void> | void;

  addCategory: (
    category: Omit<Category, "id">,
  ) => Promise<{ success: boolean; error?: string; data?: Category }>;
  updateCategory: (
    id: string,
    category: Partial<Category>,
  ) => Promise<{ success: boolean; error?: string }>;
  deleteCategory: (id: string) => Promise<{ success: boolean; error?: string }>;

  addBlogPost: (
    blog: Omit<BlogPost, "id" | "createdAt">,
  ) => Promise<{ success: boolean; error?: string; data?: BlogPost }>;
  updateBlogPost: (
    id: string,
    blog: Partial<BlogPost>,
  ) => Promise<{ success: boolean; error?: string }>;
  deleteBlogPost: (id: string) => Promise<{ success: boolean; error?: string }>;

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
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Build headers with Authorization token when a client session exists
  const getAuthHeaders = async () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    try {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.access_token) {
        headers["Authorization"] = `Bearer ${data.session.access_token}`;
      }
    } catch {}
    return headers;
  };

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
      supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false }),
    ])
      .then(([prodRes, catRes, blogRes, orderRes]) => {
        if (!isMounted) return;

        // 1. Process Products
        if (
          prodRes.status === "fulfilled" &&
          prodRes.value.data &&
          prodRes.value.data.length > 0
        ) {
          setProducts(
            prodRes.value.data.map((item: any) => ({
              id: item.id,
              title: item.title,
              slug: item.slug,
              price: Number(item.price),
              originalPrice: item.original_price
                ? Number(item.original_price)
                : undefined,
              isContactPrice: Boolean(
                item.is_contact_price || Number(item.price) <= 1,
              ),
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
            })),
          );
        } else {
          setProducts(INITIAL_PRODUCTS);
        }

        // 2. Process Categories
        if (
          catRes.status === "fulfilled" &&
          catRes.value.data &&
          catRes.value.data.length > 0
        ) {
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

            const initialMatch = INITIAL_CATEGORIES.find(
              (ic) => ic.id === main.id,
            );
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

          setCategories(
            mappedCategories.length > 0 ? mappedCategories : INITIAL_CATEGORIES,
          );
        } else {
          setCategories(INITIAL_CATEGORIES);
        }

        // 3. Process Blogs
        if (
          blogRes.status === "fulfilled" &&
          blogRes.value.data &&
          blogRes.value.data.length > 0
        ) {
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
            })),
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
            })),
          );
        }

        setIsLoading(false);
      })
      .catch(() => {
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
  const addProduct = async (
    newProd: Omit<Product, "id" | "createdAt">,
  ): Promise<{ success: boolean; error?: string; data?: Product }> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers,
        body: JSON.stringify(newProd),
      });
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        const errorMsg =
          json?.message || json?.error || "Thêm sản phẩm thất bại";
        showToast(errorMsg, "error");
        return { success: false, error: errorMsg };
      }

      const item = json.data;
      const created: Product = {
        id: item.id,
        title: item.title,
        slug: item.slug,
        price: Number(item.price),
        originalPrice: item.original_price
          ? Number(item.original_price)
          : undefined,
        isContactPrice: Boolean(
          item.is_contact_price || Number(item.price) <= 1,
        ),
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
      };

      setProducts((prev) => [created, ...prev]);
      showToast(`Đã thêm sản phẩm "${created.title}" thành công!`, "success");
      return { success: true, data: created };
    } catch (err: any) {
      const errorMsg = err.message || "Lỗi kết nối khi thêm sản phẩm";
      showToast(errorMsg, "error");
      return { success: false, error: errorMsg };
    }
  };

  const updateProduct = async (
    id: string,
    updatedFields: Partial<Product>,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers,
        body: JSON.stringify({ id, ...updatedFields }),
      });
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        const errorMsg =
          json?.message || json?.error || "Cập nhật sản phẩm thất bại";
        showToast(errorMsg, "error");
        return { success: false, error: errorMsg };
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)),
      );
      showToast("Cập nhật sản phẩm thành công!", "success");
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.message || "Lỗi kết nối khi cập nhật sản phẩm";
      showToast(errorMsg, "error");
      return { success: false, error: errorMsg };
    }
  };

  const deleteProduct = async (
    id: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `/api/admin/products?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers,
        },
      );
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        const errorMsg =
          json?.message || json?.error || "Xóa sản phẩm thất bại";
        showToast(errorMsg, "error");
        return { success: false, error: errorMsg };
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast("Đã xóa sản phẩm thành công!", "success");
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.message || "Lỗi kết nối khi xóa sản phẩm";
      showToast(errorMsg, "error");
      return { success: false, error: errorMsg };
    }
  };

  const clearAllProducts = async () => {
    setProducts([]);
    if (isSupabaseConfigured()) {
      try {
        const headers = await getAuthHeaders();
        await fetch("/api/admin/products?action=clear_all&confirm=true", {
          method: "DELETE",
          headers,
        });
      } catch (err) {
        console.warn("[clearAllProducts error]:", err);
      }
    }
  };

  const reorderFeaturedProducts = async (reorderedList: Product[]) => {
    const updatedProducts = products.map((p) => {
      const idx = reorderedList.findIndex((item) => item.id === p.id);
      return idx !== -1 ? { ...p, displayOrder: idx + 1 } : p;
    });
    setProducts(updatedProducts);

    if (isSupabaseConfigured()) {
      try {
        const headers = await getAuthHeaders();
        const productIds = reorderedList.map((p) => p.id);
        const res = await fetch("/api/admin/products", {
          method: "PUT",
          headers,
          body: JSON.stringify({ action: "reorder", productIds }),
        });
        if (!res.ok) {
          console.warn(
            "[reorderFeaturedProducts] server returned status:",
            res.status,
          );
        }
      } catch (err) {
        console.warn("[reorderFeaturedProducts error]:", err);
      }
    }
  };

  // ── Category Actions ─────────────────────────────────────────────────────────
  const addCategory = async (
    cat: Omit<Category, "id">,
  ): Promise<{ success: boolean; error?: string; data?: Category }> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers,
        body: JSON.stringify(cat),
      });
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        const errorMsg =
          json?.message || json?.error || "Tạo danh mục thất bại";
        showToast(errorMsg, "error");
        return { success: false, error: errorMsg };
      }

      const createdCat: Category = {
        id: json.data.id,
        name: json.data.name,
        slug: json.data.slug,
        description: json.data.description,
        subcategories: cat.subcategories || [],
      };

      setCategories((prev) => [...prev, createdCat]);
      showToast(`Đã tạo danh mục "${createdCat.name}" thành công!`, "success");
      return { success: true, data: createdCat };
    } catch (err: any) {
      const errorMsg = err.message || "Lỗi kết nối khi tạo danh mục";
      showToast(errorMsg, "error");
      return { success: false, error: errorMsg };
    }
  };

  const updateCategory = async (
    id: string,
    cat: Partial<Category>,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/categories", {
        method: "PATCH",
        headers,
        body: JSON.stringify({ id, ...cat }),
      });
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        const errorMsg =
          json?.message || json?.error || "Cập nhật danh mục thất bại";
        showToast(errorMsg, "error");
        return { success: false, error: errorMsg };
      }

      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...cat } : c)),
      );
      showToast("Cập nhật danh mục thành công!", "success");
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.message || "Lỗi kết nối khi cập nhật danh mục";
      showToast(errorMsg, "error");
      return { success: false, error: errorMsg };
    }
  };

  const deleteCategory = async (
    id: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `/api/admin/categories?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers,
        },
      );
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        const errorMsg =
          json?.message || json?.error || "Xóa danh mục thất bại";
        showToast(errorMsg, "error");
        return { success: false, error: errorMsg };
      }

      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast("Đã xóa danh mục thành công!", "success");
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.message || "Lỗi kết nối khi xóa danh mục";
      showToast(errorMsg, "error");
      return { success: false, error: errorMsg };
    }
  };

  // ── Blog Actions ─────────────────────────────────────────────────────────────
  const addBlogPost = async (
    blog: Omit<BlogPost, "id" | "createdAt">,
  ): Promise<{ success: boolean; error?: string; data?: BlogPost }> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers,
        body: JSON.stringify(blog),
      });
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        const errorMsg =
          json?.error || json?.message || "Tạo bài viết thất bại";
        showToast(errorMsg, "error");
        return { success: false, error: errorMsg };
      }

      const item = json.data;
      const created: BlogPost = {
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
      };

      setBlogs((prev) => [created, ...prev]);
      showToast(`Đã tạo bài viết "${created.title}" thành công!`, "success");
      return { success: true, data: created };
    } catch (err: any) {
      const errorMsg = err.message || "Lỗi kết nối khi tạo bài viết";
      showToast(errorMsg, "error");
      return { success: false, error: errorMsg };
    }
  };

  const updateBlogPost = async (
    id: string,
    blog: Partial<BlogPost>,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/blogs", {
        method: "PATCH",
        headers,
        body: JSON.stringify({ id, ...blog }),
      });
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        const errorMsg =
          json?.error || json?.message || "Cập nhật bài viết thất bại";
        showToast(errorMsg, "error");
        return { success: false, error: errorMsg };
      }

      setBlogs((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...blog } : b)),
      );
      showToast("Cập nhật bài viết thành công!", "success");
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.message || "Lỗi kết nối khi cập nhật bài viết";
      showToast(errorMsg, "error");
      return { success: false, error: errorMsg };
    }
  };

  const deleteBlogPost = async (
    id: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/admin/blogs?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers,
      });
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        const errorMsg =
          json?.error || json?.message || "Xóa bài viết thất bại";
        showToast(errorMsg, "error");
        return { success: false, error: errorMsg };
      }

      setBlogs((prev) => prev.filter((b) => b.id !== id));
      showToast("Đã xóa bài viết thành công!", "success");
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.message || "Lỗi kết nối khi xóa bài viết";
      showToast(errorMsg, "error");
      return { success: false, error: errorMsg };
    }
  };

  // ── Order Actions ────────────────────────────────────────────────────────────
  const createOrder = async (
    orderInput: Omit<Order, "id" | "createdAt" | "orderCode">,
  ): Promise<Order> => {
    const orderCode = generateOrderCode();
    const newOrder: Order = {
      ...orderInput,
      id: generateEntityId("ord"),
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

    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderCode, status }),
      });
    } catch (err) {
      console.error("Failed to update order status:", err);
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

    try {
      const res = await fetch(
        `/api/admin/orders?orderCode=${encodeURIComponent(orderCode)}`,
        {
          method: "DELETE",
        },
      );
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        return {
          success: false,
          message: json?.error || "Xóa đơn hàng thất bại.",
        };
      }
      return {
        success: true,
        message: json?.message || `Đã xóa đơn ${orderCode}.`,
      };
    } catch (err: any) {
      return { success: false, message: "Lỗi kết nối: " + err.message };
    }
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
