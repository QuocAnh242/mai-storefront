'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Card, Input, Select } from '@/components/ui';
import { ReviewStats } from '../hooks/useAdminReviews';

interface ReviewsToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  ratingFilter: 'all' | '5' | '4' | '3' | '2' | '1';
  onRatingChange: (r: 'all' | '5' | '4' | '3' | '2' | '1') => void;
  statusFilter: 'all' | 'unreplied' | 'replied' | 'hidden';
  onStatusChange: (s: 'all' | 'unreplied' | 'replied' | 'hidden') => void;
  stats: ReviewStats;
}

export function ReviewsToolbar({
  searchQuery,
  onSearchChange,
  ratingFilter,
  onRatingChange,
  statusFilter,
  onStatusChange,
  stats,
}: ReviewsToolbarProps) {
  return (
    <Card className="p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Tìm theo tên khách, nội dung cảm nhận hoặc tên sản phẩm..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 py-2 text-xs"
        />
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <Select
          value={ratingFilter}
          onChange={(e) => onRatingChange(e.target.value as typeof ratingFilter)}
          className="py-2 text-xs w-auto"
        >
          <option value="all">Tất cả số điểm</option>
          <option value="5">5 Điểm (Rất tốt)</option>
          <option value="4">4 Điểm (Hài lòng)</option>
          <option value="3">3 Điểm (Bình thường)</option>
          <option value="2">2 Điểm (Chưa tốt)</option>
          <option value="1">1 Điểm (Rất tệ)</option>
        </Select>

        <Select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as typeof statusFilter)}
          className="py-2 text-xs w-auto"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="unreplied">Chưa phản hồi ({stats.unreplied})</option>
          <option value="replied">Đã phản hồi ({stats.replied})</option>
          <option value="hidden">Chờ duyệt / Bị ẩn</option>
        </Select>
      </div>
    </Card>
  );
}
