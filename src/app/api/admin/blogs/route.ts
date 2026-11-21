import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rateLimit';
import { verifyAdminAuth, applySessionCookies } from '@/lib/adminAuth';

// POST: Tạo bài viết mới
export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateLimit = checkRateLimit(`adm_blog_create_${clientIp}`, 60, 60);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'RATE_LIMIT_EXCEEDED', message: 'Thao tác quá nhanh, vui lòng thử lại sau.' }, { status: 429 });
    }

    const authResult = await verifyAdminAuth(req);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Yêu cầu quyền Quản trị viên' }, { status: 401 });
    }

    if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
      return NextResponse.json(
        { error: 'Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY trên server' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      id,
      title,
      slug,
      category,
      thumbnail,
      summary,
      content,
      sections,
      author,
      isPublished,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Tiêu đề bài viết không được để trống' }, { status: 400 });
    }

    const blogId = id || `blog-${Date.now()}`;
    const insertPayload = {
      id: blogId,
      title: title.trim(),
      slug: slug || blogId,
      category: category || 'Mẹo hay',
      thumbnail: thumbnail || null,
      summary: summary || '',
      content: content || '',
      sections: Array.isArray(sections) ? sections : [],
      author: author || 'Chị Mai Kim Tuyến',
      is_published: isPublished !== undefined ? Boolean(isPublished) : true,
    };

    const { data, error } = await supabaseAdmin
      .from('blogs')
      .insert([insertPayload])
      .select()
      .single();

    if (error) {
      console.error('Supabase Blog Insert Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response = NextResponse.json({
      success: true,
      message: 'Tạo bài viết thành công',
      data,
    });
    return applySessionCookies(response, authResult.newSession);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Cập nhật bài viết
export async function PATCH(req: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(req);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Yêu cầu quyền Quản trị viên' }, { status: 401 });
    }

    if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
      return NextResponse.json(
        { error: 'Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY trên server' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { id, ...updatedFields } = body;

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID bài viết' }, { status: 400 });
    }

    const dbPayload: Record<string, any> = {};
    if (updatedFields.title !== undefined) dbPayload.title = updatedFields.title.trim();
    if (updatedFields.slug !== undefined) dbPayload.slug = updatedFields.slug;
    if (updatedFields.category !== undefined) dbPayload.category = updatedFields.category;
    if (updatedFields.thumbnail !== undefined) dbPayload.thumbnail = updatedFields.thumbnail;
    if (updatedFields.summary !== undefined) dbPayload.summary = updatedFields.summary;
    if (updatedFields.content !== undefined) dbPayload.content = updatedFields.content;
    if (updatedFields.sections !== undefined) dbPayload.sections = updatedFields.sections;
    if (updatedFields.author !== undefined) dbPayload.author = updatedFields.author;
    if (updatedFields.isPublished !== undefined) dbPayload.is_published = Boolean(updatedFields.isPublished);

    const { data, error } = await supabaseAdmin
      .from('blogs')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Supabase Blog Update Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Không tìm thấy bài viết để cập nhật' }, { status: 404 });
    }

    const response = NextResponse.json({
      success: true,
      message: 'Cập nhật bài viết thành công',
      data,
    });
    return applySessionCookies(response, authResult.newSession);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Xóa bài viết
export async function DELETE(req: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(req);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Yêu cầu quyền Quản trị viên' }, { status: 401 });
    }

    if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
      return NextResponse.json(
        { error: 'Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY trên server' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID bài viết cần xóa' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase Blog Delete Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response = NextResponse.json({
      success: true,
      message: 'Đã xóa bài viết thành công',
    });
    return applySessionCookies(response, authResult.newSession);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
