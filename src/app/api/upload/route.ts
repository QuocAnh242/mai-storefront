import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rateLimit";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limit: 20 uploads per IP per minute
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const rateLimit = checkRateLimit(`upload_${clientIp}`, 20, 60);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "RATE_LIMIT_EXCEEDED", message: "Quá giới hạn tải ảnh. Vui lòng đợi." },
        { status: 429 }
      );
    }

    // 2. Auth: Verify Supabase JWT (strict — no legacy cookie fallback)
    const accessToken = req.cookies.get("sb-access-token")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Yêu cầu quyền Quản trị viên để tải ảnh" },
        { status: 401 }
      );
    }
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.getUser(accessToken);
      if (error || !data?.user) {
        return NextResponse.json(
          { error: "UNAUTHORIZED", message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn" },
          { status: 401 }
        );
      }
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Không có file ảnh" }, { status: 400 });
    }

    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary via upload stream
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "mai-kim-tuyen/products",
            resource_type: "image",
            transformation: [
              {
                width: 1200,
                height: 1200,
                crop: "limit",
                quality: "auto",
                fetch_format: "auto",
              },
            ],
          },
          (error, result) => {
            if (error || !result) {
              reject(error ?? new Error("Upload thất bại"));
            } else {
              resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
              });
            }
          },
        );
        uploadStream.end(buffer);
      },
    );

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error: any) {
    console.error("[Cloudinary Upload Error]", error);
    return NextResponse.json(
      { error: error.message || "Upload thất bại" },
      { status: 500 },
    );
  }
}
