import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rateLimit';

const LoginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});

export async function POST(req: Request) {
  try {
    // 1. IP Rate Limit: Max 15 login attempts per IP per 60 seconds
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const rateLimit = checkRateLimit(`login_${clientIp}`, 15, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'RATE_LIMIT_EXCEEDED',
          message: `Bạn đã thử đăng nhập quá 15 lần. Vui lòng đợi ${rateLimit.resetSeconds} giây!`,
        },
        { status: 429 }
      );
    }

    // 2. Validate Payload
    const body = await req.json();
    const parseResult = LoginSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'INVALID_PAYLOAD', message: 'Tài khoản hoặc mật khẩu không hợp lệ' },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;

    // 3. Supabase Auth JWT Verification
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'SUPABASE_NOT_CONFIGURED', message: 'Hệ thống Supabase chưa được cấu hình biến môi trường' },
        { status: 500 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Tài khoản hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    const { access_token, refresh_token, expires_in } = data.session;

    // 4. Create Response with HttpOnly JWT Cookies
    const response = NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
      },
    });

    // Set HttpOnly, Secure, SameSite=Strict Cookies for JWT Session
    response.cookies.set('sb-access-token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: expires_in || 86400,
    });

    response.cookies.set('sb-refresh-token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 86400,
    });

    // Also set legacy admin indicator for compatibility
    response.cookies.set('mkt_admin_logged_in', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: expires_in || 86400,
    });

    return response;
  } catch (error: any) {
    console.error('Server Auth Error:', error);
    return NextResponse.json({ error: 'SERVER_ERROR', message: error.message }, { status: 500 });
  }
}
