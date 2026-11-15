import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getLiveAnalyticsSummary } from '@/lib/analyticsStore';
import { checkRateLimit } from '@/lib/rateLimit';

export async function GET(req: NextRequest) {
  try {
    // 0. IP Rate Limiting: Max 60 requests per minute per IP
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateLimit = checkRateLimit(`analytics_${clientIp}`, 60, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT_EXCEEDED', message: 'Quá nhiều yêu cầu tải dữ liệu thống kê' },
        { status: 429 }
      );
    }

    // 1. Admin Authentication Check
    const token = req.cookies.get('sb-access-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    if (isSupabaseConfigured()) {
      const { data: authData, error: authErr } = await supabase.auth.getUser(token);
      if (authErr || !authData?.user) {
        return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
      }
    }

    // 2. Fetch live data from local/memory store first
    const live = getLiveAnalyticsSummary();

    let todayViews = live.todayViews;
    let todayVisitors = live.todayVisitors;
    let trends = live.trends;
    let topProducts: { id: string; title: string; views: number }[] = live.topProducts.map((p) => ({
      id: p.id,
      title: p.title,
      views: p.views,
    }));
    let dbConnected = false;

    // 3. If Supabase configured, attempt to query persisted tables
    if (isSupabaseConfigured()) {
      try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        // Count today's pageviews
        const { count: dbTodayViews, error: pvErr } = await supabase
          .from('site_pageviews')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', todayStart.toISOString());

        if (!pvErr && typeof dbTodayViews === 'number') {
          dbConnected = true;
          todayViews = Math.max(todayViews, dbTodayViews);
        }

        // Query top viewed products from DB
        const { data: dbProductViews, error: prodErr } = await supabase
          .from('product_views')
          .select('product_id, product_title')
          .limit(200);

        if (!prodErr && dbProductViews && dbProductViews.length > 0) {
          dbConnected = true;
          const counts: { [id: string]: { id: string; title: string; views: number } } = {};
          dbProductViews.forEach((row: any) => {
            if (!counts[row.product_id]) {
              counts[row.product_id] = {
                id: row.product_id,
                title: row.product_title || 'Sản phẩm',
                views: 0,
              };
            }
            counts[row.product_id].views += 1;
          });

          // Merge with in-memory top products
          live.topProducts.forEach((p) => {
            if (!counts[p.id]) {
              counts[p.id] = { id: p.id, title: p.title, views: p.views };
            } else {
              counts[p.id].views += p.views;
            }
          });

          topProducts = Object.values(counts)
            .sort((a, b) => b.views - a.views)
            .slice(0, 10);
        }
      } catch (dbQueryErr) {
        console.warn('Analytics DB read note:', dbQueryErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        todayViews,
        todayVisitors,
        totalTrackedViews: live.totalTrackedViews,
        trends,
        topProducts,
        dbConnected,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
