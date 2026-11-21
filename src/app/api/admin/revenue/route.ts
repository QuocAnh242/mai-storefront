import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rateLimit';
import { verifyAdminAuth, applySessionCookies } from '@/lib/adminAuth';

// GET: Lấy danh sách doanh thu ngoài (manual_revenues)
export async function GET(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateLimit = checkRateLimit(`adm_rev_list_${clientIp}`, 60, 60);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'RATE_LIMIT_EXCEEDED', message: 'Thao tác quá nhanh, vui lòng thử lại sau.' }, { status: 429 });
    }

    const authResult = await verifyAdminAuth(req);
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Yêu cầu quyền Quản trị viên' }, { status: 401 });
    }

    if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
      return NextResponse.json({ success: true, data: [] });
    }

    const { data, error } = await supabaseAdmin
      .from('manual_revenues')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Supabase Manual Revenues Get Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response = NextResponse.json({
      success: true,
      data: (data || []).map((item: any) => ({
        id: item.id,
        amount: Number(item.amount),
        date: item.date,
        source: item.source,
        note: item.note || '',
        createdAt: item.created_at,
      })),
    });
    return applySessionCookies(response, authResult.newSession);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Thêm mới bản ghi doanh thu ngoài
export async function POST(req: NextRequest) {
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
    const { amount, date, source, note } = body;

    if (!amount || Number(amount) <= 0 || !date) {
      return NextResponse.json({ error: 'Số tiền và ngày ghi nhận không hợp lệ' }, { status: 400 });
    }

    const newId = `rev-${Date.now()}`;
    const insertPayload = {
      id: newId,
      amount: Number(amount),
      date: date.trim(),
      source: (source || 'Bán tại kho').trim(),
      note: (note || '').trim(),
    };

    const { data, error } = await supabaseAdmin
      .from('manual_revenues')
      .insert([insertPayload])
      .select()
      .single();

    if (error) {
      console.error('Supabase Manual Revenue Insert Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response = NextResponse.json({
      success: true,
      message: 'Ghi nhận doanh thu thành công',
      data,
    });
    return applySessionCookies(response, authResult.newSession);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Xóa bản ghi doanh thu ngoài
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
      return NextResponse.json({ error: 'Thiếu ID doanh thu cần xóa' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('manual_revenues')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase Manual Revenue Delete Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response = NextResponse.json({
      success: true,
      message: 'Đã xóa bản ghi doanh thu thành công',
    });
    return applySessionCookies(response, authResult.newSession);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
