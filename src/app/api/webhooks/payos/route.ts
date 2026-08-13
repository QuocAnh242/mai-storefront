import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('PayOS Webhook received payload:', body);

    const { code, data, signature } = body;
    const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

    // 1. Verify HMAC Signature if checksumKey is configured
    if (checksumKey && signature) {
      const isValid = verifyPayOSSignature(data || {}, signature, checksumKey);
      if (!isValid) {
        console.warn('Unauthorized PayOS Webhook attempt: Invalid HMAC Signature!');
        return NextResponse.json({ error: 'UNAUTHORIZED_SIGNATURE_MISMATCH' }, { status: 401 });
      }
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
          console.error('Error updating order status in Supabase:', error);
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }
      }

      return NextResponse.json({
        success: true,
        message: `Order ${orderCode} marked as PAID successfully!`,
      });
    }

    return NextResponse.json({ success: true, message: 'Webhook received' });
  } catch (error) {
    console.error('PayOS Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
