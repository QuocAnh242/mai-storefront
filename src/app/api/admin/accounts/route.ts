import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin, isSupabaseConfigured, isSupabaseAdminConfigured } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rateLimit';

// Helper: Ensure the requester is an authorized admin
async function verifyAdminAuth(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('sb-access-token')?.value;
  if (!token) return false;

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return false;
  }
  return true;
}

export async function GET(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateLimit = checkRateLimit(`acc_get_${clientIp}`, 60, 60);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'RATE_LIMIT_EXCEEDED' }, { status: 429 });
    }

    const isAuthed = await verifyAdminAuth(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
      return NextResponse.json({
        success: false,
        requiresServiceRole: true,
        error: 'Chưa cấu hình biến môi trường SUPABASE_SERVICE_ROLE_KEY trong .env.local. Vui lòng lấy Service Role Secret từ Supabase Dashboard (Settings -> API) để truy xuất danh sách người dùng qua API thật.',
        data: [],
      });
    }

    // Call Real Supabase Auth API to list all users
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const accounts = (data.users || []).map((u) => ({
      id: u.id,
      email: u.email || '',
      fullName: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Quản trị viên',
      role: 'super_admin',
      createdAt: u.created_at,
      lastLoginAt: u.last_sign_in_at,
    }));

    return NextResponse.json({ success: true, data: accounts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateLimit = checkRateLimit(`acc_create_${clientIp}`, 30, 60);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'RATE_LIMIT_EXCEEDED' }, { status: 429 });
    }

    const isAuthed = await verifyAdminAuth(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const body = await req.json();
    const { email, fullName, password } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu phải tối thiểu 6 ký tự' }, { status: 400 });
    }

    if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY trong .env.local để tạo tài khoản trực tiếp qua Supabase Auth API.',
        },
        { status: 500 }
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
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.user_metadata?.full_name || fullName,
        role: 'super_admin',
        createdAt: data.user.created_at,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateLimit = checkRateLimit(`acc_patch_${clientIp}`, 30, 60);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'RATE_LIMIT_EXCEEDED' }, { status: 429 });
    }

    const isAuthed = await verifyAdminAuth(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const body = await req.json();
    const { action, accountId, newPassword } = body;

    if (action === 'change_password') {
      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ error: 'Mật khẩu mới tối thiểu 6 ký tự' }, { status: 400 });
      }

      if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
        return NextResponse.json(
          {
            error: 'Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY trong .env.local để đổi mật khẩu qua Supabase Auth API.',
          },
          { status: 500 }
        );
      }

      // Call Real Supabase Auth API to update user password
      const { error } = await supabaseAdmin.auth.admin.updateUserById(accountId, {
        password: newPassword,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: 'Đổi mật khẩu thành công qua Supabase Auth API' });
    }

    return NextResponse.json({ error: 'Hành động không hợp lệ' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateLimit = checkRateLimit(`acc_del_${clientIp}`, 30, 60);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'RATE_LIMIT_EXCEEDED' }, { status: 429 });
    }

    const isAuthed = await verifyAdminAuth(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get('id');

    if (!accountId) {
      return NextResponse.json({ error: 'Thiếu ID tài khoản' }, { status: 400 });
    }

    if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY trong .env.local để xóa tài khoản qua Supabase Auth API.',
        },
        { status: 500 }
      );
    }

    // Call Real Supabase Auth API to delete user
    const { error } = await supabaseAdmin.auth.admin.deleteUser(accountId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Đã xóa tài khoản khỏi Supabase Auth' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
