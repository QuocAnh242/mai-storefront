import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase';
import { withAdminRoute, ok, fail } from '@/lib/api/withAdminRoute';
import { NextResponse } from 'next/server';
import { applySessionCookies } from '@/lib/adminAuth';

export const GET = withAdminRoute(
  {
    rateLimit: { key: 'acc_get', limit: 60, windowSeconds: 60 },
    requireServiceRole: false,
  },
  async ({ auth }) => {
    // Preserve the custom not-configured response shape
    if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
      return applySessionCookies(
        NextResponse.json({
          success: false,
          requiresServiceRole: true,
          error: 'Chưa cấu hình biến môi trường SUPABASE_SERVICE_ROLE_KEY trong .env.local. Vui lòng lấy Service Role Secret từ Supabase Dashboard (Settings -> API) để truy xuất danh sách người dùng qua API thật.',
          data: [],
        }),
        auth.newSession,
      );
    }

    // Call Real Supabase Auth API to list all users
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });

    if (error) {
      return fail(error.message, 500);
    }

    const accounts = (data.users || []).map((u) => ({
      id: u.id,
      email: u.email || '',
      fullName: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Quản trị viên',
      role: 'super_admin',
      createdAt: u.created_at,
      lastLoginAt: u.last_sign_in_at,
    }));

    return ok({ data: accounts }, { newSession: auth.newSession });
  },
);

export const POST = withAdminRoute(
  {
    rateLimit: { key: 'acc_create', limit: 30, windowSeconds: 60 },
    requireServiceRole: false,
  },
  async ({ req, auth }) => {
    const body = await req.json();
    const { email, fullName, password } = body;

    if (!email || !email.includes('@')) {
      return fail('Email không hợp lệ', 400);
    }
    if (!password || password.length < 6) {
      return fail('Mật khẩu phải tối thiểu 6 ký tự', 400);
    }

    // Preserve the custom not-configured response shape
    if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
      return fail(
        'Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY trong .env.local để tạo tài khoản trực tiếp qua Supabase Auth API.',
        500,
      );
    }

    // Call Real Supabase Auth API to create user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password,
      email_confirm: true, // Auto-confirm email so user can login immediately
      user_metadata: {
        full_name: fullName?.trim() || 'Quản trị viên',
      },
    });

    if (error) {
      return fail(error.message, 400);
    }

    return ok(
      {
        data: {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.user_metadata?.full_name || fullName,
          role: 'super_admin',
          createdAt: data.user.created_at,
        },
      },
      { newSession: auth.newSession },
    );
  },
);

export const PATCH = withAdminRoute(
  {
    rateLimit: { key: 'acc_patch', limit: 30, windowSeconds: 60 },
    requireServiceRole: false,
  },
  async ({ req, auth }) => {
    const body = await req.json();
    const { action, accountId, newPassword } = body;

    if (action === 'change_password') {
      if (!newPassword || newPassword.length < 6) {
        return fail('Mật khẩu mới tối thiểu 6 ký tự', 400);
      }

      // Preserve the custom not-configured response shape
      if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
        return fail(
          'Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY trong .env.local để đổi mật khẩu qua Supabase Auth API.',
          500,
        );
      }

      // Call Real Supabase Auth API to update user password
      const { error } = await supabaseAdmin.auth.admin.updateUserById(accountId, {
        password: newPassword,
      });

      if (error) {
        return fail(error.message, 400);
      }

      return ok({}, { message: 'Đổi mật khẩu thành công qua Supabase Auth API', newSession: auth.newSession });
    }

    return fail('Hành động không hợp lệ', 400);
  },
);

export const DELETE = withAdminRoute(
  {
    rateLimit: { key: 'acc_del', limit: 30, windowSeconds: 60 },
    requireServiceRole: false,
  },
  async ({ req, auth }) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return fail('Thiếu account ID', 400);
    }

    // Preserve the custom not-configured response shape
    if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
      return fail(
        'Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY trong .env.local để xóa tài khoản qua Supabase Auth API.',
        500,
      );
    }

    // Call Real Supabase Auth API to delete user
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      return fail(error.message, 400);
    }

    return ok({}, { message: 'Đã xóa tài khoản thành công qua Supabase Auth API', newSession: auth.newSession });
  },
);
