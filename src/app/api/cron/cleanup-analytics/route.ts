import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin, isSupabaseConfigured, isSupabaseAdminConfigured } from '@/lib/supabase';
import { getSuperadminEmails, sendCleanupNoticeEmail } from '@/lib/emailService';

// Allow Vercel up to 30s for the scheduled cron task
export const maxDuration = 30;

/**
 * Cron Job endpoint:
 * 1. Runs daily or weekly.
 * 2. At the 23-day mark (1 week ahead): send a report & cleanup schedule email to the 3 Superadmins.
 * 3. At day 30: accumulate view counts into the archive table (analytics_archive), then delete rows older than 30 days.
 */
export async function GET(req: NextRequest) {
  return handleCronJob(req);
}

export async function POST(req: NextRequest) {
  return handleCronJob(req);
}

async function handleCronJob(req: NextRequest) {
  try {
    // 1. Verify execution permission (Vercel Cron Secret)
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

    // ── STEP 1: LOAD ARCHIVE STATE (ANALYTICS_ARCHIVE) ──
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

    // ── STEP 2: CHECK & SEND 1-WEEK-AHEAD REPORT EMAIL (23-DAY MARK) ──
    const twentyThreeDaysAgo = new Date(now.getTime() - 23 * 24 * 60 * 60 * 1000).toISOString();
    const twentyDaysAgo = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    let notificationSent = false;
    let notificationError = null;

    // Avoid repeat emails within the last 20 days (prevents daily spam)
    const recentlyNotified = archiveRow.last_notified_at && archiveRow.last_notified_at > twentyDaysAgo;

    if (!recentlyNotified) {
      // Check whether any rows are older than 23 days
      const { count: agingViewsCount } = await client
        .from('site_pageviews')
        .select('*', { count: 'exact', head: true })
        .lte('created_at', twentyThreeDaysAgo);

      // Rows at the 23-day mark → time to send the 1-week-ahead notice
      if (agingViewsCount && agingViewsCount > 0) {
        // 1. Aggregate stats for the last 30 days
        const { data: monthViewsData } = await client
          .from('site_pageviews')
          .select('visitor_id')
          .gte('created_at', thirtyDaysAgo);

        const totalViewsLast30Days = monthViewsData ? monthViewsData.length : 0;
        const totalVisitorsLast30Days = monthViewsData
          ? new Set(monthViewsData.map((r: { visitor_id?: string | null }) => r.visitor_id).filter(Boolean)).size
          : 0;

        // 2. Top 3 most-viewed products
        const { data: topProdData } = await client
          .from('product_views')
          .select('product_title')
          .gte('created_at', thirtyDaysAgo);

        const prodCountMap: { [title: string]: number } = {};
        (topProdData || []).forEach((row: { product_title?: string | null }) => {
          const t = row.product_title || 'Sản phẩm';
          prodCountMap[t] = (prodCountMap[t] || 0) + 1;
        });

        const topProducts = Object.entries(prodCountMap)
          .map(([title, views]) => ({ title, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 3);

        // 3. Compute the planned cleanup date (exactly 7 days out)
        const cleanupTarget = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const plannedCleanupDate = `${cleanupTarget.getDate().toString().padStart(2, '0')}/${(cleanupTarget.getMonth() + 1).toString().padStart(2, '0')}/${cleanupTarget.getFullYear()}`;

        // 4. Fetch Superadmin email list
        const superadminEmails = await getSuperadminEmails();

        // 5. Send notification email
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

        // Persist the notification timestamp to the database
        if (emailResult.success) {
          await client.from('analytics_archive').upsert({
            id: 'global',
            last_notified_at: now.toISOString(),
            updated_at: now.toISOString(),
          });
        }
      }
    }

    // ── STEP 3: CLEAN UP ROWS OLDER THAN 30 DAYS & ACCUMULATE INTO ARCHIVE ──
    let cleanedPageviewsCount = 0;
    let cleanedProductViewsCount = 0;

    // 1. Count pageviews older than 30 days
    const { count: oldPvCount } = await client
      .from('site_pageviews')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', thirtyDaysAgo);

    // 2. Count product_views older than 30 days
    const { count: oldProdViewCount } = await client
      .from('product_views')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', thirtyDaysAgo);

    cleanedPageviewsCount = oldPvCount || 0;
    cleanedProductViewsCount = oldProdViewCount || 0;

    // Rows older than 30 days require cleanup
    if (cleanedPageviewsCount > 0 || cleanedProductViewsCount > 0) {
      // A. Accumulate into the archive (archived_pageviews) so Admin Dashboard totals stay stable
      const newArchivedPv = archiveRow.archived_pageviews + cleanedPageviewsCount;
      const newArchivedProdV = archiveRow.archived_product_views + cleanedProductViewsCount;

      await client.from('analytics_archive').upsert({
        id: 'global',
        archived_pageviews: newArchivedPv,
        archived_product_views: newArchivedProdV,
        last_cleaned_at: now.toISOString(),
        updated_at: now.toISOString(),
      });

      // B. Delete rows older than 30 days from both detail tables
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
  } catch (err: unknown) {
    console.error('[Cleanup Analytics Cron Error]:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Cron failed' }, { status: 500 });
  }
}
