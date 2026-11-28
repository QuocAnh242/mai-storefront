import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin, isSupabaseConfigured, isSupabaseAdminConfigured } from '@/lib/supabase';
import { enforceRateLimit } from '@/lib/rateLimit';
import { sanitizeText } from '@/lib/sanitizer';
import { moderateReviewContent } from '@/lib/aiModeration';
import { CreateReviewSchema } from '@/lib/validation/schemas';

// GET: Fetch product reviews
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Thiếu productId' }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        data: [],
        stats: { averageRating: 5.0, totalReviews: 0 },
      });
    }

    const client = (isSupabaseAdminConfigured() && supabaseAdmin) ? supabaseAdmin : supabase;
    const productKeys = [productId];

    // Resolve productId against both ID and slug columns in the products table
    try {
      const { data: prodMatch } = await client
        .from('products')
        .select('id, slug')
        .or(`id.eq.${productId},slug.eq.${productId}`)
        .limit(1);

      if (prodMatch && prodMatch.length > 0) {
        if (prodMatch[0].id && !productKeys.includes(prodMatch[0].id)) productKeys.push(prodMatch[0].id);
        if (prodMatch[0].slug && !productKeys.includes(prodMatch[0].slug)) productKeys.push(prodMatch[0].slug);
      }
    } catch {}

    const { data, error } = await client
      .from('product_reviews')
      .select('id, product_id, author_name, rating, content, created_at, reply_content, replied_at')
      .in('product_id', productKeys)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      // Table not yet initialized in Supabase
      if (error.code === 'PGRST205' || error.message.includes('not find the table')) {
        return NextResponse.json({
          success: true,
          data: [],
          stats: { averageRating: 5.0, totalReviews: 0 },
          requiresTableSetup: true,
        });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const reviews = (data || []).map((r) => ({
      id: r.id,
      productId: r.product_id,
      authorName: r.author_name,
      rating: r.rating,
      content: r.content,
      createdAt: r.created_at,
      replyContent: r.reply_content || undefined,
      repliedAt: r.replied_at || undefined,
    }));

    const pageParam = Number(searchParams.get('page'));
    const limitParam = Number(searchParams.get('limit'));
    const hasPagination = Number.isFinite(limitParam) && limitParam > 0;
    const limit = hasPagination ? Math.min(50, Math.floor(limitParam)) : reviews.length || 10;
    const totalReviews = reviews.length;
    const totalPages = Math.max(1, Math.ceil(totalReviews / limit));
    const currentPage =
      hasPagination && Number.isFinite(pageParam) && pageParam > 0
        ? Math.min(Math.floor(pageParam), totalPages)
        : 1;

    const paginatedReviews = hasPagination
      ? reviews.slice((currentPage - 1) * limit, currentPage * limit)
      : reviews;

    const ratingBreakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const rev of reviews) {
      const star = Math.min(5, Math.max(1, Math.round(rev.rating)));
      ratingBreakdown[star] = (ratingBreakdown[star] || 0) + 1;
    }

    const averageRating =
      totalReviews > 0
        ? Number((reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1))
        : 5.0;

    return NextResponse.json({
      success: true,
      data: paginatedReviews,
      pagination: {
        page: currentPage,
        limit,
        total: totalReviews,
        totalPages,
      },
      stats: {
        averageRating,
        totalReviews,
        ratingBreakdown,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST: Submit a new customer review
export async function POST(req: NextRequest) {
  try {
    // 1. Global IP rate limit: max 10 reviews per 60s per IP
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateLimit = await enforceRateLimit(`review_${clientIp}`, 10, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'RATE_LIMIT_EXCEEDED',
          message: `Bạn thao tác quá nhanh. Vui lòng đợi ${rateLimit.resetSeconds} giây rồi thử lại!`,
        },
        { status: 429 }
      );
    }

    // 2. Validate payload
    const body = await req.json();
    const parseResult = CreateReviewSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'INVALID_PAYLOAD',
          message: parseResult.error.issues[0]?.message || 'Dữ liệu đánh giá không hợp lệ',
        },
        { status: 400 }
      );
    }

    const { productId, authorName, rating, content } = parseResult.data;

    // 3. Per-product rate limit: 20s cooldown between submissions
    const productRateLimit = await enforceRateLimit(`review_${productId}_${clientIp}`, 1, 20);
    if (!productRateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'PRODUCT_RATE_LIMIT',
          message: 'Bạn vừa gửi đánh giá cho sản phẩm này rồi. Vui lòng đợi 20 giây nếu muốn gửi thêm!',
        },
        { status: 429 }
      );
    }

    // 4. Block spam/advertising/malicious links
    const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(com|vn|io|net|xyz|org|online|top))/i;
    if (urlPattern.test(content) || urlPattern.test(authorName)) {
      return NextResponse.json(
        {
          error: 'SPAM_DETECTED',
          message: 'Nội dung đánh giá không được chứa liên kết website quảng cáo hoặc liên kết ngoài.',
        },
        { status: 400 }
      );
    }

    // Sanitize input against XSS
    const cleanAuthor = sanitizeText(authorName.trim());
    const cleanContent = sanitizeText(content.trim());

    // 5. AI & rule-based moderation: detect profanity and toxic content
    const moderation = await moderateReviewContent({
      authorName: cleanAuthor,
      content: cleanContent,
      rating,
    });

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          error: 'SUPABASE_NOT_CONFIGURED',
          message: 'Hệ thống lưu trữ đánh giá chưa được kết nối',
        },
        { status: 500 }
      );
    }

    const client = (isSupabaseAdminConfigured() && supabaseAdmin) ? supabaseAdmin : supabase;

    // Normalize productId: resolve slug to primary product id
    let targetProductId = productId;
    try {
      const { data: prodMatch } = await client
        .from('products')
        .select('id, slug')
        .or(`id.eq.${productId},slug.eq.${productId}`)
        .limit(1);
      if (prodMatch && prodMatch.length > 0 && prodMatch[0].id) {
        targetProductId = prodMatch[0].id;
      }
    } catch {}

    type InsertedReview = {
      id: string;
      product_id: string;
      author_name: string;
      rating: number;
      content: string;
      created_at: string;
    };
    let insertedData: InsertedReview | null = null;

    if (moderation.isApproved || isSupabaseAdminConfigured()) {
      const { data, error } = await client
        .from('product_reviews')
        .insert({
          product_id: targetProductId,
          author_name: cleanAuthor,
          rating,
          content: cleanContent,
          is_approved: moderation.isApproved, // Auto-approve if safe, auto-hide if toxic/profane
        })
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST205' || error.message.includes('not find the table')) {
          return NextResponse.json(
            {
              error: 'TABLE_NOT_FOUND',
              message: 'Bảng đánh giá chưa được khởi tạo trong Supabase.',
            },
            { status: 500 }
          );
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      insertedData = data;
    } else {
      const { error } = await client
        .from('product_reviews')
        .insert({
          product_id: targetProductId,
          author_name: cleanAuthor,
          rating,
          content: cleanContent,
          is_approved: false,
        });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    // Customer-facing success message
    const successMsg = moderation.isApproved
      ? 'Cảm ơn bạn đã gửi đánh giá! Nhận xét của bạn đã được đăng thành công.'
      : 'Cảm ơn bạn đã gửi đánh giá! Nhận xét của bạn đang được tiếp nhận và sẽ sớm được hiển thị sau khi qua kiểm duyệt.';

    return NextResponse.json({
      success: true,
      message: successMsg,
      isApproved: moderation.isApproved,
      data: moderation.isApproved && insertedData
        ? {
            id: insertedData.id,
            productId: insertedData.product_id,
            authorName: insertedData.author_name,
            rating: insertedData.rating,
            content: insertedData.content,
            createdAt: insertedData.created_at,
          }
        : null,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to fetch reviews' }, { status: 500 });
  }
}
