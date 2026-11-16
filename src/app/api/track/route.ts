import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase, supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rateLimit";
import { recordPageView, recordProductView } from "@/lib/analyticsStore";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limit: Max 60 tracking hits per minute per IP to prevent spam
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateLimit = checkRateLimit(`track_${clientIp}`, 60, 60);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, rateLimited: true },
        { status: 429 },
      );
    }

    const userAgent = req.headers.get("user-agent") || "";
    const referrer = req.headers.get("referer") || "";

    // Anonymous visitor hash (IP + User-Agent hashed)
    const visitorId = crypto
      .createHash("sha256")
      .update(`${clientIp}:${userAgent.slice(0, 50)}`)
      .digest("hex")
      .slice(0, 16);

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      try {
        const text = await req.text();
        if (text) body = JSON.parse(text);
      } catch {
        body = {};
      }
    }

    const { type, path, productId, productTitle } = body || {};

    // 2. In-memory transient buffer for active runtime
    if (type === "product_view" && productId) {
      recordProductView(
        String(productId),
        String(productTitle || ""),
        visitorId,
      );
    } else if (path) {
      recordPageView(String(path), visitorId, referrer);
    }

    // 3. Supabase Cloud Database persistence
    if (isSupabaseConfigured()) {
      const dbClient = supabaseAdmin || supabase;
      try {
        if (type === "product_view" && productId) {
          dbClient
            .from("product_views")
            .insert([
              {
                product_id: String(productId).slice(0, 100),
                product_title: productTitle
                  ? String(productTitle).slice(0, 200)
                  : null,
                visitor_id: visitorId,
              },
            ])
            .then(
              ({ error }) => {
                // Silently ignore if table has not been created yet in Supabase SQL Editor
                if (
                  error &&
                  !error.message?.includes("schema cache") &&
                  !error.message?.includes("does not exist")
                ) {
                  console.warn(
                    "Supabase product_views insert note:",
                    error.message,
                  );
                }
              },
              () => {},
            );
        } else if (path) {
          dbClient
            .from("site_pageviews")
            .insert([
              {
                path: String(path).slice(0, 250),
                visitor_id: visitorId,
                user_agent: userAgent.slice(0, 250),
                referrer: referrer.slice(0, 250),
              },
            ])
            .then(
              ({ error }) => {
                // Silently ignore if table has not been created yet in Supabase SQL Editor
                if (
                  error &&
                  !error.message?.includes("schema cache") &&
                  !error.message?.includes("does not exist")
                ) {
                  console.warn(
                    "Supabase site_pageviews insert note:",
                    error.message,
                  );
                }
              },
              () => {},
            );
        }
      } catch {
        // Silently continue without failing user request
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
