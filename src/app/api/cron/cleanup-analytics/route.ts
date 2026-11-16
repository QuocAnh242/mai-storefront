import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin, isSupabaseConfigured, isSupabaseAdminConfigured } from '@/lib/supabase';
import { getSuperadminEmails, sendCleanupNoticeEmail } from '@/lib/emailService';

// Cho phép Vercel chạy tối đa 30s cho tác vụ cron định kỳ
export const maxDuration = 30;

/**
 * Endpoint Cron Job:
 * 1. Chạy định kỳ mỗi ngày hoặc mỗi tuần.
 * 2. Trước 1 tuần (khi dữ liệu đạt mốc 23 ngày): Gửi email báo cáo & lịch dọn dẹp đến 3 Superadmin.
 * 3. Đến ngày 30: Tự động cộng dồn số view vào kho lưu trữ (analytics_archive) rồi xóa các dòng cũ hơn 30 ngày.
 */
export async function GET(req: NextRequest) {
  return handleCronJob(req);
}

export async function POST(req: NextRequest) {
  return handleCronJob(req);
}

async function handleCronJob(req: NextRequest) {
  try {
    // 1. Kiểm tra quyền thực thi (Bảo mật Vercel Cron Secret)
    const authHeader = req.headers.get('authorization');
    const { searchParams } = new URL(req.url);
    const secretKey = searchParams.get('key');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}` && secretKey !== cronSecret) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, message: 'Supabase chưa được cấu hình' },
        { status: 500 }
      );
    }

    const client = (isSupabaseAdminConfigured() && supabaseAdmin) ? supabaseAdmin : supabase;
    const now = new Date();

    // ── BƯỚC 1: LẤY THÔNG TIN KHO LƯU TRỮ (ANALYTICS_ARCHIVE) ──
    let archiveRow: {
      archived_pageviews: number;
      archived_product_views: number;
      last_cleaned_at: string | null;
      last_notified_at: string | null;
    } = {
      archived_pageviews: 0,
      archived_product_views: 0,
      last_cleaned_at: null,
      last_notified_at: null,
    };

    const { data: archiveData } = await client
      .from('analytics_archive')
      .select('*')
      .eq('id', 'global')
      .maybeSingle();

    if (archiveData) {
      archiveRow = {
        archived_pageviews: Number(archiveData.archived_pageviews || 0),
        archived_product_views: Number(archiveData.archived_product_views || 0),
        last_cleaned_at: archiveData.last_cleaned_at || null,
        last_notified_at: archiveData.last_notified_at || null,
      };
    }

    // ── BƯỚC 2: KIỂM TRA & GỬI EMAIL BÁO CÁO TRƯỚC 1 TUẦN (MỐC NGÀY 23) ──
    const twentyThreeDaysAgo = new Date(now.getTime() - 23 * 24 * 60 * 60 * 1000).toISOString();
    const twentyDaysAgo = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    let notificationSent = false;
    let notificationError = null;

    // Kiểm tra xem đã gửi mail trong 20 ngày gần nhất chưa (để tránh spam mỗi ngày)
    const recentlyNotified = archiveRow.last_notified_at && archiveRow.last_notified_at > twentyDaysAgo;

    if (!recentlyNotified) {
      // Kiểm tra xem có bản ghi nào đã cũ hơn 23 ngày chưa
      const { count: agingViewsCount } = await client
        .from('site_pageviews')
        .select('*', { count: 'exact', head: true })
        .lte('created_at', twentyThreeDaysAgo);

      // Nếu có bản ghi đạt mốc 23 ngày tuổi -> Đã đến hạn gửi email cảnh báo trước 1 tuần!
      if (agingViewsCount && agingViewsCount > 0) {
        // 1. Thống kê số liệu 30 ngày qua
        const { data: monthViewsData } = await client
          .from('site_pageviews')
          .select('visitor_id')
          .gte('created_at', thirtyDaysAgo);

        const totalViewsLast30Days = monthViewsData ? monthViewsData.length : 0;
        const totalVisitorsLast30Days = monthViewsData
          ? new Set(monthViewsData.map((r: any) => r.visitor_id).filter(Boolean)).size
          : 0;

        // 2. Thống kê top 3 sản phẩm được xem nhiều nhất
        const { data: topProdData } = await client
          .from('product_views')
          .select('product_title')
          .gte('created_at', thirtyDaysAgo);

        const prodCountMap: { [title: string]: number } = {};
        (topProdData || []).forEach((row: any) => {
          const t = row.product_title || 'Sản phẩm';
          prodCountMap[t] = (prodCountMap[t] || 0) + 1;
        });

        const topProducts = Object.entries(prodCountMap)
          .map(([title, views]) => ({ title, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 3);

        // 3. Tính ngày dọn dẹp dự kiến (sau đúng 7 ngày nữa)
        const cleanupTarget = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const plannedCleanupDate = `${cleanupTarget.getDate().toString().padStart(2, '0')}/${(cleanupTarget.getMonth() + 1).toString().padStart(2, '0')}/${cleanupTarget.getFullYear()}`;

        // 4. Lấy danh sách email Superadmin
        const superadminEmails = await getSuperadminEmails();

        // 5. Gửi email thông báo
        const emailResult = await sendCleanupNoticeEmail({
          toEmails: superadminEmails,
          totalViewsLast30Days,
          totalVisitorsLast30Days,
          topProducts,
          plannedCleanupDate,
        });

        notificationSent = emailResult.success;
        if (!emailResult.success) {
          notificationError = emailResult.error;
        }

        // Cập nhật mốc thời gian đã gửi thông báo vào database
        if (emailResult.success) {
          await client.from('analytics_archive').upsert({
            id: 'global',
            last_notified_at: now.toISOString(),
            updated_at: now.toISOString(),
          });
        }
      }
    }

    // ── BƯỚC 3: DỌN DẸP DỮ LIỆU CŨ HƠN 30 NGÀY & CỘNG DỒN VÀO KHO LƯU TRỮ ──
    let cleanedPageviewsCount = 0;
    let cleanedProductViewsCount = 0;

    // 1. Đếm số bản ghi pageviews cũ hơn 30 ngày
    const { count: oldPvCount } = await client
      .from('site_pageviews')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', thirtyDaysAgo);

    // 2. Đếm số bản ghi product_views cũ hơn 30 ngày
    const { count: oldProdViewCount } = await client
      .from('product_views')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', thirtyDaysAgo);

    cleanedPageviewsCount = oldPvCount || 0;
    cleanedProductViewsCount = oldProdViewCount || 0;

    // Nếu có dữ liệu cũ hơn 30 ngày cần dọn dẹp
    if (cleanedPageviewsCount > 0 || cleanedProductViewsCount > 0) {
      // A. Cộng dồn vào kho lưu trữ (archived_pageviews) để tổng view trên Admin Dashboard không bị giảm
      const newArchivedPv = archiveRow.archived_pageviews + cleanedPageviewsCount;
      const newArchivedProdV = archiveRow.archived_product_views + cleanedProductViewsCount;

      await client.from('analytics_archive').upsert({
        id: 'global',
        archived_pageviews: newArchivedPv,
        archived_product_views: newArchivedProdV,
        last_cleaned_at: now.toISOString(),
        updated_at: now.toISOString(),
      });

      // B. Xóa các bản ghi cũ hơn 30 ngày khỏi 2 bảng chi tiết
      if (cleanedPageviewsCount > 0) {
        await client.from('site_pageviews').delete().lt('created_at', thirtyDaysAgo);
      }
      if (cleanedProductViewsCount > 0) {
        await client.from('product_views').delete().lt('created_at', thirtyDaysAgo);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thực thi Cron Job kiểm tra dọn dẹp và thông báo thành công',
      data: {
        executedAt: now.toISOString(),
        notification: {
          sent: notificationSent,
          recentlyNotified,
          error: notificationError,
        },
        cleanup: {
          cleanedPageviews: cleanedPageviewsCount,
          cleanedProductViews: cleanedProductViewsCount,
          archivedTotal: archiveRow.archived_pageviews + cleanedPageviewsCount,
        },
      },
    });
  } catch (err: any) {
    console.error('[Cleanup Analytics Cron Error]:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
