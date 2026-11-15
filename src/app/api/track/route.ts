import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rateLimit';
import { recordPageView, recordProductView } from '@/lib/analyticsStore';

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limit: Max 60 tracking hits per minute per IP to prevent spam
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const rateLimit = checkRateLimit(`track_${clientIp}`, 60, 60);
    if (!rateLimit.allowed) {
      return NextResponse.json({ success: false, rateLimited: true }, { status: 429 });
    }

    const userAgent = req.headers.get('user-agent') || '';
    const referrer = req.headers.get('referer') || '';

    // Anonymous visitor hash (IP + User-Agent hashed)
    const visitorId = crypto
      .createHash('sha256')
      .update(`${clientIp}:${userAgent.slice(0, 50)}`)
      .digest('hex')
      .slice(0, 16);

    const body = await req.json().catch(() => ({}));
    const { type, path, productId, productTitle } = body;

    // 2. In-memory real-time store
    if (type === 'product_view' && productId) {
      recordProductView(String(productId), String(productTitle || ''), visitorId);
    } else {
      recordPageView(String(path || '/'), visitorId, referrer);
    }

    // 3. Supabase persistence (non-blocking)
    if (isSupabaseConfigured()) {
      try {
        if (type === 'product_view' && productId) {
          supabase
            .from('product_views')
            .insert([
              {
                product_id: String(productId),
                product_title: productTitle ? String(productTitle).slice(0, 200) : null,
                visitor_id: visitorId,
              },
            ])
            .then(({ error }) => {
              // Silently ignore if table has not been created yet in Supabase
              if (error && !error.message?.includes('schema cache')) {
                console.debug?.('Supabase product_views insert note:', error.message);
              }
            });
        } else if (path) {
          supabase
            .from('site_pageviews')
            .insert([
              {
                path: String(path).slice(0, 250),
                visitor_id: visitorId,
                user_agent: userAgent.slice(0, 250),
                referrer: referrer.slice(0, 250),
              },
            ])
            .then(({ error }) => {
              // Silently ignore if table has not been created yet in Supabase
              if (error && !error.message?.includes('schema cache')) {
                console.debug?.('Supabase site_pageviews insert note:', error.message);
              }
            });
        }
      } catch (dbErr) {
        // Silently continue
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

