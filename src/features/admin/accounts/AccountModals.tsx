'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Field, Input, Modal } from '@/components/ui';
import { AdminAccount } from '../hooks/useAdminAccounts';

const CreateAccountSchema = z
  .object({
    email: z.string().email('Email không hợp lệ'),
    fullName: z.string().min(1, 'Vui lòng nhập họ tên').max(100),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Mật khẩu xác nhận không trùng khớp',
    path: ['confirmPassword'],
  });

const ChangePasswordSchema = z
  .object({
    newPassword: z.string().min(6, 'Mật khẩu mới tối thiểu 6 ký tự'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Mật khẩu xác nhận không trùng khớp',
    path: ['confirmPassword'],
  });

type CreateAccountForm = z.infer<typeof CreateAccountSchema>;
type ChangePasswordForm = z.infer<typeof ChangePasswordSchema>;

export function AccountCreateModal({
  open,
  onOpenChange,
  isSubmitting,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
  onCreate: (payload: { email: string; fullName: string; password: string }) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAccountForm>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: { email: '', fullName: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: CreateAccountForm) => {
    await onCreate({
      email: values.email.trim(),
      fullName: values.fullName.trim(),
      password: values.password,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Tạo tài khoản mới trên Supabase Auth"
      headerVariant="light"
      size="md"
      closeDisabled={isSubmitting}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
        <Field label="Email đăng nhập" required error={errors.email?.message}>
          <Input
            type="email"
            placeholder="admin@maikimtuyen.io.vn"
            hasError={Boolean(errors.email)}
            {...register('email')}
          />
        </Field>
        <Field label="Tên quản trị viên" required error={errors.fullName?.message}>
          <Input
            type="text"
            placeholder="Ví dụ: Nguyễn Văn An"
            hasError={Boolean(errors.fullName)}
            {...register('fullName')}
          />
        </Field>
        <Field label="Mật khẩu khởi tạo" required error={errors.password?.message}>
          <Input
            type="password"
            placeholder="••••••••"
            hasError={Boolean(errors.password)}
            {...register('password')}
          />
        </Field>
        <Field label="Xác nhận mật khẩu" required error={errors.confirmPassword?.message}>
          <Input
            type="password"
            placeholder="••••••••"
            hasError={Boolean(errors.confirmPassword)}
            {...register('confirmPassword')}
          />
        </Field>

        <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            Tạo tài khoản
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function AccountPasswordModal({
  account,
  onClose,
  isSubmitting,
  onSavePassword,
}: {
  account: AdminAccount | null;
  onClose: () => void;
  isSubmitting: boolean;
  onSavePassword: (accountId: string, newPassword: string) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (values: ChangePasswordForm) => {
    if (!account) return;
    await onSavePassword(account.id, values.newPassword);
    reset();
    onClose();
  };

  return (
    <Modal
      open={Boolean(account)}
      onOpenChange={(open) => !open && !isSubmitting && onClose()}
      title="Đổi mật khẩu tài khoản"
      description={account ? `Tài khoản: ${account.email}` : undefined}
      headerVariant="light"
      size="md"
      closeDisabled={isSubmitting}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
        <Field label="Mật khẩu mới" required error={errors.newPassword?.message}>
          <Input
            type="password"
            autoFocus
            placeholder="••••••••"
            hasError={Boolean(errors.newPassword)}
            {...register('newPassword')}
          />
        </Field>
        <Field label="Xác nhận mật khẩu mới" required error={errors.confirmPassword?.message}>
          <Input
            type="password"
            placeholder="••••••••"
            hasError={Boolean(errors.confirmPassword)}
            {...register('confirmPassword')}
          />
        </Field>

        <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            Lưu mật khẩu mới
          </Button>
        </div>
      </form>
    </Modal>
  );
}
