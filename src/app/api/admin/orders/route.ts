import { supabaseAdmin } from '@/lib/supabase';
import { withAdminRoute, ok, fail } from '@/lib/api/withAdminRoute';

// GET: Fetch orders with server-driven pagination and status filter
export const GET = withAdminRoute(
  { rateLimit: { key: 'adm_ord_get', limit: 120, windowSeconds: 60 }, requireServiceRole: false },
  async ({ req, auth }) => {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSizeParam = searchParams.get('pageSize');
    const isAll = pageSizeParam === 'all' || !searchParams.has('page');
    const pageSize = isAll ? 500 : Math.max(1, Math.min(100, parseInt(pageSizeParam || '20', 10)));
    const status = searchParams.get('status')?.trim();
    const q = searchParams.get('q')?.trim();

    let query = supabaseAdmin!
      .from('orders')
      .select('*', { count: 'exact' });

    if (status && status !== 'all') {
      query = query.eq('payment_status', status);
    }

    if (q) {
      query = query.or(`order_code.ilike.%${q}%,customer_name.ilike.%${q}%,customer_phone.ilike.%${q}%`);
    }

    query = query.order('created_at', { ascending: false });

    if (!isAll) {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
    }

    const { data, count, error } = await query;
    if (error) {
      console.error('Supabase Orders Fetch Error:', error);
      return fail(error.message, 500);
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

// PATCH: Update order payment status (paid / pending / failed)
export const PATCH = withAdminRoute(
  { rateLimit: { key: 'adm_ord_patch', limit: 60, windowSeconds: 60 } },
  async ({ req, auth }) => {
    const body = await req.json();
    const { orderCode, status } = body;

    if (!orderCode) {
      return fail('Thiếu mã đơn hàng', 400);
    }

    const updatePayload: Record<string, unknown> = {
      payment_status: status,
    };
    if (status === 'paid') {
      updatePayload.paid_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin!
      .from('orders')
      .update(updatePayload)
      .eq('order_code', orderCode)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Supabase Order Update Error:', error);
      return fail(error.message, 500);
    }

    return ok({ data }, { message: 'Cập nhật trạng thái đơn hàng thành công', newSession: auth.newSession });
  },
);

// DELETE: Remove an unpaid order
export const DELETE = withAdminRoute(
  {},
  async ({ req, auth }) => {
    const { searchParams } = new URL(req.url);
    const orderCode = searchParams.get('orderCode');

    if (!orderCode) {
      return fail('Thiếu mã đơn hàng cần xóa', 400);
    }

    // Reject deletion of paid orders
    const { data: existingOrder } = await supabaseAdmin!
      .from('orders')
      .select('payment_status')
      .eq('order_code', orderCode)
      .maybeSingle();

    if (existingOrder && existingOrder.payment_status === 'paid') {
      return fail('Không thể xóa đơn hàng đã thanh toán', 400);
    }

    const { error } = await supabaseAdmin!
      .from('orders')
      .delete()
      .eq('order_code', orderCode);

    if (error) {
      console.error('Supabase Order Delete Error:', error);
      return fail(error.message, 500);
    }

    return ok({}, { message: `Đã xóa đơn ${orderCode} thành công`, newSession: auth.newSession });
  },
);
