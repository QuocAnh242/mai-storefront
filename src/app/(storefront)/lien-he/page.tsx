'use client';

import React from 'react';
import { MapPin, Phone, Clock, MessageCircle, QrCode } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export default function LienHePage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-sky-900 to-sky-800 text-white p-8 sm:p-10 rounded-3xl border border-sky-800 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">THÔNG TIN LIÊN HỆ MAI STORE</h1>
        <p className="text-xs sm:text-sm text-sky-100/90 mt-2">
          Quý khách hàng & đối tác cần mua buôn sỉ, đặt sản xuất hạt nhũ kim tuyến theo màu sắc hoặc hỗ trợ kỹ thuật xin vui lòng liên hệ trực tiếp:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Direct Contact Info */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
          <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
            Địa Chỉ & Hotline Cửa Hàng
          </h3>

          <div className="space-y-4 text-sm text-slate-700">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900">Địa chỉ xưởng & Cửa hàng:</strong>
                <p className="text-xs text-slate-600 mt-0.5">{INITIAL_STORE_SETTINGS.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900">Hotline tư vấn & Đặt hàng:</strong>
                <a href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`} className="text-sky-700 font-black text-base hover:underline">
                  {INITIAL_STORE_SETTINGS.hotline}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900">Zalo Bán Sỉ & Lẻ:</strong>
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
              <Clock className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900">Thời gian làm việc:</strong>
                <p className="text-xs text-slate-600 mt-0.5">{INITIAL_STORE_SETTINGS.workingHours}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-3">
            <a
              href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
              className="w-full bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs py-3 rounded-full text-center transition-colors shadow-xs"
            >
              Gọi Ngay Trực Tiếp
            </a>
            <a
              href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-full text-center transition-colors shadow-xs"
            >
              Chat Qua Zalo
            </a>
          </div>
        </div>

        {/* Right Column: Bank QR Payment Info */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
          <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-sky-600" />
            <span>Thanh Toán Chuyển Khoản QR Ngân Hàng</span>
          </h3>

          <p className="text-xs text-slate-600">
            Quý khách chuyển khoản thanh toán hoặc đặt cọc vui lòng chuyển đúng thông tin tài khoản chính thức của cửa hàng:
          </p>

          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-sky-100">
              <span className="text-slate-500">Ngân hàng:</span>
              <span className="font-bold text-slate-900">{INITIAL_STORE_SETTINGS.bankName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-sky-100">
              <span className="text-slate-500">Số tài khoản:</span>
              <span className="font-mono font-bold text-sky-900 text-sm">{INITIAL_STORE_SETTINGS.bankAccountNumber}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Chủ tài khoản:</span>
              <span className="font-bold text-slate-900">{INITIAL_STORE_SETTINGS.bankAccountName}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-2">
            <span className="text-[11px] font-bold text-slate-600 uppercase">Mã VietQR Thanh Toán Cửa Hàng</span>
            <img
              src={`https://img.vietqr.io/image/${INITIAL_STORE_SETTINGS.bankName}-${INITIAL_STORE_SETTINGS.bankAccountNumber}-compact2.png?accountName=${encodeURIComponent(INITIAL_STORE_SETTINGS.bankAccountName)}`}
              alt="Mã QR thanh toán Mai Store"
              className="w-44 h-44 object-contain mx-auto border border-slate-200 rounded-2xl p-2 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
