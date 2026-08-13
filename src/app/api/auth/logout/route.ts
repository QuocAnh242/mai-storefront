import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST() {
  try {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }

    const response = NextResponse.json({ success: true, message: 'Đã đăng xuất' });

    // Clear HttpOnly auth cookies
    response.cookies.set('sb-access-token', '', { path: '/', maxAge: 0 });
    response.cookies.set('sb-refresh-token', '', { path: '/', maxAge: 0 });
    response.cookies.set('mkt_admin_logged_in', '', { path: '/', maxAge: 0 });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
