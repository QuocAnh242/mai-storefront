import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { enforceRateLimit } from "@/lib/rateLimit";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/**
 * Endpoint to sync the active Supabase session to the client-side JavaScript SDK
 * Reads the HttpOnly auth cookies and returns the active session tokens.
 * Automatically refreshes the session using the refresh token if the access token has expired.
 */
export async function GET(req: NextRequest) {
  try {
    // 1. IP Rate Limiting: Max 60 requests per minute
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateLimit = await enforceRateLimit(`session_${clientIp}`, 60, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "RATE_LIMIT_EXCEEDED",
          message: "Bạn thao tác quá nhanh. Vui lòng thử lại sau giây lát.",
        },
        { status: 429 },
      );
    }

    const cookieStore = await cookies();
    let accessToken = cookieStore.get("sb-access-token")?.value;
    const refreshToken = cookieStore.get("sb-refresh-token")?.value;

    let isTokenValid = false;
    if (accessToken && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.getUser(accessToken);
        if (!error && data?.user) {
          isTokenValid = true;
        }
      } catch {
        isTokenValid = false;
      }
    }

    // If access token is missing or expired, attempt auto-refresh using the refresh token
    if (!isTokenValid && refreshToken && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.refreshSession({
          refresh_token: refreshToken,
        });
        if (!error && data?.session) {
          const response = NextResponse.json({
            session: {
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
            },
          });

          // Set refreshed cookies with sameSite: 'lax'
          response.cookies.set("sb-access-token", data.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: data.session.expires_in || 86400,
          });

          response.cookies.set("sb-refresh-token", data.session.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 30 * 86400,
          });

          return response;
        }
      } catch (refreshErr) {
        console.warn("Auto refresh error in /api/auth/session:", refreshErr);
      }
    }

    if (!isTokenValid) {
      return NextResponse.json({ session: null });
    }

    return NextResponse.json({
      session: {
        access_token: accessToken,
        refresh_token: refreshToken || "",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { session: null, error: error.message },
      { status: 500 },
    );
  }
}
