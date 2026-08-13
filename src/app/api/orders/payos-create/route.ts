import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeText } from '@/lib/sanitizer';

// Input Payload Validation Schema
const CreateOrderSchema = z.object({
  orderCode: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
  amount: z.number().min(1000, 'Số tiền tối thiểu 1.000đ'),
  description: z.string().max(250).optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  returnUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export async function POST(req: Request) {
  try {
    // 1. IP Rate Limiting (Strictly Max 3 order attempts per IP per hour)
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const rateLimit = checkRateLimit(`create_order_${clientIp}`, 3, 3600);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'RATE_LIMIT_EXCEEDED',
          message: `Bạn đã vượt quá giới hạn 3 lần tạo đơn hàng / giờ. Vui lòng thử lại sau ${rateLimit.resetSeconds} giây.`,
        },
        { status: 429 }
      );
    }

    // 2. Validate Payload
    const body = await req.json();
    const parseResult = CreateOrderSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'INVALID_PAYLOAD', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { orderCode, amount, description, cancelUrl, returnUrl } = parseResult.data;
    const cleanDescription = sanitizeText(description || `Thanh toan don #${orderCode}`);

    const clientId = process.env.PAYOS_CLIENT_ID;
    const apiKey = process.env.PAYOS_API_KEY;
    const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

    if (!clientId || !apiKey || !checksumKey) {
      return NextResponse.json({
        mock: true,
        message: 'PayOS API keys not provided in env. Using VietQR mode.',
      });
    }

    // 3. Call PayOS Create Payment Link Endpoint
    const payosRes = await fetch('https://api-merchant.payos.vn/v2/payment-requests', {
      method: 'POST',
      headers: {
        'x-client-id': clientId,
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderCode,
        amount,
        description: cleanDescription,
        cancelUrl,
        returnUrl,
      }),
    });

    const data = await payosRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('PayOS Create Link Error:', error);
    return NextResponse.json({ error: 'Failed to create PayOS link', message: error.message }, { status: 500 });
  }
}
