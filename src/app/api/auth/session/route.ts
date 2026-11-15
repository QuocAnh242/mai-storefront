import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkRateLimit } from '@/lib/rateLimit';

/**
 * Endpoint to sync the active Supabase session to the client-side JavaScript SDK
 * Reads the HttpOnly auth cookies and returns the active session tokens.
 */
export async function GET(req: NextRequest) {
  try {
    // 1. IP Rate Limiting: Max 60 requests per minute
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateLimit = checkRateLimit(`session_${clientIp}`, 60, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT_EXCEEDED', message: 'Quá nhiều yêu cầu kiểm tra phiên đăng nhập' },
        { status: 429 }
      );
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;
    const refreshToken = cookieStore.get('sb-refresh-token')?.value;

    if (!accessToken) {
      return NextResponse.json({ session: null });
    }

    return NextResponse.json({
      session: {
        access_token: accessToken,
        refresh_token: refreshToken || '',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ session: null, error: error.message }, { status: 500 });
  }
}
