export interface AnalyticsData {
  todayViews: number;
  todayVisitors: number;
  totalTrackedViews: number;
  trends: { date: string; label: string; views: number; visitors: number }[];
  topProducts: { id: string; title: string; views: number }[];
  requiresTableSetup?: boolean;
}
