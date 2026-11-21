import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rateLimit';
import { verifyAdminAuth, applySessionCookies } from '@/lib/adminAuth';

// POST: Tạo sản phẩm mới
export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateLimit = checkRateLimit(`adm_prod_create_${clientIp}`, 60, 60);
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

    if (!title || !categoryId) {
      return NextResponse.json({ error: 'Thiếu tên sản phẩm hoặc danh mục' }, { status: 400 });
    }

    const prodId = id || `p-${Date.now()}`;
    const insertPayload = {
      id: prodId,
      title: title.trim(),
      slug: slug || prodId,
      price: isContactPrice ? 0 : Number(price) || 0,
      original_price: originalPrice ? Number(originalPrice) : null,
      unit: unit || 'Kg',
      description: description || '',
      category_id: categoryId,
      category_name: categoryName || 'Chưa phân loại',
      subcategory_id: subcategoryId || null,
      subcategory_name: subcategoryName || null,
      images: Array.isArray(images) ? images : [],
      is_featured: Boolean(isFeatured),
      display_order: Number(displayOrder) || 99,
      in_stock: inStock !== undefined ? Boolean(inStock) : true,
      specs: specs || {},
    };

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([insertPayload])
      .select()
      .single();

    if (error) {
      console.error('Supabase Product Insert Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response = NextResponse.json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data,
    });
    return applySessionCookies(response, authResult.newSession);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH / PUT: Cập nhật sản phẩm
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
      return NextResponse.json({ error: 'Thiếu ID sản phẩm' }, { status: 400 });
    }

    const dbPayload: Record<string, any> = {};
    if (updatedFields.title !== undefined) dbPayload.title = updatedFields.title.trim();
    if (updatedFields.slug !== undefined) dbPayload.slug = updatedFields.slug;
    if (updatedFields.price !== undefined) dbPayload.price = Number(updatedFields.price);
    if (updatedFields.isContactPrice !== undefined && updatedFields.isContactPrice) dbPayload.price = 0;
    if (updatedFields.originalPrice !== undefined) dbPayload.original_price = updatedFields.originalPrice ? Number(updatedFields.originalPrice) : null;
    if (updatedFields.unit !== undefined) dbPayload.unit = updatedFields.unit;
    if (updatedFields.description !== undefined) dbPayload.description = updatedFields.description;
    if (updatedFields.categoryId !== undefined) dbPayload.category_id = updatedFields.categoryId;
    if (updatedFields.categoryName !== undefined) dbPayload.category_name = updatedFields.categoryName;
    if (updatedFields.subcategoryId !== undefined) dbPayload.subcategory_id = updatedFields.subcategoryId || null;
    if (updatedFields.subcategoryName !== undefined) dbPayload.subcategory_name = updatedFields.subcategoryName || null;
    if (updatedFields.images !== undefined) dbPayload.images = updatedFields.images;
    if (updatedFields.isFeatured !== undefined) dbPayload.is_featured = Boolean(updatedFields.isFeatured);
    if (updatedFields.displayOrder !== undefined) dbPayload.display_order = Number(updatedFields.displayOrder);
    if (updatedFields.inStock !== undefined) dbPayload.in_stock = Boolean(updatedFields.inStock);
    if (updatedFields.specs !== undefined) dbPayload.specs = updatedFields.specs;

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase Product Update Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response = NextResponse.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data,
    });
    return applySessionCookies(response, authResult.newSession);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Xóa sản phẩm
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
      return NextResponse.json({ error: 'Thiếu ID sản phẩm cần xóa' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase Product Delete Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response = NextResponse.json({
      success: true,
      message: 'Đã xóa sản phẩm thành công',
    });
    return applySessionCookies(response, authResult.newSession);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
