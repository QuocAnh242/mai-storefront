import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin, isSupabaseConfigured, isSupabaseAdminConfigured } from '@/lib/supabase';
import { enforceRateLimit } from '@/lib/rateLimit';
import { verifyPayOSSignature } from '@/lib/payosSignature';

export async function POST(req: NextRequest) {
  try {
    // 0. IP Rate Limiting: Max 60 requests per minute
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateLimit = await enforceRateLimit(`payos_webhook_${clientIp}`, 60, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT_EXCEEDED', message: 'Quá nhiều yêu cầu webhook' },
        { status: 429 }
      );
    }

    const body = await req.json();

    const { code, data, signature } = body;
    const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

    // 1. Verify HMAC Signature — REQUIRED, reject if key not configured or signature missing
    if (!checksumKey) {
      console.error('PAYOS_CHECKSUM_KEY not configured — webhook rejected for security.');
      return NextResponse.json({ error: 'SERVER_MISCONFIGURED' }, { status: 500 });
    }
    if (!signature) {
      console.warn('PayOS Webhook missing signature — rejected.');
      return NextResponse.json({ error: 'MISSING_SIGNATURE' }, { status: 401 });
    }
    const isValid = verifyPayOSSignature(data || {}, signature, checksumKey);
    if (!isValid) {
      console.warn('Unauthorized PayOS Webhook attempt: Invalid HMAC Signature!');
      return NextResponse.json({ error: 'UNAUTHORIZED_SIGNATURE_MISMATCH' }, { status: 401 });
    }

    // 2. Check code === "00" (PayOS success response)
    if (code === '00' && data) {
      const orderCodeNum = data.orderCode;
      const orderCode = `MKT${orderCodeNum}`;

      console.log(`PayOS confirmed payment for order: ${orderCode}`);

      if (isSupabaseConfigured()) {
        const client = (isSupabaseAdminConfigured() && supabaseAdmin) ? supabaseAdmin : supabase;

        // 3. Amount verification + idempotency: fetch the order before updating.
        //    Reject when the paid amount does not match the stored total, and
        //    skip the update entirely when the order is already marked paid.
        const { data: order, error: fetchError } = await client
          .from('orders')
          .select('id, total_amount, payment_status')
          .eq('order_code', orderCode)
          .maybeSingle();

        if (fetchError) {
          console.error('Failed to fetch order for webhook verification:', fetchError);
          return NextResponse.json({ error: 'DB_FETCH_FAILED' }, { status: 500 });
        }

        if (!order) {
          console.warn(`PayOS webhook: order ${orderCode} not found — ignored.`);
          return NextResponse.json({ success: true, message: 'Order not found — ignored' });
        }

        if (Number(data.amount) !== Number(order.total_amount)) {
          console.error(
            `PayOS webhook amount mismatch for ${orderCode}: expected ${order.total_amount}, got ${data.amount} — rejected.`,
          );
          return NextResponse.json({ error: 'AMOUNT_MISMATCH' }, { status: 400 });
        }

        if (order.payment_status === 'paid') {
          // Idempotency: duplicate webhook for an already-paid order — acknowledge without re-updating.
          return NextResponse.json({ success: true, message: 'Order already paid' });
        }

        const { error } = await client
          .from('orders')
          .update({
            payment_status: 'paid',
            paid_at: new Date().toISOString(),
          })
          .eq('order_code', orderCode);

        if (error) {
          console.error('Failed to update order payment status in Supabase:', error);
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Webhook processed' });
  } catch (error: unknown) {
    console.error('PayOS Webhook error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Webhook failed' }, { status: 500 });
  }
}
