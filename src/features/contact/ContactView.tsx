import React from 'react';
import { MapPin, Phone, Clock, MessageCircle, QrCode } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export function ContactView() {
  const hotlines = INITIAL_STORE_SETTINGS.hotlines || [
    { number: '0704479791', display: '0704 479 791', label: 'Ms Mai' },
    { number: '0908998098', display: '0908 998 098', label: 'Mrs Quoc' },
    { number: '0798584841', display: '0798 584 841', label: 'Ms Linh' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      <div className="bg-sky-950 text-white p-6 sm:p-10 rounded-2xl border border-sky-900 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          THÔNG TIN LIÊN HỆ MAI STORE
        </h1>
        <p className="text-xs sm:text-sm text-sky-200 mt-2 max-w-2xl leading-relaxed">
          Quý khách hàng &amp; đối tác cần mua buôn sỉ, đặt sản xuất hạt nhũ kim tuyến theo màu sắc hoặc hỗ trợ kỹ thuật xin vui lòng liên hệ trực tiếp:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl">
          <CardContent className="p-6 sm:p-8 space-y-5">
            <h2 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
              Địa Chỉ &amp; Hotline Cửa Hàng
            </h2>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Địa chỉ Cửa hàng:</strong>
                  <p className="text-xs text-slate-600 mt-0.5">{INITIAL_STORE_SETTINGS.address}</p>
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-5 h-5 text-sky-700 shrink-0" />
                  <strong className="text-slate-900 text-sm">Hotline tư vấn &amp; Đặt hàng:</strong>
                </div>

                <div className="space-y-2">
                  {hotlines.map((h) => (
                    <a
                      key={h.number}
                      href={`tel:${h.number}`}
                      className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Phone className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                        <span className="font-black text-sky-950 group-hover:text-sky-700 text-sm sm:text-base whitespace-nowrap">
                          {h.display}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium shrink-0">{h.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Zalo Bán Sỉ &amp; Lẻ:</strong>
                  <a
                    href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-bold text-sm hover:underline"
                  >
                    {INITIAL_STORE_SETTINGS.zaloPhone} (Nhắn tin trực tiếp)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Thời gian làm việc:</strong>
                  <p className="text-xs text-slate-600 mt-0.5">{INITIAL_STORE_SETTINGS.workingHours}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <a
                href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
                className="w-full bg-sky-900 hover:bg-sky-950 text-white font-bold text-xs py-3 rounded-lg text-center transition-colors"
              >
                Gọi Ngay Trực Tiếp
              </a>
              <a
                href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-lg text-center transition-colors"
              >
                Chat Qua Zalo
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-6 sm:p-8 space-y-5">
            <h2 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-sky-700" />
              <span>Thông Tin Chuyển Khoản Chính Thức</span>
            </h2>

            <p className="text-xs text-slate-600">
              Quý khách chuyển khoản hoặc đặt cọc đơn hàng sỉ vui lòng chuyển đúng thông tin tài khoản chính thức của cửa hàng:
            </p>

            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-sky-100">
                <span className="text-slate-500">Ngân hàng:</span>
                <span className="font-bold text-slate-900">{INITIAL_STORE_SETTINGS.bankName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sky-100">
                <span className="text-slate-500">Số tài khoản:</span>
                <span className="font-mono font-bold text-sky-900 text-sm">
                  {INITIAL_STORE_SETTINGS.bankAccountNumber}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Chủ tài khoản:</span>
                <span className="font-bold text-slate-900">{INITIAL_STORE_SETTINGS.bankAccountName}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase block">
                Mã VietQR Thanh Toán Cửa Hàng
              </span>
              <img
                src={`https://img.vietqr.io/image/${INITIAL_STORE_SETTINGS.bankName}-${INITIAL_STORE_SETTINGS.bankAccountNumber}-compact2.png?accountName=${encodeURIComponent(INITIAL_STORE_SETTINGS.bankAccountName)}`}
                alt="Mã QR thanh toán Mai Store"
                className="w-44 h-44 object-contain mx-auto border border-slate-200 rounded-xl p-2 bg-white"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
