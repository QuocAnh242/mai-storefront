import { supabaseAdmin } from "@/lib/supabase";
import { generateEntityId } from "@/lib/ids";
import { slugify } from "@/lib/slugify";
import { withAdminRoute, ok, fail } from "@/lib/api/withAdminRoute";

// GET: Fetch products with server pagination and filtering
export const GET = withAdminRoute(
  {
    rateLimit: { key: "adm_prod_get", limit: 120, windowSeconds: 60 },
    requireServiceRole: false,
  },
  async ({ req, auth }) => {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSizeParam = searchParams.get("pageSize");
    const isAll = pageSizeParam === "all" || !searchParams.has("page");
    const pageSize = isAll
      ? 500
      : Math.max(1, Math.min(100, parseInt(pageSizeParam || "20", 10)));
    const q = searchParams.get("q")?.trim();
    const categoryId = searchParams.get("categoryId")?.trim();

    let query = supabaseAdmin!.from("products").select("*", { count: "exact" });

    if (categoryId && categoryId !== "all") {
      query = query.eq("category_id", categoryId);
    }
    if (q) {
      query = query.or(
        `title.ilike.%${q}%,description.ilike.%${q}%,id.ilike.%${q}%`,
      );
    }

    query = query
      .order("is_featured", { ascending: false })
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (!isAll) {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
    }

    const { data, count, error } = await query;
    if (error) {
      return fail("DB_ERROR", 500, error.message);
    }

    const total = count ?? (data?.length || 0);
    const totalPages = isAll ? 1 : Math.max(1, Math.ceil(total / pageSize));

    return ok(
      {
        data: data || [],
        total,
        page: isAll ? 1 : page,
        pageSize: isAll ? total : pageSize,
        totalPages,
      },
      { newSession: auth.newSession },
    );
  },
);

// POST: Create a new product
export const POST = withAdminRoute(
  { rateLimit: { key: "adm_prod_create", limit: 60, windowSeconds: 60 } },
  async ({ req, auth }) => {
    const body = await req.json();
    const {
      id,
      title,
      slug,
      price,
      originalPrice,
      isContactPrice,
      unit,
      description,
      categoryId,
      categoryName,
      subcategoryId,
      subcategoryName,
      images,
      isFeatured,
      displayOrder,
      inStock,
      specs,
    } = body;

    const trimmedTitle = typeof title === "string" ? title.trim() : "";
    if (!trimmedTitle) {
      return fail("MISSING_TITLE", 400, "Vui lòng nhập tên sản phẩm");
    }

    // Ensure category exists in DB, or fallback to first valid category
    let finalCategoryId = typeof categoryId === "string" ? categoryId.trim() : "";
    let finalCategoryName = typeof categoryName === "string" ? categoryName.trim() : "Chưa phân loại";

    if (finalCategoryId) {
      const { data: dbCat } = await supabaseAdmin!
        .from("categories")
        .select("id, name")
        .eq("id", finalCategoryId)
        .maybeSingle();

      if (dbCat) {
        finalCategoryName = dbCat.name;
      } else {
        // Fallback if client passed non-existent category
        const { data: fallbackCat } = await supabaseAdmin!
          .from("categories")
          .select("id, name")
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (fallbackCat) {
          finalCategoryId = fallbackCat.id;
          finalCategoryName = fallbackCat.name;
        } else {
          return fail("INVALID_CATEGORY", 400, "Danh mục sản phẩm không tồn tại trong hệ thống");
        }
      }
    } else {
      // If categoryId wasn't passed, fall back to first category
      const { data: fallbackCat } = await supabaseAdmin!
        .from("categories")
        .select("id, name")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (fallbackCat) {
        finalCategoryId = fallbackCat.id;
        finalCategoryName = fallbackCat.name;
      } else {
        return fail("MISSING_CATEGORY", 400, "Vui lòng chọn danh mục cho sản phẩm");
      }
    }

    const prodId = id || generateEntityId("p");

    // Robust slug deduplication
    let baseSlug = slug ? slugify(slug) : slugify(trimmedTitle);
    if (!baseSlug) {
      baseSlug = prodId;
    }

    let finalSlug = baseSlug;
    const { data: existingSlug } = await supabaseAdmin!
      .from("products")
      .select("id")
      .eq("slug", finalSlug)
      .maybeSingle();

    if (existingSlug && existingSlug.id !== prodId) {
      const uniqueSuffix = Date.now().toString(36).slice(-4);
      finalSlug = `${baseSlug}-${uniqueSuffix}`;

      // Secondary check in rare microsecond collisions
      const { data: collisionCheck } = await supabaseAdmin!
        .from("products")
        .select("id")
        .eq("slug", finalSlug)
        .maybeSingle();

      if (collisionCheck && collisionCheck.id !== prodId) {
        finalSlug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`;
      }
    }

    const insertPayload = {
      id: prodId,
      title: trimmedTitle,
      slug: finalSlug,
      price: isContactPrice ? 0 : Math.max(0, Number(price) || 0),
      original_price: (!isContactPrice && originalPrice) ? Math.max(0, Number(originalPrice)) : null,
      unit: unit || "Kg",
      description: description || "",
      category_id: finalCategoryId,
      category_name: finalCategoryName,
      subcategory_id: subcategoryId || null,
      subcategory_name: subcategoryName || null,
      images: Array.isArray(images) ? images : [],
      is_featured: Boolean(isFeatured),
      display_order: Number(displayOrder) || 99,
      in_stock: inStock !== undefined ? Boolean(inStock) : true,
      specs: specs || {},
    };

    const { data, error } = await supabaseAdmin!
      .from("products")
      .insert([insertPayload])
      .select()
      .single();

    if (error) {
      console.error("Supabase Product Insert Error:", error);
      let humanMessage = error.message;
      if (error.code === "23505") {
        humanMessage = "Tên hoặc đường dẫn (slug) sản phẩm đã tồn tại trong cơ sở dữ liệu.";
      } else if (error.code === "23503") {
        humanMessage = "Danh mục đã chọn không hợp lệ hoặc đã bị thay đổi.";
      }
      return fail("DB_ERROR", 500, humanMessage);
    }

    return ok(
      { data },
      { message: "Tạo sản phẩm thành công", newSession: auth.newSession },
    );
  },
);

// PUT: Batch actions (Atomic reordering)
export const PUT = withAdminRoute(
  { rateLimit: { key: "adm_prod_put", limit: 60, windowSeconds: 60 } },
  async ({ req, auth }) => {
    const body = await req.json();
    const { action, productIds } = body;

    if (action === "reorder") {
      if (!Array.isArray(productIds) || productIds.length === 0) {
        return fail("INVALID_DATA", 400, "Danh sách productIds không hợp lệ");
      }

      // Try RPC first for atomic update
      const { error: rpcError } = await supabaseAdmin!.rpc("reorder_products", {
        product_ids: productIds,
      });

      if (rpcError) {
        console.warn("[reorder_products rpc fallback]:", rpcError.message);
        const updatePromises = productIds.map((id, index) =>
          supabaseAdmin!
            .from("products")
            .update({ display_order: index + 1 })
            .eq("id", id),
        );
        await Promise.all(updatePromises);
      }

      return ok(
        {},
        {
          message: "Cập nhật thứ tự hiển thị thành công",
          newSession: auth.newSession,
        },
      );
    }

    return fail("INVALID_ACTION", 400, "Hành động không hợp lệ");
  },
);

// PATCH: Update a product
export const PATCH = withAdminRoute(
  { rateLimit: { key: "adm_prod_patch", limit: 120, windowSeconds: 60 } },
  async ({ req, auth }) => {
    const body = await req.json();
    const { id, ...updatedFields } = body;

    if (!id) {
      return fail("MISSING_ID", 400, "Thiếu ID sản phẩm");
    }

    const dbPayload: Record<string, any> = {};
    if (updatedFields.title !== undefined) {
      dbPayload.title = updatedFields.title.trim();
    }
    if (updatedFields.slug !== undefined) {
      let candidateSlug = slugify(updatedFields.slug || updatedFields.title || "");
      if (candidateSlug) {
        const { data: existingSlug } = await supabaseAdmin!
          .from("products")
          .select("id")
          .eq("slug", candidateSlug)
          .neq("id", id)
          .maybeSingle();

        if (existingSlug) {
          candidateSlug = `${candidateSlug}-${Date.now().toString(36).slice(-4)}`;
        }
        dbPayload.slug = candidateSlug;
      }
    }
    if (updatedFields.price !== undefined) {
      dbPayload.price = Number(updatedFields.price);
    }
    if (
      updatedFields.isContactPrice !== undefined &&
      updatedFields.isContactPrice
    ) {
      dbPayload.price = 0;
    }
    if (updatedFields.originalPrice !== undefined) {
      dbPayload.original_price = updatedFields.originalPrice
        ? Number(updatedFields.originalPrice)
        : null;
    }
    if (updatedFields.unit !== undefined) dbPayload.unit = updatedFields.unit;
    if (updatedFields.description !== undefined)
      dbPayload.description = updatedFields.description;
    if (updatedFields.categoryId !== undefined) {
      const { data: catCheck } = await supabaseAdmin!
        .from("categories")
        .select("id, name")
        .eq("id", updatedFields.categoryId)
        .maybeSingle();

      if (catCheck) {
        dbPayload.category_id = catCheck.id;
        dbPayload.category_name = catCheck.name;
      } else {
        dbPayload.category_id = updatedFields.categoryId;
        if (updatedFields.categoryName !== undefined) {
          dbPayload.category_name = updatedFields.categoryName;
        }
      }
    } else if (updatedFields.categoryName !== undefined) {
      dbPayload.category_name = updatedFields.categoryName;
    }
    if (updatedFields.subcategoryId !== undefined)
      dbPayload.subcategory_id = updatedFields.subcategoryId || null;
    if (updatedFields.subcategoryName !== undefined)
      dbPayload.subcategory_name = updatedFields.subcategoryName || null;
    if (updatedFields.images !== undefined)
      dbPayload.images = Array.isArray(updatedFields.images) ? updatedFields.images : [];
    if (updatedFields.isFeatured !== undefined)
      dbPayload.is_featured = Boolean(updatedFields.isFeatured);
    if (updatedFields.displayOrder !== undefined)
      dbPayload.display_order = Number(updatedFields.displayOrder);
    if (updatedFields.inStock !== undefined)
      dbPayload.in_stock = Boolean(updatedFields.inStock);
    if (updatedFields.specs !== undefined)
      dbPayload.specs = updatedFields.specs;

    const { data, error } = await supabaseAdmin!
      .from("products")
      .update(dbPayload)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Supabase Product Update Error:", error);
      let humanMessage = error.message;
      if (error.code === "23505") {
        humanMessage = "Tên hoặc đường dẫn (slug) sản phẩm đã trùng lặp trong hệ thống.";
      } else if (error.code === "23503") {
        humanMessage = "Danh mục đã chọn không hợp lệ.";
      }
      return fail("DB_ERROR", 500, humanMessage);
    }

    if (!data) {
      return fail("NOT_FOUND", 404, "Không tìm thấy sản phẩm để cập nhật");
    }

    return ok(
      { data },
      { message: "Cập nhật sản phẩm thành công", newSession: auth.newSession },
    );
  },
);

// DELETE: Remove a single product or clear all products
export const DELETE = withAdminRoute(
  { rateLimit: { key: "adm_prod_delete", limit: 60, windowSeconds: 60 } },
  async ({ req, auth }) => {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    if (action === "clear_all") {
      const confirm = searchParams.get("confirm");
      if (confirm !== "true") {
        return fail(
          "CONFIRM_REQUIRED",
          400,
          "Cần xác nhận tham số confirm=true để xóa tất cả",
        );
      }

      const { error } = await supabaseAdmin!
        .from("products")
        .delete()
        .neq("id", "___NEVER_MATCH___");

      if (error) {
        console.error("Supabase Clear All Products Error:", error);
        return fail("DB_ERROR", 500, error.message);
      }

      return ok(
        {},
        {
          message: "Đã xóa toàn bộ sản phẩm thành công",
          newSession: auth.newSession,
        },
      );
    }

    const id = searchParams.get("id");
    if (!id) {
      return fail("MISSING_ID", 400, "Thiếu ID sản phẩm cần xóa");
    }

    const { error } = await supabaseAdmin!
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase Product Delete Error:", error);
      return fail("DB_ERROR", 500, error.message);
    }

    return ok(
      {},
      { message: "Đã xóa sản phẩm thành công", newSession: auth.newSession },
    );
  },
);
