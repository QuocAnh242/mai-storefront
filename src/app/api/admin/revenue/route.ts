import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase';
import { withAdminRoute, ok, fail } from '@/lib/api/withAdminRoute';
import { generateEntityId } from '@/lib/ids';

// GET: Fetch external revenue records (manual_revenues)
export const GET = withAdminRoute(
  {
    rateLimit: { key: 'adm_rev_list', limit: 60, windowSeconds: 60 },
    requireServiceRole: false,
  },
  async ({ auth }) => {
    // Return an empty list when the service role key is not configured
    if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
      return ok({ data: [] });
    }

    const { data, error } = await supabaseAdmin
      .from('manual_revenues')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Supabase Manual Revenues Get Error:', error);
      return fail(error.message, 500);
    }

    return ok(
      {
        data: (data || []).map((item: { id: string; amount: number | string; date: string; source: string; note?: string | null; created_at: string }) => ({
          id: item.id,
          amount: Number(item.amount),
          date: item.date,
          source: item.source,
          note: item.note || '',
          createdAt: item.created_at,
        })),
      },
      { newSession: auth.newSession },
    );
  },
);

// POST: Create a new external revenue record
export const POST = withAdminRoute(
  {},
  async ({ req, auth }) => {
    const body = await req.json();
    const { amount, date, source, note } = body;

    if (!amount || Number(amount) <= 0 || !date) {
      return fail('Số tiền và ngày ghi nhận không hợp lệ', 400);
    }

    const newId = generateEntityId('rev');
    const insertPayload = {
      id: newId,
      amount: Number(amount),
      date: date.trim(),
      source: (source || 'Bán tại kho').trim(),
      note: (note || '').trim(),
    };

    const { data, error } = await supabaseAdmin!
      .from('manual_revenues')
      .insert([insertPayload])
      .select()
      .single();

    if (error) {
      console.error('Supabase Manual Revenue Insert Error:', error);
      return fail(error.message, 500);
    }

    return ok({ data }, { message: 'Ghi nhận doanh thu thành công', newSession: auth.newSession });
  },
);

// DELETE: Remove an external revenue record
export const DELETE = withAdminRoute(
  {},
  async ({ req, auth }) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return fail('Thiếu ID doanh thu cần xóa', 400);
    }

    const { error } = await supabaseAdmin!
      .from('manual_revenues')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase Manual Revenue Delete Error:', error);
      return fail(error.message, 500);
    }

    return ok({}, { message: 'Đã xóa bản ghi doanh thu thành công', newSession: auth.newSession });
  },
);
