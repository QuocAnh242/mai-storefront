'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Modal, Button, Input, Field } from '@/components/ui';

interface AdminLoginModalProps {
  open?: boolean;
  onClose: () => void;
}

export function AdminLoginModal({ open = true, onClose }: AdminLoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts >= 15) {
      setErrorMsg('Bạn đã thử sai quá 15 lần. Vui lòng đợi vài giây rồi thử lại!');
      return;
    }
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
        setAttempts((prev) => prev + 1);
        return;
      }

      if (data.session) {
        try {
          const { supabase } = await import('@/lib/supabase');
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          });
        } catch (clientErr) {
          console.warn('Client auth sync notice:', clientErr);
        }
      }

      toast.success('Đăng nhập thành công! Chào mừng Quản trị viên');
      onClose();
      router.push('/admin');
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
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (!next && !loading) onClose();
      }}
      title="Đăng Nhập Quản Trị Viên"
      headerVariant="light"
      size="md"
      closeDisabled={loading}
    >
      <div className="p-6 space-y-5">
        <div className="text-center space-y-2">
          <Image
            src="/logo2.jpeg"
            alt="Mai Kim Tuyến Logo"
            width={56}
            height={56}
            className="w-14 h-14 rounded-full object-cover border-2 border-sky-100 mx-auto shadow-xs"
          />
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
            {errorMsg.includes('không chính xác') && (
              <p className="text-[11px] text-rose-600 mt-1 font-normal">
                Lưu ý: Kiểm tra phím Caps Lock hoặc tắt bộ gõ tiếng Việt khi gõ mật khẩu.
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Field label="Email" required>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="email"
                required
                autoFocus
                placeholder="youremail@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
              />
            </div>
          </Field>

          <Field label="Mật khẩu" required>
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition-colors"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </Field>

          <Button type="submit" isLoading={loading} size="lg" className="w-full">
            {loading ? 'Đang xác thực...' : 'Đăng Nhập Dashboard'}
          </Button>
        </form>
      </div>
    </Modal>
  );
}
