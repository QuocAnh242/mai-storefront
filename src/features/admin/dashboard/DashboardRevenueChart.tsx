'use client';

import React, { useState } from 'react';
import { ChartSkeleton } from '@/components/ui/Loading';
import { AnalyticsData } from './types';

interface DashboardRevenueChartProps {
  analytics: AnalyticsData | null;
  loading: boolean;
}

export function DashboardRevenueChart({ analytics, loading }: DashboardRevenueChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const trends =
    analytics?.trends && analytics.trends.length > 0
      ? analytics.trends
      : [
          { label: '09/11', date: '', views: 0, visitors: 0 },
          { label: '10/11', date: '', views: 0, visitors: 0 },
          { label: '11/11', date: '', views: 0, visitors: 0 },
          { label: '12/11', date: '', views: 0, visitors: 0 },
          { label: '13/11', date: '', views: 0, visitors: 0 },
          { label: '14/11', date: '', views: 0, visitors: 0 },
          { label: '15/11', date: '', views: 0, visitors: 0 },
        ];

  const rawMax = Math.max(1, ...trends.map((t) => Math.max(t.views, t.visitors)));
  const chartMax = rawMax <= 5 ? 5 : rawMax <= 10 ? 10 : Math.ceil(rawMax / 10) * 10;

  const svgWidth = 560;
  const svgHeight = 200;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;
  const chartWidth = svgWidth - padLeft - padRight;
  const chartHeight = svgHeight - padTop - padBottom;

  const points = trends.map((t, idx) => {
    const x = padLeft + (idx / Math.max(1, trends.length - 1)) * chartWidth;
    const yViews = padTop + chartHeight - (t.views / chartMax) * chartHeight;
    const yVisitors = padTop + chartHeight - (t.visitors / chartMax) * chartHeight;
    return { x, yViews, yVisitors, ...t };
  });

  const viewsPath = points
    .map((p, idx) => (idx === 0 ? `M ${p.x} ${p.yViews}` : `L ${p.x} ${p.yViews}`))
    .join(' ');

  const viewsAreaPath =
    points.length > 0
      ? `${viewsPath} L ${points[points.length - 1].x} ${padTop + chartHeight} L ${points[0].x} ${padTop + chartHeight} Z`
      : '';

  const visitorsPath = points
    .map((p, idx) => (idx === 0 ? `M ${p.x} ${p.yVisitors}` : `L ${p.x} ${p.yVisitors}`))
    .join(' ');

  return (
    <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Lưu lượng truy cập 7 ngày
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Biểu đồ lượt xem trang và số khách theo ngày</p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-sky-600 rounded-full inline-block" />
              <span className="text-slate-600 font-medium">Lượt xem</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-slate-800 rounded-full inline-block" />
              <span className="text-slate-600 font-medium">Khách</span>
            </div>
          </div>
        </div>

        {loading && !analytics ? (
          <div className="pt-4">
            <ChartSkeleton />
          </div>
        ) : (
          <div className="pt-4 relative">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 overflow-visible">
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Guide Lines */}
              <line x1={padLeft} y1={padTop} x2={svgWidth - padRight} y2={padTop} stroke="#e2e8f0" strokeDasharray="4 4" />
              <text x={padLeft - 8} y={padTop + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                {chartMax}
              </text>

              <line x1={padLeft} y1={padTop + chartHeight / 2} x2={svgWidth - padRight} y2={padTop + chartHeight / 2} stroke="#e2e8f0" strokeDasharray="4 4" />
              <text x={padLeft - 8} y={padTop + chartHeight / 2 + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                {Math.round(chartMax / 2)}
              </text>

              <line x1={padLeft} y1={padTop + chartHeight} x2={svgWidth - padRight} y2={padTop + chartHeight} stroke="#cbd5e1" />
              <text x={padLeft - 8} y={padTop + chartHeight + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                0
              </text>

              {/* Area & Curves */}
              {viewsAreaPath && <path d={viewsAreaPath} fill="url(#viewsGradient)" />}
              <path d={viewsPath} fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d={visitorsPath} fill="none" stroke="#0f172a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />

              {/* Points */}
              {points.map((p, idx) => {
                const isHovered = hoveredPoint === idx;
                return (
                  <g
                    key={idx}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <rect x={p.x - 18} y={padTop} width={36} height={chartHeight} fill="transparent" />
                    <circle cx={p.x} cy={p.yViews} r={isHovered ? 5 : 3.5} fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                    <circle cx={p.x} cy={p.yVisitors} r={isHovered ? 4.5 : 3} fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
                    <text
                      x={p.x}
                      y={svgHeight - 8}
                      textAnchor="middle"
                      className={`text-[11px] font-medium transition-colors ${
                        isHovered ? 'fill-sky-800 font-bold' : 'fill-slate-500'
                      }`}
                    >
                      {p.label}
                    </text>

                    {isHovered && (
                      <g>
                        <rect
                          x={Math.min(Math.max(padLeft, p.x - 55), svgWidth - padRight - 110)}
                          y={Math.max(5, p.yViews - 45)}
                          width={110}
                          height={34}
                          rx={4}
                          fill="#0f172a"
                        />
                        <text
                          x={Math.min(Math.max(padLeft, p.x - 55), svgWidth - padRight - 110) + 55}
                          y={Math.max(5, p.yViews - 45) + 14}
                          textAnchor="middle"
                          fill="#ffffff"
                          className="text-[10px] font-bold"
                        >
                          {p.label}: {p.views} lượt xem
                        </text>
                        <text
                          x={Math.min(Math.max(padLeft, p.x - 55), svgWidth - padRight - 110) + 55}
                          y={Math.max(5, p.yViews - 45) + 27}
                          textAnchor="middle"
                          fill="#94a3b8"
                          className="text-[9px]"
                        >
                          {p.visitors} khách truy cập
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-3 text-xs border-t border-slate-100 mt-2">
        <div>
          <span className="text-slate-500 block">Lượt xem hôm nay:</span>
          <strong className="text-slate-900 font-bold text-sm">
            {analytics?.todayViews || 0} lượt
          </strong>
        </div>
        <div>
          <span className="text-slate-500 block">Khách hôm nay:</span>
          <strong className="text-slate-900 font-bold text-sm">
            {analytics?.todayVisitors || 0} người
          </strong>
        </div>
      </div>
    </div>
  );
}
