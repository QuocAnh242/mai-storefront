/**
 * In-memory transient buffer for analytics.
 * NOTE: All persistent storage is strictly handled by Supabase database (site_pageviews & product_views).
 * No local JSON/disk files are used.
 */

interface LiveVisitorStats {
  todayViews: number;
  todayVisitors: Set<string>;
  dailyTrends: { [dateStr: string]: { views: number; visitors: Set<string> } };
  productViews: {
    [productId: string]: {
      id: string;
      title: string;
      views: number;
      lastViewedAt: number;
    };
  };
}

// Transient in-memory state for active process
const globalStore: LiveVisitorStats = {
  todayViews: 0,
  todayVisitors: new Set(),
  dailyTrends: {},
  productViews: {},
};

export function recordPageView(
  path: string,
  visitorId: string,
  _referrer?: string,
) {
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];

  globalStore.todayViews += 1;
  globalStore.todayVisitors.add(visitorId);

  if (!globalStore.dailyTrends[dateStr]) {
    globalStore.dailyTrends[dateStr] = { views: 0, visitors: new Set() };
  }
  globalStore.dailyTrends[dateStr].views += 1;
  globalStore.dailyTrends[dateStr].visitors.add(visitorId);
}

export function recordProductView(
  productId: string,
  productTitle: string,
  visitorId: string,
) {
  recordPageView(`/products/${productId}`, visitorId);

  if (!globalStore.productViews[productId]) {
    globalStore.productViews[productId] = {
      id: productId,
      title: productTitle || "Sản phẩm",
      views: 0,
      lastViewedAt: Date.now(),
    };
  }

  globalStore.productViews[productId].views += 1;
  globalStore.productViews[productId].lastViewedAt = Date.now();
  if (productTitle && !globalStore.productViews[productId].title) {
    globalStore.productViews[productId].title = productTitle;
  }
}

export function clearAnalyticsStore() {
  globalStore.todayViews = 0;
  globalStore.todayVisitors = new Set();
  globalStore.dailyTrends = {};
  globalStore.productViews = {};
}

export function getLiveAnalyticsSummary() {
  const today = new Date().toISOString().split("T")[0];
  const todayData = globalStore.dailyTrends[today] || {
    views: 0,
    visitors: new Set(),
  };

  // Last 7 days trend
  const trends: {
    date: string;
    label: string;
    views: number;
    visitors: number;
  }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split("T")[0];
    const dayLabel = `${d.getDate()}/${d.getMonth() + 1}`;
    const entry = globalStore.dailyTrends[dateKey];
    trends.push({
      date: dateKey,
      label: dayLabel,
      views: entry ? entry.views : 0,
      visitors: entry ? entry.visitors.size : 0,
    });
  }

  // Top products
  const topProducts = Object.values(globalStore.productViews)
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  return {
    todayViews: todayData.views,
    todayVisitors: todayData.visitors.size,
    totalTrackedViews: globalStore.todayViews,
    trends,
    topProducts,
  };
}
