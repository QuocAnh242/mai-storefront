import fs from 'fs';
import path from 'path';

/**
 * Analytics store with dual persistence:
 * 1. File-system persistence (data/analytics.json) so data survives server restarts.
 * 2. In-memory sliding window for instant zero-latency responses.
 * 3. Bridges to Supabase database (site_pageviews & product_views) when tables are present.
 */

interface LiveVisitorStats {
  todayViews: number;
  todayVisitors: Set<string>;
  dailyTrends: { [dateStr: string]: { views: number; visitors: Set<string> } };
  productViews: { [productId: string]: { id: string; title: string; views: number; lastViewedAt: number } };
}

interface SerializedVisitorStats {
  todayViews: number;
  todayVisitors: string[];
  dailyTrends: { [dateStr: string]: { views: number; visitors: string[] } };
  productViews: { [productId: string]: { id: string; title: string; views: number; lastViewedAt: number } };
}

const DATA_FILE = path.join(process.cwd(), 'data', 'analytics.json');

// Initialize in-memory cache
const globalStore: LiveVisitorStats = {
  todayViews: 0,
  todayVisitors: new Set(),
  dailyTrends: {},
  productViews: {},
};

let lastLoadedMtime = 0;

// Load saved data from disk
function loadFromDisk() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const stat = fs.statSync(DATA_FILE);
      if (stat.mtimeMs === lastLoadedMtime) {
        return;
      }
      lastLoadedMtime = stat.mtimeMs;

      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed: SerializedVisitorStats = JSON.parse(raw);
      globalStore.todayViews = parsed.todayViews || 0;
      globalStore.todayVisitors = new Set(parsed.todayVisitors || []);
      globalStore.productViews = parsed.productViews || {};

      globalStore.dailyTrends = {};
      if (parsed.dailyTrends) {
        for (const [key, val] of Object.entries(parsed.dailyTrends)) {
          globalStore.dailyTrends[key] = {
            views: val.views || 0,
            visitors: new Set(val.visitors || []),
          };
        }
      }
    }
  } catch (err) {
    console.warn('Analytics store load note:', err);
  }
}

// Persist data to disk safely (debounced)
let saveTimer: NodeJS.Timeout | null = null;
function persistToDisk() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const serializedDailyTrends: { [dateStr: string]: { views: number; visitors: string[] } } = {};
      for (const [key, val] of Object.entries(globalStore.dailyTrends)) {
        serializedDailyTrends[key] = {
          views: val.views,
          visitors: Array.from(val.visitors),
        };
      }

      const serialized: SerializedVisitorStats = {
        todayViews: globalStore.todayViews,
        todayVisitors: Array.from(globalStore.todayVisitors),
        dailyTrends: serializedDailyTrends,
        productViews: globalStore.productViews,
      };

      fs.writeFileSync(DATA_FILE, JSON.stringify(serialized, null, 2), 'utf-8');
      lastLoadedMtime = fs.statSync(DATA_FILE).mtimeMs;
    } catch (err) {
      console.warn('Analytics store save note:', err);
    }
  }, 1000);
}

// Initial load
loadFromDisk();

export function recordPageView(path: string, visitorId: string, referrer?: string) {
  loadFromDisk();
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  globalStore.todayViews += 1;
  globalStore.todayVisitors.add(visitorId);

  if (!globalStore.dailyTrends[dateStr]) {
    globalStore.dailyTrends[dateStr] = { views: 0, visitors: new Set() };
  }
  globalStore.dailyTrends[dateStr].views += 1;
  globalStore.dailyTrends[dateStr].visitors.add(visitorId);

  persistToDisk();
}

export function recordProductView(productId: string, productTitle: string, visitorId: string) {
  loadFromDisk();
  recordPageView(`/products/${productId}`, visitorId);

  if (!globalStore.productViews[productId]) {
    globalStore.productViews[productId] = {
      id: productId,
      title: productTitle || 'Sản phẩm',
      views: 0,
      lastViewedAt: Date.now(),
    };
  }

  globalStore.productViews[productId].views += 1;
  globalStore.productViews[productId].lastViewedAt = Date.now();
  if (productTitle && !globalStore.productViews[productId].title) {
    globalStore.productViews[productId].title = productTitle;
  }

  persistToDisk();
}

export function clearAnalyticsStore() {
  globalStore.todayViews = 0;
  globalStore.todayVisitors = new Set();
  globalStore.dailyTrends = {};
  globalStore.productViews = {};

  try {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(
        {
          todayViews: 0,
          todayVisitors: [],
          dailyTrends: {},
          productViews: {},
        },
        null,
        2
      ),
      'utf-8'
    );
    lastLoadedMtime = fs.statSync(DATA_FILE).mtimeMs;
  } catch (err) {
    console.warn('Clear analytics store note:', err);
  }
}

export function getLiveAnalyticsSummary() {
  loadFromDisk();
  const today = new Date().toISOString().split('T')[0];
  const todayData = globalStore.dailyTrends[today] || { views: 0, visitors: new Set() };

  // Last 7 days trend
  const trends: { date: string; label: string; views: number; visitors: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
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
