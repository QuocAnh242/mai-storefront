import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getLiveAnalyticsSummary } from "@/lib/analyticsStore";
import { checkRateLimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  try {
    // 0. IP Rate Limiting: Max 60 requests per minute per IP
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateLimit = checkRateLimit(`analytics_${clientIp}`, 60, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "RATE_LIMIT_EXCEEDED",
          message: "Quá nhiều yêu cầu tải dữ liệu thống kê",
        },
        { status: 429 },
      );
    }

    // 1. Admin Authentication Check
    const token = req.cookies.get("sb-access-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    if (isSupabaseConfigured()) {
      const { data: authData, error: authErr } =
        await supabase.auth.getUser(token);
      if (authErr || !authData?.user) {
        return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
      }
    }

    let todayViews = 0;
    let todayVisitors = 0;
    let totalTrackedViews = 0;
    let trends: {
      date: string;
      label: string;
      views: number;
      visitors: number;
    }[] = [];
    let topProducts: { id: string; title: string; views: number }[] = [];
    let dbConnected = false;
    let requiresTableSetup = false;

    // 2. Query directly from Supabase Cloud Database
    if (isSupabaseConfigured()) {
      const dbClient = supabaseAdmin || supabase;
      try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        // A. Count today's pageviews and distinct visitors
        const { data: todayViewsData, error: pvErr } = await dbClient
          .from("site_pageviews")
          .select("visitor_id")
          .gte("created_at", todayStart.toISOString());

        if (pvErr) {
          // If table does not exist in schema cache
          if (
            pvErr.message?.includes("schema cache") ||
            pvErr.message?.includes("does not exist")
          ) {
            requiresTableSetup = true;
          }
        } else if (todayViewsData) {
          dbConnected = true;
          todayViews = todayViewsData.length;
          todayVisitors = new Set(
            todayViewsData.map((r: any) => r.visitor_id).filter(Boolean),
          ).size;

          // B. Total pageviews all time
          const { count: totalCount } = await dbClient
            .from("site_pageviews")
            .select("*", { count: "exact", head: true });
          totalTrackedViews = totalCount || todayViews;

          // C. 7-day trend
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
          sevenDaysAgo.setHours(0, 0, 0, 0);

          const { data: trendData } = await dbClient
            .from("site_pageviews")
            .select("visitor_id, created_at")
            .gte("created_at", sevenDaysAgo.toISOString())
            .order("created_at", { ascending: true });

          const trendsMap: {
            [dateStr: string]: { views: number; visitors: Set<string> };
          } = {};
          (trendData || []).forEach((row: any) => {
            const dateStr = new Date(row.created_at)
              .toISOString()
              .split("T")[0];
            if (!trendsMap[dateStr]) {
              trendsMap[dateStr] = { views: 0, visitors: new Set() };
            }
            trendsMap[dateStr].views += 1;
            if (row.visitor_id) {
              trendsMap[dateStr].visitors.add(row.visitor_id);
            }
          });

          for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateKey = d.toISOString().split("T")[0];
            const dayLabel = `${d.getDate()}/${d.getMonth() + 1}`;
            const entry = trendsMap[dateKey];
            trends.push({
              date: dateKey,
              label: dayLabel,
              views: entry ? entry.views : 0,
              visitors: entry ? entry.visitors.size : 0,
            });
          }

          // D. Top viewed products
          const { data: prodViews } = await dbClient
            .from("product_views")
            .select("product_id, product_title")
            .limit(500);

          if (prodViews && prodViews.length > 0) {
            const counts: {
              [id: string]: { id: string; title: string; views: number };
            } = {};
            prodViews.forEach((row: any) => {
              if (!counts[row.product_id]) {
                counts[row.product_id] = {
                  id: row.product_id,
                  title: row.product_title || "Sản phẩm",
                  views: 0,
                };
              }
              counts[row.product_id].views += 1;
            });
            topProducts = Object.values(counts)
              .sort((a, b) => b.views - a.views)
              .slice(0, 10);
          }
        }
      } catch (dbQueryErr) {
        console.warn("Analytics DB read note:", dbQueryErr);
      }
    }

    // 3. Fallback to transient memory buffer if tables aren't set up yet
    if (requiresTableSetup || !dbConnected) {
      const live = getLiveAnalyticsSummary();
      todayViews = Math.max(todayViews, live.todayViews);
      todayVisitors = Math.max(todayVisitors, live.todayVisitors);
      totalTrackedViews = Math.max(totalTrackedViews, live.totalTrackedViews);
      if (trends.length === 0) {
        trends = live.trends;
      }
      if (topProducts.length === 0) {
        topProducts = live.topProducts.map((p) => ({
          id: p.id,
          title: p.title,
          views: p.views,
        }));
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        todayViews,
        todayVisitors,
        totalTrackedViews,
        trends,
        topProducts,
        dbConnected,
        requiresTableSetup,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
