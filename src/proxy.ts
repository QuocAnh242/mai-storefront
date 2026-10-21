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
    const adminSession = request.cookies.get('mkt_admin_logged_in')?.value;

    let isAuthenticated = false;

    // Check Supabase JWT Access Token if present
    if (accessToken && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.getUser(accessToken);
        if (!error && data?.user) {
          isAuthenticated = true;
        }
      } catch (err) {
        console.error('JWT Token Validation Error:', err);
      }
    }

    // Fallback: Check HttpOnly adminSession cookie
    if (!isAuthenticated && adminSession === 'true') {
      isAuthenticated = true;
    }

    // If unauthenticated, redirect to /admin/login
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Protect Admin Upload API (/api/upload)
  if (pathname.startsWith('/api/upload')) {
    const accessToken = request.cookies.get('sb-access-token')?.value;
    const adminSession = request.cookies.get('mkt_admin_logged_in')?.value;

    if (!accessToken && adminSession !== 'true') {
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
    '/((?!_next/static|_next/image|favicon.ico|logo.jpg).*)',
  ],
};
