import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rateLimit';
import { verifyAdminAuth, applySessionCookies } from '@/lib/adminAuth';

// POST: Tạo danh mục mới hoặc danh mục con
export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateLimit = checkRateLimit(`adm_cat_create_${clientIp}`, 60, 60);
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
    const { id, name, slug, description, parentId, subcategories } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Tên danh mục không được để trống' }, { status: 400 });
    }

    const catId = id || `cat-${Date.now()}`;
    const insertPayload = {
      id: catId,
      name: name.trim(),
      slug: slug || catId,
      description: description ? description.trim() : null,
      parent_id: parentId || null,
    };

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert([insertPayload])
      .select()
      .single();

    if (error) {
      console.error('Supabase Category Insert Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Nếu có mảng subcategories đi kèm, insert các subcategory
    if (Array.isArray(subcategories) && subcategories.length > 0) {
      const subInserts = subcategories.map((sub: any) => ({
        id: sub.id || `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: sub.name?.trim() || 'Danh mục con',
        slug: sub.slug || `sub-${Date.now()}`,
        parent_id: catId,
      }));

      await supabaseAdmin.from('categories').insert(subInserts);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Tạo danh mục thành công',
      data,
    });
    return applySessionCookies(response, authResult.newSession);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Cập nhật thông tin danh mục hoặc danh sách subcategories
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
    const { id, name, slug, description, subcategories } = body;

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID danh mục' }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {};
    if (name !== undefined) updatePayload.name = name.trim();
    if (slug !== undefined) updatePayload.slug = slug;
    if (description !== undefined) updatePayload.description = description ? description.trim() : null;

    let updatedCat = null;
    if (Object.keys(updatePayload).length > 0) {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase Category Update Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      updatedCat = data;
    }

    // Nếu có cập nhật danh sách subcategories
    if (Array.isArray(subcategories)) {
      // 1. Lấy danh sách subcategories hiện tại trong DB của category này
      const { data: existingSubs } = await supabaseAdmin
        .from('categories')
        .select('id')
        .eq('parent_id', id);

      const existingIds = new Set((existingSubs || []).map((s) => s.id));
      const newIds = new Set(subcategories.map((s) => s.id));

      // 2. Xóa các subcategories không còn trong danh sách
      const toDelete = Array.from(existingIds).filter((existingId) => !newIds.has(existingId));
      if (toDelete.length > 0) {
        await supabaseAdmin.from('categories').delete().in('id', toDelete);
      }

      // 3. Upsert các subcategories mới hoặc đã sửa
      for (const sub of subcategories) {
        const subId = sub.id || `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        await supabaseAdmin.from('categories').upsert({
          id: subId,
          name: sub.name?.trim() || '',
          slug: sub.slug || subId,
          parent_id: id,
        });
      }
    }

    const response = NextResponse.json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      data: updatedCat,
    });
    return applySessionCookies(response, authResult.newSession);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Xóa danh mục (hoặc subcategory)
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
      return NextResponse.json({ error: 'Thiếu ID danh mục cần xóa' }, { status: 400 });
    }

    // Xóa tất cả subcategories thuộc category này trước (nếu có)
    await supabaseAdmin.from('categories').delete().eq('parent_id', id);

    // Xóa category chính
    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase Category Delete Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response = NextResponse.json({
      success: true,
      message: 'Đã xóa danh mục thành công',
    });
    return applySessionCookies(response, authResult.newSession);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
