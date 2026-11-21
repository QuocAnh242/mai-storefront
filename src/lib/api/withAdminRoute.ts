import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase';
import { enforceRateLimit } from '@/lib/rateLimit';
import { verifyAdminAuth, applySessionCookies, AdminAuthResult } from '@/lib/adminAuth';

export interface RouteContext {
  req: NextRequest;
  auth: AdminAuthResult;
}

export interface AdminRouteOptions {
  /** Giới hạn request/IP/cửa sổ. Bỏ qua nếu null. */
  rateLimit?: { key: string; limit: number; windowSeconds: number } | null;
  /** Yêu cầu SUPABASE_SERVICE_ROLE_KEY (mặc định true) */
  requireServiceRole?: boolean;
}

export function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
}

function jsonWithSession(body: unknown, status: number, newSession?: AdminAuthResult['newSession']) {
  const response = NextResponse.json(body, { status });
  return newSession ? applySessionCookies(response, newSession) : response;
}

/**
 * Gói handler admin route: rate limit → verifyAdminAuth → check service role → try/catch.
 * Handler chỉ viết logic nghiệp vụ; lỗi chuẩn hóa về JSON nhất quán.
 */
export function withAdminRoute(
  options: AdminRouteOptions,
  handler: (ctx: RouteContext) => Promise<NextResponse>,
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // 1. Rate limit
      if (options.rateLimit) {
        const { key, limit, windowSeconds } = options.rateLimit;
        const rateLimit = await enforceRateLimit(`${key}_${getClientIp(req)}`, limit, windowSeconds);
        if (!rateLimit.allowed) {
          return NextResponse.json(
            { error: 'RATE_LIMIT_EXCEEDED', message: 'Thao tác quá nhanh, vui lòng thử lại sau.' },
            { status: 429 },
          );
        }
      }

      // 2. Auth
      const auth = await verifyAdminAuth(req);
      if (!auth.authorized) {
        return NextResponse.json(
          { error: 'UNAUTHORIZED', message: 'Yêu cầu quyền Quản trị viên' },
          { status: 401 },
        );
      }

      // 3. Service role requirement
      if ((options.requireServiceRole ?? true) && (!isSupabaseAdminConfigured() || !supabaseAdmin)) {
        return NextResponse.json(
          { error: 'Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY trên server' },
          { status: 500 },
        );
      }

      // 4. Business logic
      return await handler({ req, auth });
    } catch (err: any) {
      console.error('[Admin Route Error]', err);
      return NextResponse.json({ error: err.message || 'Lỗi máy chủ' }, { status: 500 });
    }
  };
}

/**
 * Response helpers — cùng format trên toàn bộ API.
 */
export function ok(
  data: unknown,
  init?: { message?: string; newSession?: AdminAuthResult['newSession']; status?: number },
) {
  const body: Record<string, unknown> = { success: true, ...(data as object) };
  if (init?.message) body.message = init.message;
  return jsonWithSession(body, init?.status ?? 200, init?.newSession);
}

export function fail(
  error: string,
  status = 400,
  message?: string,
  newSession?: AdminAuthResult['newSession'],
) {
  return jsonWithSession({ error, ...(message ? { message } : {}) }, status, newSession);
}
