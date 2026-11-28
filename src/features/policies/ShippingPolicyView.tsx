import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Truck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export function ShippingPolicyView() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <div className="flex items-center gap-2 text-xs text-slate-500 border-b border-slate-100 pb-3">
        <Link href="/" className="hover:text-sky-900 inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Trang chủ
        </Link>
        <span>/</span>
        <span className="font-bold text-slate-800">Cách thức giao hàng</span>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-sky-800 shrink-0" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Cách Thức Giao Hàng
            </h1>
          </div>

          <section className="space-y-1.5">
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              1. Giao nhanh nội thành TP.HCM (Trong ngày)
            </h2>
            <p>
              Đối với các đơn lẻ hoặc đơn vừa tại TP.HCM, cửa hàng hỗ trợ đặt giao nhanh trong 1–3 giờ qua Grab, Ahamove, Lalamove. Với đơn sỉ số lượng lớn (bao 25kg, thùng keo), kho sắp xếp xe ba gác hoặc xe tải giao tận nơi theo thỏa thuận.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              2. Gửi chành xe đi tỉnh toàn quốc
            </h2>
            <p>
              Kho hàng đặt tại khu vực Chợ Lớn Quận 5 nên thuận tiện gửi hàng hằng ngày ra các chành xe đi miền Tây, miền Đông, Tây Nguyên, miền Trung và miền Bắc theo nhà xe quen của quý khách. Sau khi giao hàng ra chành, nhân viên chụp ảnh kiện hàng và biên nhận gửi qua Zalo để tiện theo dõi.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              3. Chuyển phát nhanh toàn quốc
            </h2>
            <p>
              Các đơn hũ lẻ, hàng mẫu hoặc đơn đóng thùng gọn nhẹ được gửi qua Giao Hàng Tiết Kiệm (GHTK), Viettel Post hoặc J&amp;T Express với thời gian nhận dự kiến từ 2–4 ngày làm việc.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              4. Nhận hàng trực tiếp &amp; kiểm tra quy cách
            </h2>
            <p>
              Quý khách có thể đến trực tiếp cửa hàng tại{' '}
              <strong>{INITIAL_STORE_SETTINGS.address}</strong> ({INITIAL_STORE_SETTINGS.workingHours}) để xem mẫu và nhận hàng. Mọi thắc mắc về lịch gửi hàng hoặc cước phí, vui lòng liên hệ Zalo{' '}
              <strong className="text-sky-900">{INITIAL_STORE_SETTINGS.zaloPhone}</strong> hoặc hotline{' '}
              <strong className="text-sky-900">{INITIAL_STORE_SETTINGS.hotline}</strong>.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
