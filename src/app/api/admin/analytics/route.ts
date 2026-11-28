import { NextResponse } from "next/server";
import { supabase, supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getLiveAnalyticsSummary } from "@/lib/analyticsStore";
import { withAdminRoute } from "@/lib/api/withAdminRoute";
import { applySessionCookies } from "@/lib/adminAuth";

// GET: Analytics summary (DB-backed with in-memory fallback)
export const GET = withAdminRoute(
  {
    // Rate limit: 180 requests per 60s per IP
    rateLimit: { key: "analytics", limit: 180, windowSeconds: 60 },
    requireServiceRole: false,
  },
  async ({ auth }) => {
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

    // Query directly from Supabase Cloud Database (Parallelized for Ultra-Fast Loading)
    if (isSupabaseConfigured()) {
      const dbClient = supabaseAdmin || supabase;
      try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // Run all 5 database queries in parallel with Promise.allSettled
        const [
          todayViewsRes,
          totalCountRes,
          archiveRes,
          trendRes,
          prodViewsRes,
        ] = await Promise.allSettled([
          // A. Today's pageviews
          dbClient
            .from("site_pageviews")
            .select("visitor_id")
            .gte("created_at", todayStart.toISOString()),

          // B. Total pageviews count all time
          dbClient
            .from("site_pageviews")
            .select("*", { count: "exact", head: true }),

          // C. Archived pageviews from retention rollups
          dbClient
            .from("analytics_archive")
            .select("archived_pageviews")
            .eq("id", "global")
            .maybeSingle(),

          // D. 7-day trend
          dbClient
            .from("site_pageviews")
            .select("visitor_id, created_at")
            .gte("created_at", sevenDaysAgo.toISOString())
            .order("created_at", { ascending: true }),

          // E. Top viewed products
          dbClient
            .from("product_views")
            .select("product_id, product_title")
            .limit(500),
        ]);

        // Process Today Views & Visitors
        if (todayViewsRes.status === "fulfilled") {
          const { data: todayViewsData, error: pvErr } = todayViewsRes.value;
          if (pvErr) {
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
              todayViewsData.map((r: { visitor_id?: string | null }) => r.visitor_id).filter(Boolean),
            ).size;
          }
        }

        // Process Total Count & Archive
        let archivedCount = 0;
        if (archiveRes.status === "fulfilled" && archiveRes.value.data?.archived_pageviews) {
          archivedCount = Number(archiveRes.value.data.archived_pageviews) || 0;
        }

        let exactCount = todayViews;
        if (totalCountRes.status === "fulfilled" && typeof totalCountRes.value.count === "number") {
          exactCount = totalCountRes.value.count;
        }
        totalTrackedViews = exactCount + archivedCount;

        // Process 7-day Trend
        if (trendRes.status === "fulfilled" && trendRes.value.data) {
          const trendData = trendRes.value.data;
          const trendsMap: {
            [dateStr: string]: { views: number; visitors: Set<string> };
          } = {};

          (trendData || []).forEach((row: { created_at: string; visitor_id?: string | null }) => {
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
        }

        // Process Top Products
        if (prodViewsRes.status === "fulfilled" && prodViewsRes.value.data) {
          const prodViews = prodViewsRes.value.data;
          if (prodViews && prodViews.length > 0) {
            const counts: {
              [id: string]: { id: string; title: string; views: number };
            } = {};
            prodViews.forEach((row: { product_id: string; product_title?: string | null }) => {
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

    // Fallback to transient memory buffer if tables aren't set up yet
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

    const response = NextResponse.json(
      {
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
      },
      {
        headers: {
          "Cache-Control": "private, max-age=10, stale-while-revalidate=20",
        },
      },
    );
    return applySessionCookies(response, auth.newSession);
  },
);
