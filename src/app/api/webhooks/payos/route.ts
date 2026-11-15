import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rateLimit';

/**
 * Verify HMAC SHA256 signature from PayOS webhook payload
 */
function verifyPayOSSignature(data: Record<string, any>, signature: string, checksumKey: string): boolean {
  if (!signature || !checksumKey) return false;

  // Sort keys alphabetically
  const sortedKeys = Object.keys(data).sort();
  const dataStr = sortedKeys.map((key) => `${key}=${data[key] ?? ''}`).join('&');

  const computedSignature = crypto
    .createHmac('sha256', checksumKey)
    .update(dataStr)
    .digest('hex');

  return computedSignature === signature;
}

export async function POST(req: NextRequest) {
  try {
    // 0. IP Rate Limiting: Max 60 requests per minute
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateLimit = checkRateLimit(`payos_webhook_${clientIp}`, 60, 60);

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
        const { error } = await supabase
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
  } catch (error: any) {
    console.error('PayOS Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
