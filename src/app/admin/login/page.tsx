'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/shared/context/ToastContext';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // 1. Authenticate with Server (Rate limit check & HttpOnly Cookies)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const msg = data.message || 'Tài khoản hoặc mật khẩu không chính xác';
        setErrorMsg(msg);
        showToast(msg, 'error');
        setLoading(false);
        return;
      }

      // 2. Establish Client-Side Supabase Session for RLS queries
      if (data.session) {
        try {
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          });
        } catch (clientErr) {
          console.warn('Client auth sync notice:', clientErr);
        }
      }

      // Successful JWT Login
      showToast('Đăng nhập thành công! Chào mừng Quản trị viên', 'success');
      router.push('/admin/san-pham');
      router.refresh();
    } catch (err: any) {
      const msg = err.message || 'Lỗi hệ thống đăng nhập';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <img
          src="/logo.jpg"
          alt="Mai Kim Tuyến Logo"
          className="w-16 h-16 rounded-full object-cover border-2 border-sky-100 mx-auto shadow-xs"
        />
        <h1 className="text-2xl font-black text-slate-900 uppercase">Đăng Nhập Quản Trị Viên</h1>
        <p className="text-xs text-slate-500">
          Hệ thống quản lý cửa hàng Mai Kim Tuyến
        </p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3 rounded-xl">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Tài khoản Admin / Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="youremail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-sky-600 focus:bg-white font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu (*)</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl pl-9 pr-10 py-2.5 outline-none focus:border-sky-600 focus:bg-white font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition-colors"
              title={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-900 hover:bg-sky-950 text-white font-bold text-sm py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{loading ? 'Đang xác thực JWT...' : 'Vào Trang Quản Lý ➔'}</span>
        </button>
      </form>
    </div>
  );
}
