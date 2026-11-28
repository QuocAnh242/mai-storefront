import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { enforceRateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting: Max 30 requests per minute
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateLimit = await enforceRateLimit(`logout_${clientIp}`, 30, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT_EXCEEDED', message: 'Quá nhiều yêu cầu đăng xuất' },
        { status: 429 }
      );
    }

    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }

    const response = NextResponse.json({ success: true, message: 'Đã đăng xuất' });

    // Clear HttpOnly auth cookies
    response.cookies.set('sb-access-token', '', { path: '/', maxAge: 0 });
    response.cookies.set('sb-refresh-token', '', { path: '/', maxAge: 0 });
    response.cookies.set('mkt_admin_logged_in', '', { path: '/', maxAge: 0 });

    return response;
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Logout failed' }, { status: 500 });
  }
}
