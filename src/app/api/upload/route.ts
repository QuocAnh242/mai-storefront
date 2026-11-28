import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { enforceRateLimit } from "@/lib/rateLimit";
import { verifyAdminAuth, applySessionCookies } from "@/lib/adminAuth";
import { detectImageMime, ALLOWED_IMAGE_MIME, MAX_UPLOAD_BYTES } from "@/lib/imageValidation";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limit: 40 uploads per IP per minute
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const rateLimit = await enforceRateLimit(`upload_${clientIp}`, 40, 60);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "RATE_LIMIT_EXCEEDED", message: "Quá giới hạn tải ảnh. Vui lòng đợi ít phút." },
        { status: 429 }
      );
    }

    // 2. Auth: Multi-tier Admin verification with auto-refresh
    const authResult = await verifyAdminAuth(req);
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Yêu cầu quyền Quản trị viên để tải ảnh" },
        { status: 401 }
      );
    }

    let file: File | null = null;
    try {
      const formData = await req.formData();
      file = formData.get("file") as File | null;
    } catch {
      return NextResponse.json({ error: "Dữ liệu upload không hợp lệ (cần multipart/form-data)" }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: "Không có file ảnh" }, { status: 400 });
    }

    // 3. Size + MIME whitelist enforced server-side (never trust the client)
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "FILE_TOO_LARGE", message: "Ảnh tối đa 5MB" },
        { status: 400 },
      );
    }
    if (file.type && !ALLOWED_IMAGE_MIME.includes(file.type as (typeof ALLOWED_IMAGE_MIME)[number])) {
      return NextResponse.json(
        { error: "UNSUPPORTED_FILE_TYPE", message: "Chỉ hỗ trợ ảnh JPEG, PNG, WebP, AVIF" },
        { status: 400 },
      );
    }

    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Magic-byte sniffing: the declared MIME must match the actual file content
    const detectedMime = detectImageMime(buffer);
    if (!detectedMime || !ALLOWED_IMAGE_MIME.includes(detectedMime as (typeof ALLOWED_IMAGE_MIME)[number])) {
      return NextResponse.json(
        { error: "UNSUPPORTED_FILE_TYPE", message: "Nội dung file không phải ảnh hợp lệ" },
        { status: 400 },
      );
    }

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

    const response = NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
    return applySessionCookies(response, authResult.newSession);
  } catch (error: unknown) {
    console.error("[Cloudinary Upload Error]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload thất bại" },
      { status: 500 },
    );
  }
}
