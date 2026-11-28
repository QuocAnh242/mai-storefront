import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export const metadata: Metadata = {
  title: 'Chính Sách Đổi Trả & Bảo Hành Quy Cách',
  description:
    'Quy định kiểm hàng, đổi trả trong 7 ngày nếu sai quy cách hoặc lỗi xưởng tại tổng kho Mai Kim Tuyến.',
};

export default function ReturnPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <div className="flex items-center gap-2 text-xs text-slate-500 border-b border-slate-100 pb-3">
        <Link href="/" className="hover:text-sky-900 inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Trang chủ
        </Link>
        <span>/</span>
        <span className="font-bold text-slate-800">Đổi trả &amp; bảo hành</span>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-6 h-6 text-sky-800 shrink-0" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Chính Sách Kiểm Hàng, Đổi Trả &amp; Bảo Hành
            </h1>
          </div>

          <section className="space-y-1.5">
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              1. Điều kiện đổi trả trong 7 ngày
            </h2>
            <p>
              Mai Kim Tuyến hỗ trợ đổi mới hoặc hoàn tiền 100% trong vòng <strong>7 ngày</strong> kể từ ngày nhận hàng nếu sản phẩm giao sai mã màu, sai kích thước hạt (size kim tuyến), sai quy cách đóng gói (hũ/bao/cuộn) hoặc phát sinh lỗi từ nhà sản xuất.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              2. Quy trình kiểm tra hàng &amp; chành xe đi tỉnh
            </h2>
            <p>
              Khách hàng nội thành TP.HCM hoặc nhận qua chành xe được quyền kiểm tra ngoại quan bao bì, tem nhãn và quy cách trước khi xác nhận nhận đủ kiện. Khi phát sinh sai sót, vui lòng chụp ảnh/quay video kiện hàng và gửi ngay qua Zalo{' '}
              <strong className="text-sky-900">{INITIAL_STORE_SETTINGS.zaloPhone}</strong> để kho xử lý đổi bù ngay trong ngày.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              3. Trường hợp không áp dụng đổi trả
            </h2>
            <p>
              Sản phẩm đã mở bao bì và pha trộn hóa chất/keo hoặc hư hỏng do bảo quản ẩm ướt không đúng hướng dẫn sau khi đã bàn giao đủ quy cách.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
