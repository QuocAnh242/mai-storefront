import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Endpoint to sync the active Supabase session to the client-side JavaScript SDK
 * Reads the HttpOnly auth cookies and returns the active session tokens.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;
    const refreshToken = cookieStore.get('sb-refresh-token')?.value;

    if (!accessToken) {
      return NextResponse.json({ session: null });
    }

    return NextResponse.json({
      session: {
        access_token: accessToken,
        refresh_token: refreshToken || '',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ session: null, error: error.message }, { status: 500 });
  }
}
