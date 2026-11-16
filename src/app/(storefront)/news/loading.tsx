import React from 'react';
import { Loading } from '@/components/ui/Loading';

export default function NewsLoading() {
  return (
    <div className="space-y-8 py-6">
      <div className="bg-slate-100 rounded-3xl p-10 animate-pulse space-y-4 text-center max-w-2xl mx-auto">
        <div className="h-6 bg-slate-200 rounded w-1/4 mx-auto" />
        <div className="h-10 bg-slate-200 rounded w-3/4 mx-auto" />
        <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto" />
      </div>

      <div className="py-2 text-center">
        <Loading size="md" text="Đang tải cẩm nang & tin tức..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="aspect-video bg-slate-100 rounded-xl" />
            <div className="h-3 bg-slate-200 rounded w-1/3" />
            <div className="h-5 bg-slate-200 rounded w-5/6" />
            <div className="h-3 bg-slate-100 rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
