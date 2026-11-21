import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, isSupabaseAdminConfigured } from '@/lib/supabase';

export interface AdminAuthResult {
  authorized: boolean;
  newSession?: {
    access_token: string;
    refresh_token: string;
    expires_in?: number;
  };
}

/**
 * Xác thực phiên Quản trị viên đa tầng:
 * 1. Kiểm tra JWT token hiện tại qua `supabase.auth.getUser(accessToken)`.
 * 2. Tự động phục hồi phiên (auto-refresh) nếu access token hết hạn (> 1 giờ) bằng `refreshToken`.
 * 3. Fallback xác thực qua cookie HttpOnly `mkt_admin_logged_in` khi đã cấu hình Service Role Key.
 */
export async function verifyAdminAuth(req: NextRequest): Promise<AdminAuthResult> {
  const accessToken = req.cookies.get('sb-access-token')?.value;
  const refreshToken = req.cookies.get('sb-refresh-token')?.value;
  const loggedInCookie = req.cookies.get('mkt_admin_logged_in')?.value;

  // Hỗ trợ kiểm tra Authorization: Bearer <token> từ client fetch
  const authHeader = req.headers.get('authorization');
  let bearerToken: string | undefined = undefined;
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    bearerToken = authHeader.substring(7).trim();
  }

  const tokenToVerify = accessToken || bearerToken;

  if (!isSupabaseConfigured()) {
    return { authorized: true };
  }

  // 1. Thử xác thực trực tiếp bằng access token hoặc bearer token
  if (tokenToVerify) {
    try {
      const { data, error } = await supabase.auth.getUser(tokenToVerify);
      if (!error && data?.user) {
        return { authorized: true };
      }
    } catch (err) {
      console.warn('Verify admin token note:', err);
    }
  }

  // 2. Nếu access token thiếu hoặc đã hết hạn (JWT expired), tự động refresh phiên bằng refresh token
  if (refreshToken) {
    try {
      const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
      if (!error && data?.session) {
        return {
          authorized: true,
          newSession: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_in: data.session.expires_in,
          },
        };
      }
    } catch (refreshErr) {
      console.warn('Verify admin refresh session note:', refreshErr);
    }
  }

  // 3. Fallback: Nếu cookie quản trị viên hợp lệ và hệ thống có Service Role Key
  if (loggedInCookie === 'true' && isSupabaseAdminConfigured()) {
    return { authorized: true };
  }

  return { authorized: false };
}

/**
 * Gán cookie phiên mới vào NextResponse nếu có đợt làm mới phiên tự động
 */
export function applySessionCookies(response: NextResponse, newSession?: AdminAuthResult['newSession']): NextResponse {
  if (newSession) {
    response.cookies.set('sb-access-token', newSession.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: newSession.expires_in || 86400,
    });
    response.cookies.set('sb-refresh-token', newSession.refresh_token, {
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
  return response;
}
