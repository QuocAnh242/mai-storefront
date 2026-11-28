import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export const metadata: Metadata = {
  title: 'Chính Sách Bảo Mật Thông Tin',
  description:
    'Chính sách bảo mật thông tin khách hàng và đối tác mua sỉ lẻ tại Cửa hàng Mai Kim Tuyến Chợ Lớn TP.HCM.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <div className="flex items-center gap-2 text-xs text-slate-500 border-b border-slate-100 pb-3">
        <Link href="/" className="hover:text-sky-900 inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Trang chủ
        </Link>
        <span>/</span>
        <span className="font-bold text-slate-800">Chính sách bảo mật</span>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-sky-800 shrink-0" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Chính Sách Bảo Mật Thông Tin
            </h1>
          </div>

          <section className="space-y-1.5">
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              1. Mục đích thu thập thông tin
            </h2>
            <p>
              Khi quý khách liên hệ tư vấn báo giá qua Zalo, Hotline hoặc gửi đánh giá sản phẩm trên website{' '}
              <strong>Mai Kim Tuyến</strong>, chúng tôi chỉ ghi nhận các thông tin cần thiết (tên người liên hệ, số điện thoại, địa chỉ nhận hàng/chành xe) để phục vụ báo giá, đóng kiện và giao hàng đúng hẹn.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              2. Cam kết bảo mật &amp; không chia sẻ bên thứ ba
            </h2>
            <p>
              Toàn bộ thông tin liên hệ và lịch sử giao dịch sỉ/lẻ của đại lý và khách hàng được bảo mật tuyệt đối, không bán, trao đổi hoặc tiết lộ cho bên thứ ba trừ trường hợp đơn vị vận chuyển/chành xe cần thông tin người nhận để giao hàng.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              3. Liên hệ hỗ trợ dữ liệu
            </h2>
            <p>
              Mọi yêu cầu chỉnh sửa hoặc xóa thông tin liên hệ, quý khách vui lòng liên hệ trực tiếp cửa hàng tại{' '}
              <strong>{INITIAL_STORE_SETTINGS.address}</strong> hoặc qua hotline{' '}
              <strong className="text-sky-900">{INITIAL_STORE_SETTINGS.hotline}</strong>.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
