import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin, isSupabaseConfigured, isSupabaseAdminConfigured } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeText } from '@/lib/sanitizer';
import { verifyAdminAuth, applySessionCookies } from '@/lib/adminAuth';

// GET: Lấy tất cả đánh giá cho Admin quản lý
export async function GET(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateLimit = checkRateLimit(`adm_rev_get_${clientIp}`, 60, 60);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'RATE_LIMIT_EXCEEDED', message: 'Quá nhiều yêu cầu, vui lòng thử lại sau.' }, { status: 429 });
    }

    const authResult = await verifyAdminAuth(req);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Yêu cầu quyền Quản trị viên' }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return applySessionCookies(
        NextResponse.json({ success: true, data: [], stats: { total: 0, avg: 5.0, replied: 0, unreplied: 0 } }),
        authResult.newSession
      );
    }

    const client = (isSupabaseAdminConfigured() && supabaseAdmin) ? supabaseAdmin : supabase;

    const { data, error } = await client
      .from('product_reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('not find the table') || error.message?.includes('does not exist')) {
        return applySessionCookies(
          NextResponse.json({
            success: true,
            data: [],
            stats: { total: 0, avg: 5.0, replied: 0, unreplied: 0 },
            requiresTableSetup: true,
          }),
          authResult.newSession
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const reviews = (data || []).map((r) => ({
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

    const total = reviews.length;
    const replied = reviews.filter((r) => Boolean(r.replyContent)).length;
    const unreplied = total - replied;
    const avg = total > 0 ? Number((reviews.reduce((acc, c) => acc + c.rating, 0) / total).toFixed(1)) : 5.0;

    const response = NextResponse.json({
      success: true,
      data: reviews,
      stats: { total, avg, replied, unreplied },
    });

    return applySessionCookies(response, authResult.newSession);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Trả lời khách, sửa nội dung hoặc duyệt/ẩn đánh giá
export async function PATCH(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateLimit = checkRateLimit(`adm_rev_patch_${clientIp}`, 40, 60);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'RATE_LIMIT_EXCEEDED', message: 'Thao tác quá nhanh, vui lòng thử lại sau.' }, { status: 429 });
    }

    const authResult = await verifyAdminAuth(req);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Yêu cầu quyền Quản trị viên' }, { status: 401 });
    }

    const body = await req.json();
    const { action, id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Thiếu review ID' }, { status: 400 });
    }

    const client = (isSupabaseAdminConfigured() && supabaseAdmin) ? supabaseAdmin : supabase;

    // 1. Phản hồi khách hàng (Reply)
    if (action === 'reply') {
      const replyContent = sanitizeText((body.replyContent || '').trim());
      if (!replyContent) {
        return NextResponse.json({ error: 'Nội dung phản hồi không được để trống' }, { status: 400 });
      }

      const { data, error } = await client
        .from('product_reviews')
        .update({
          reply_content: replyContent,
          replied_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const response = NextResponse.json({
        success: true,
        message: 'Đã gửi phản hồi đến khách hàng thành công',
        data,
      });
      return applySessionCookies(response, authResult.newSession);
    }

    // 2. Chỉnh sửa review (Edit)
    if (action === 'edit') {
      const { authorName, rating, content } = body;
      const updatePayload: Record<string, any> = {};

      if (authorName) updatePayload.author_name = sanitizeText(authorName.trim());
      if (typeof rating === 'number' && rating >= 1 && rating <= 5) updatePayload.rating = rating;
      if (content) updatePayload.content = sanitizeText(content.trim());

      const { data, error } = await client
        .from('product_reviews')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const response = NextResponse.json({
        success: true,
        message: 'Đã cập nhật đánh giá thành công',
        data,
      });
      return applySessionCookies(response, authResult.newSession);
    }

    // 3. Ẩn / Hiện đánh giá (Toggle Approve)
    if (action === 'toggle_approve') {
      const { isApproved } = body;
      const { data, error } = await client
        .from('product_reviews')
        .update({ is_approved: Boolean(isApproved) })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const response = NextResponse.json({
        success: true,
        message: isApproved ? 'Đã hiển thị đánh giá' : 'Đã ẩn đánh giá khỏi trang sản phẩm',
        data,
      });
      return applySessionCookies(response, authResult.newSession);
    }

    return NextResponse.json({ error: 'Hành động không hợp lệ' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Xóa vĩnh viễn đánh giá
export async function DELETE(req: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(req);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Yêu cầu quyền Quản trị viên' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID đánh giá cần xóa' }, { status: 400 });
    }

    const client = (isSupabaseAdminConfigured() && supabaseAdmin) ? supabaseAdmin : supabase;

    const { error } = await client
      .from('product_reviews')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response = NextResponse.json({
      success: true,
      message: 'Đã xóa đánh giá thành công',
    });
    return applySessionCookies(response, authResult.newSession);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
