import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. Enforce Production Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // 2. Protect Admin Routes (/admin/* except /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const accessToken = request.cookies.get('sb-access-token')?.value;
    const refreshToken = request.cookies.get('sb-refresh-token')?.value;

    let isAuthenticated = false;
    let refreshedSession: { access_token: string; refresh_token: string; expires_in?: number } | null = null;

    // A. Verify Supabase JWT Access Token
    if (accessToken && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.getUser(accessToken);
        if (!error && data?.user) {
          isAuthenticated = true;
        }
      } catch (err) {
        console.warn('JWT Token Validation Error in Proxy:', err);
      }
    }

    // B. Auto-refresh session if access token is missing or expired but refresh token exists
    if (!isAuthenticated && refreshToken && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
        if (!error && data?.session) {
          isAuthenticated = true;
          refreshedSession = {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_in: data.session.expires_in,
          };
        }
      } catch (err) {
        console.warn('Session Refresh Error in Proxy:', err);
      }
    }

    // C. If completely unauthenticated, redirect to /admin/login
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // D. Persist refreshed session cookies if refreshed
    if (refreshedSession) {
      response.cookies.set('sb-access-token', refreshedSession.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: refreshedSession.expires_in || 86400,
      });

      response.cookies.set('sb-refresh-token', refreshedSession.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 86400,
      });

      response.cookies.set('mkt_admin_logged_in', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 86400,
      });
    }
  }

  // 3. Protect Admin Upload API (/api/upload) — full auth check is in route.ts
  if (pathname.startsWith('/api/upload')) {
    const accessToken = request.cookies.get('sb-access-token')?.value;
    if (!accessToken) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Yêu cầu quyền Quản trị viên (Admin) để tải ảnh' },
        { status: 401 }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logo.jpg|logo2.jpeg).*)',
  ],
};
