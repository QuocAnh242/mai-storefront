import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { enforceRateLimit } from "@/lib/rateLimit";
import { LoginSchema } from "@/lib/validation/schemas";

export async function POST(req: Request) {
  try {
    // 1. IP Rate Limit: Max 15 login attempts per IP per 60 seconds
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateLimit = await enforceRateLimit(`login_${clientIp}`, 15, 60);

    if (!rateLimit.allowed) {
      console.warn(
        `[Login Rate Limit Exceeded] IP: ${clientIp}, wait: ${rateLimit.resetSeconds}s`,
      );
      return NextResponse.json(
        {
          error: "RATE_LIMIT_EXCEEDED",
          message: `Bạn thao tác quá nhanh hoặc thử đăng nhập quá nhiều lần. Vui lòng đợi ${rateLimit.resetSeconds} giây rồi thử lại!`,
        },
        { status: 429 },
      );
    }

    // 2. Validate Payload
    const body = await req.json();
    const parseResult = LoginSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "INVALID_PAYLOAD",
          message: "Tài khoản hoặc mật khẩu không hợp lệ",
        },
        { status: 400 },
      );
    }

    const { email, password } = parseResult.data;

    // 3. Supabase Auth Verification (Real API)
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          error: "SUPABASE_NOT_CONFIGURED",
          message: "Hệ thống Supabase chưa được cấu hình biến môi trường",
        },
        { status: 500 },
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error || !data.session) {
      const errorStatus = error?.status || 401;
      const rawMsg = (error?.message || "").toLowerCase();
      const errorCode = (error as { code?: string } | null)?.code || "";

      console.error("[Supabase Auth Failed]:", {
        email,
        clientIp,
        status: errorStatus,
        code: errorCode,
        message: error?.message,
      });

      // 1. Handle Supabase Auth rate limit errors
      if (
        errorStatus === 429 ||
        rawMsg.includes("rate limit") ||
        rawMsg.includes("too many") ||
        rawMsg.includes("over email")
      ) {
        return NextResponse.json(
          {
            error: "RATE_LIMIT_EXCEEDED",
            message:
              "Bạn thao tác quá nhanh hoặc hệ thống tạm khóa do thử đăng nhập nhiều lần. Vui lòng chờ 1-2 phút rồi thử lại!",
          },
          { status: 429 },
        );
      }

      // 2. Handle invalid credentials
      if (
        rawMsg.includes("invalid login credentials") ||
        errorCode === "invalid_credentials" ||
        rawMsg.includes("invalid_grant")
      ) {
        return NextResponse.json(
          {
            error: "INVALID_CREDENTIALS",
            message:
              "Tài khoản hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại (chú ý tắt gõ tiếng Việt Unikey/EVKey khi nhập mật khẩu).",
          },
          { status: 401 },
        );
      }

      // 3. Handle unconfirmed email
      if (rawMsg.includes("email not confirmed")) {
        return NextResponse.json(
          {
            error: "EMAIL_NOT_CONFIRMED",
            message:
              "Tài khoản email này chưa được xác thực trong Supabase Authentication.",
          },
          { status: 400 },
        );
      }

      // 4. Other Supabase server errors
      return NextResponse.json(
        {
          error: "AUTH_FAILED",
          message:
            error?.message ||
            "Không thể xác thực thông tin đăng nhập. Vui lòng thử lại sau giây lát.",
        },
        { status: errorStatus },
      );
    }

    const { access_token, refresh_token, expires_in } = data.session;

    // 4. Create Response with HttpOnly JWT Cookies and Session Payload
    const response = NextResponse.json({
      success: true,
      message: "Đăng nhập thành công",
      session: {
        access_token,
        refresh_token,
      },
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
      },
    });

    // Set HttpOnly, Secure, SameSite=Lax Cookies for JWT Session (Lax enables session persistence on reload/navigation)
    response.cookies.set("sb-access-token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expires_in || 86400,
    });

    response.cookies.set("sb-refresh-token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 86400,
    });

    return response;
  } catch (error: unknown) {
    console.error("Server Auth Error:", error);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
