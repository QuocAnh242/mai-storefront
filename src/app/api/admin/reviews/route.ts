import {
  supabase,
  supabaseAdmin,
  isSupabaseConfigured,
  isSupabaseAdminConfigured,
} from "@/lib/supabase";
import { withAdminRoute, ok, fail } from "@/lib/api/withAdminRoute";
import { sanitizeText } from "@/lib/sanitizer";

// GET: Fetch all reviews for admin management with optional pagination and filters
export const GET = withAdminRoute(
  {
    rateLimit: { key: "adm_rev_get", limit: 300, windowSeconds: 60 },
    requireServiceRole: false,
  },
  async ({ req, auth }) => {
    if (!isSupabaseConfigured()) {
      return ok(
        {
          data: [],
          total: 0,
          page: 1,
          pageSize: 20,
          totalPages: 1,
          stats: { total: 0, avg: 5.0, replied: 0, unreplied: 0 },
        },
        { newSession: auth.newSession },
      );
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSizeParam = searchParams.get("pageSize");
    const isAll = pageSizeParam === "all" || !searchParams.has("page");
    const pageSize = isAll
      ? 500
      : Math.max(1, Math.min(100, parseInt(pageSizeParam || "20", 10)));
    const status = searchParams.get("status")?.trim();
    const q = searchParams.get("q")?.trim();

    const client =
      isSupabaseAdminConfigured() && supabaseAdmin ? supabaseAdmin : supabase;

    let query = client
      .from("product_reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      if (status === "approved") query = query.eq("is_approved", true);
      else if (status === "pending") query = query.is("is_approved", null);
      else if (status === "hidden") query = query.eq("is_approved", false);
    }

    if (q) {
      query = query.or(
        `author_name.ilike.%${q}%,content.ilike.%${q}%,product_id.ilike.%${q}%`,
      );
    }

    const { data, error } = await query;

    if (error) {
      if (
        error.code === "PGRST205" ||
        error.message?.includes("not find the table") ||
        error.message?.includes("does not exist")
      ) {
        return ok(
          {
            data: [],
            total: 0,
            page: 1,
            pageSize: 20,
            totalPages: 1,
            stats: { total: 0, avg: 5.0, replied: 0, unreplied: 0 },
            requiresTableSetup: true,
          },
          { newSession: auth.newSession },
        );
      }
      return fail(error.message, 500);
    }

    const allReviews = (data || []).map((r) => ({
      id: r.id,
      productId: r.product_id,
      authorName: r.author_name,
      rating: r.rating,
      content: r.content,
      isApproved: r.is_approved,
      replyContent: r.reply_content || undefined,
      repliedAt: r.replied_at || undefined,
      createdAt: r.created_at,
    }));

    const total = allReviews.length;
    const replied = allReviews.filter((r) => Boolean(r.replyContent)).length;
    const unreplied = total - replied;
    const avg =
      total > 0
        ? Number(
            (allReviews.reduce((acc, c) => acc + c.rating, 0) / total).toFixed(
              1,
            ),
          )
        : 5.0;

    let paginatedData = allReviews;
    if (!isAll) {
      const from = (page - 1) * pageSize;
      paginatedData = allReviews.slice(from, from + pageSize);
    }
    const totalPages = isAll ? 1 : Math.max(1, Math.ceil(total / pageSize));

    return ok(
      {
        data: paginatedData,
        total,
        page: isAll ? 1 : page,
        pageSize: isAll ? total : pageSize,
        totalPages,
        stats: { total, avg, replied, unreplied },
      },
      { newSession: auth.newSession },
    );
  },
);

// PATCH: Reply to customer, edit content, or approve/hide a review
export const PATCH = withAdminRoute(
  {
    rateLimit: { key: "adm_rev_patch", limit: 40, windowSeconds: 60 },
    requireServiceRole: false,
  },
  async ({ req, auth }) => {
    const body = await req.json();
    const { action, id } = body;

    if (!id) {
      return fail("Thiếu review ID", 400);
    }

    const UUID_REGEX =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!UUID_REGEX.test(id)) {
      return fail("ID đánh giá không hợp lệ (cần định dạng UUID)", 400);
    }

    const client =
      isSupabaseAdminConfigured() && supabaseAdmin ? supabaseAdmin : supabase;

    // 1. Reply to customer
    if (action === "reply") {
      const replyContent = sanitizeText((body.replyContent || "").trim());
      if (!replyContent) {
        return fail("Nội dung phản hồi không được để trống", 400);
      }

      const { data, error } = await client
        .from("product_reviews")
        .update({
          reply_content: replyContent,
          replied_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .maybeSingle();

      if (error) {
        return fail(error.message, 500);
      }

      if (!data) {
        return fail("Không tìm thấy đánh giá", 404);
      }

      return ok(
        { data },
        {
          message: "Đã gửi phản hồi đến khách hàng thành công",
          newSession: auth.newSession,
        },
      );
    }

    // 2. Edit review
    if (action === "edit") {
      const { authorName, rating, content } = body;
      const updatePayload: Record<string, any> = {};

      if (authorName)
        updatePayload.author_name = sanitizeText(authorName.trim());
      if (typeof rating === "number" && rating >= 1 && rating <= 5)
        updatePayload.rating = rating;
      if (content) updatePayload.content = sanitizeText(content.trim());

      const { data, error } = await client
        .from("product_reviews")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .maybeSingle();

      if (error) {
        return fail(error.message, 500);
      }

      if (!data) {
        return fail("Không tìm thấy đánh giá", 404);
      }

      return ok(
        { data },
        {
          message: "Đã cập nhật đánh giá thành công",
          newSession: auth.newSession,
        },
      );
    }

    // 3. Toggle review visibility
    if (action === "toggle_approve") {
      const { isApproved } = body;
      const { data, error } = await client
        .from("product_reviews")
        .update({ is_approved: Boolean(isApproved) })
        .eq("id", id)
        .select()
        .maybeSingle();

      if (error) {
        return fail(error.message, 500);
      }

      if (!data) {
        return fail("Không tìm thấy đánh giá", 404);
      }

      return ok(
        { data },
        {
          message: isApproved
            ? "Đã hiển thị đánh giá"
            : "Đã ẩn đánh giá khỏi trang sản phẩm",
          newSession: auth.newSession,
        },
      );
    }

    return fail("Hành động không hợp lệ", 400);
  },
);

// DELETE: Permanently remove a review
export const DELETE = withAdminRoute(
  { requireServiceRole: false },
  async ({ req, auth }) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return fail("Thiếu ID đánh giá cần xóa", 400);
    }

    const UUID_REGEX =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!UUID_REGEX.test(id)) {
      return fail("ID đánh giá không hợp lệ (cần định dạng UUID)", 400);
    }

    const client =
      isSupabaseAdminConfigured() && supabaseAdmin ? supabaseAdmin : supabase;

    const { error } = await client
      .from("product_reviews")
      .delete()
      .eq("id", id);

    if (error) {
      return fail(error.message, 500);
    }

    return ok(
      {},
      { message: "Đã xóa đánh giá thành công", newSession: auth.newSession },
    );
  },
);
