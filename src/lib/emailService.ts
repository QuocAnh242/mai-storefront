import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase';

// Default superadmin email list (fallback when Supabase Auth is unavailable)
export const DEFAULT_SUPERADMIN_EMAILS = [
  'lingchen.9210@gmail.com',
  'chuyencungcapkimtuyensivale@gmail.com',
  'qanh.tran242@gmail.com',
];

/**
 * Fetch all superadmin emails from Supabase Auth.
 */
export async function getSuperadminEmails(): Promise<string[]> {
  try {
    if (isSupabaseAdminConfigured() && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 100,
      });

      if (!error && data?.users?.length) {
        const emails = data.users
          .map((u) => u.email)
          .filter((e): e is string => typeof e === 'string' && e.includes('@'));

        if (emails.length > 0) {
          // Deduplicate emails
          return Array.from(new Set(emails));
        }
      }
    }
  } catch (err) {
    console.warn('Không thể truy xuất danh sách admin từ Supabase Auth, dùng danh sách dự phòng:', err);
  }

  return DEFAULT_SUPERADMIN_EMAILS;
}

export interface SendCleanupReportParams {
  toEmails: string[];
  totalViewsLast30Days: number;
  totalVisitorsLast30Days: number;
  topProducts: { title: string; views: number }[];
  plannedCleanupDate: string; // Planned date to purge old records (after 7 days)
}

/**
 * Send the traffic report email with the 30-day data cleanup schedule notice.
 */
export async function sendCleanupNoticeEmail(params: SendCleanupReportParams): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  const {
    toEmails,
    totalViewsLast30Days,
    totalVisitorsLast30Days,
    topProducts,
    plannedCleanupDate,
  } = params;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[EmailService] Chưa cấu hình RESEND_API_KEY trong biến môi trường');
    return { success: false, error: 'MISSING_RESEND_API_KEY' };
  }

  const subject = `[Mai Kim Tuyến] Báo cáo lưu lượng truy cập tháng & Thông báo dọn dẹp dữ liệu`;

  // Responsive HTML email template
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b;">
  <div style="max-width: 600px; margin: 24px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Header -->
    <div style="background-color: #082f49; padding: 32px 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
        MAI KIM TUYẾN
      </h1>
      <p style="color: #38bdf8; margin: 6px 0 0 0; font-size: 13px; font-weight: 500;">
        Hệ Thống Quản Trị Website &amp; Báo Cáo Định Kỳ
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 28px 24px;">
      <h2 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 0;">
        Kính gửi Quản trị viên,
      </h2>
      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 20px;">
        Hệ thống tự động thông báo: Dữ liệu truy cập của website đã sắp đạt mốc <strong>30 ngày lưu trữ</strong>. Dưới đây là tổng kết lưu lượng truy cập trong 30 ngày qua trước khi hệ thống dọn dẹp các bản ghi chi tiết cũ:
      </p>

      <!-- Stat Cards -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="width: 50%; padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px 0 0 12px; text-align: center;">
            <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Tổng Lượt Xem (30 Ngày)</div>
            <div style="font-size: 24px; font-weight: 800; color: #082f49; margin-top: 4px;">${totalViewsLast30Days.toLocaleString('vi-VN')}</div>
          </td>
          <td style="width: 50%; padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0 12px 12px 0; text-align: center;">
            <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Lượng Khách Ghé Thăm</div>
            <div style="font-size: 24px; font-weight: 800; color: #0284c7; margin-top: 4px;">${totalVisitorsLast30Days.toLocaleString('vi-VN')}</div>
          </td>
        </tr>
      </table>

      ${
        topProducts.length > 0
          ? `
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 13px; font-weight: 700; text-transform: uppercase; color: #334155; margin-bottom: 10px; letter-spacing: 0.5px;">
          Top Sản Phẩm Được Xem Nhiều Nhất:
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          ${topProducts
            .map(
              (p, idx) => `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 4px; color: #64748b; width: 24px; font-weight: 700;">#${idx + 1}</td>
              <td style="padding: 8px 4px; color: #0f172a; font-weight: 600;">${p.title}</td>
              <td style="padding: 8px 4px; color: #0284c7; text-align: right; font-weight: 700;">${p.views.toLocaleString('vi-VN')} lượt</td>
            </tr>
          `
            )
            .join('')}
        </table>
      </div>
      `
          : ''
      }

      <!-- Notice Box -->
      <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 14px 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
        <div style="font-size: 13px; font-weight: 700; color: #1e40af; margin-bottom: 4px;">
          Kế Hoạch Dọn Dẹp Dữ Liệu Tự Động:
        </div>
        <p style="font-size: 12px; color: #1e3a8a; margin: 0; line-height: 1.5;">
          • Vào ngày <strong>${plannedCleanupDate}</strong> (sau đúng 7 ngày nữa), hệ thống sẽ tiến hành xóa các dòng nhật ký chi tiết cũ hơn 30 ngày để tối ưu hóa bộ nhớ.<br>
          • <strong>Lưu ý:</strong> Toàn bộ số lượt truy cập đã được tự động lưu trữ tích lũy, chỉ số <strong>Tổng Lượt Xem Toàn Thời Gian</strong> trên trang Admin Dashboard sẽ <strong>KHÔNG</strong> bị giảm.
        </p>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin: 28px 0 16px 0;">
        <a href="https://www.maikimtuyen.io.vn/admin" style="background-color: #082f49; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 13px; font-weight: 700; display: inline-block; letter-spacing: 0.3px;">
          Truy Cập Trang Quản Trị →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8;">
      Email này được gửi tự động từ hệ thống quản lý cửa hàng Mai Kim Tuyến.<br>
      © 2026 MAI KIM TUYẾN. All rights reserved.
    </div>

  </div>
</body>
</html>
  `;

  // Check whether the sending domain has been verified
  let fromAddress = 'Mai Kim Tuyến <thongbao@maikimtuyen.io.vn>';
  let recipients = toEmails;

  try {
    // Try sending via the primary domain maikimtuyen.io.vn
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: recipients,
        subject,
        html: htmlContent,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // If maikimtuyen.io.vn is not yet verified, fall back to onboarding@resend.dev
      if (data?.message?.includes('verify a domain') || data?.statusCode === 403) {
        console.warn('[EmailService Notice] Domain maikimtuyen.io.vn đang chờ xác thực DNS. Đang gửi email dự phòng qua onboarding@resend.dev...');
        
        const fallbackRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Mai Kim Tuyến <onboarding@resend.dev>',
            to: ['wasasi241224@gmail.com'], // Send to the email registered with Resend
            subject,
            html: htmlContent,
          }),
        });

        const fallbackData = await fallbackRes.json();
        if (fallbackRes.ok) {
          return { success: true, messageId: fallbackData.id };
        }
      }

      return { success: false, error: data?.message || 'Lỗi gửi email qua Resend' };
    }

    return { success: true, messageId: data.id };
  } catch (err: any) {
    console.error('[EmailService Error]:', err);
    return { success: false, error: err.message };
  }
}
