'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Button, Card, Field, Input } from '@/components/ui';

export function AdminLoginView() {
  const router = useRouter();
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const msg = data.message || 'Tài khoản hoặc mật khẩu không chính xác';
        setErrorMsg(msg);
        toast.error(msg);
        return;
      }

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

      toast.success('Đăng nhập thành công! Chào mừng Quản trị viên');
      const fromParam =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('from')
          : null;
      router.push(fromParam && fromParam.startsWith('/admin') ? fromParam : '/admin');
      router.refresh();
    } catch (err) {
      const msg = (err as Error).message || 'Lỗi hệ thống đăng nhập';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto my-12 p-8 rounded-2xl shadow-lg space-y-6">
      <div className="text-center space-y-2">
        <Image
          src="/logo2.jpeg"
          alt="Mai Kim Tuyến Logo"
          width={64}
          height={64}
          className="w-16 h-16 rounded-full object-cover border-2 border-sky-100 mx-auto shadow-xs"
        />
        <h1 className="text-2xl font-black text-slate-900 uppercase">
          Đăng Nhập Quản Trị Viên
        </h1>
        <p className="text-xs text-slate-500">Hệ thống quản lý cửa hàng Mai Kim Tuyến</p>
      </div>

      {errorMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold border ${
            errorMsg.includes('quá nhanh') || errorMsg.includes('nhiều lần')
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}
        >
          <p className="font-bold">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <Field label="Tài khoản Admin / Email" required>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="email"
              required
              placeholder="youremail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
            />
          </div>
        </Field>

        <Field label="Mật khẩu" required hint="Kiểm tra bộ gõ tiếng Việt trước khi nhập">
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              title={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </Field>

        <Button type="submit" isLoading={loading} size="lg" className="w-full">
          {loading ? 'Đang xác thực JWT...' : 'Vào Trang Quản Lý'}
        </Button>
      </form>
    </Card>
  );
}
