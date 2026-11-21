import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase, supabaseAdmin, isSupabaseConfigured, isSupabaseAdminConfigured } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeText } from '@/lib/sanitizer';
import { moderateReviewContent } from '@/lib/aiModeration';

const CreateReviewSchema = z.object({
  productId: z.string().min(1, 'Thiếu thông tin sản phẩm'),
  authorName: z.string().min(2, 'Tên người dùng tối thiểu 2 ký tự').max(50, 'Tên tối đa 50 ký tự'),
  rating: z.number().int().min(1, 'Đánh giá tối thiểu 1').max(5, 'Đánh giá tối đa 5'),
  content: z.string().min(5, 'Cảm nhận tối thiểu 5 ký tự').max(1000, 'Cảm nhận tối đa 1000 ký tự'),
});

// GET: Lấy danh sách đánh giá của sản phẩm
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

    // Tra cứu xem productId có tương ứng với ID hoặc slug trong bảng sản phẩm không
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
      // Nếu bảng chưa được khởi tạo trong Supabase
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

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Number((reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1))
        : 5.0;

    return NextResponse.json({
      success: true,
      data: reviews,
      stats: {
        averageRating,
        totalReviews,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Khách hàng gửi đánh giá mới
export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting tổng thể: Tối đa 10 đánh giá trong 60 giây trên 1 IP
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const rateLimit = checkRateLimit(`review_${clientIp}`, 10, 60);

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

    // 3. Rate Limit chống spam cùng 1 sản phẩm: 20 giây giữa các lần gửi
    const productRateLimit = checkRateLimit(`review_${productId}_${clientIp}`, 1, 20);
    if (!productRateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'PRODUCT_RATE_LIMIT',
          message: 'Bạn vừa gửi đánh giá cho sản phẩm này rồi. Vui lòng đợi 20 giây nếu muốn gửi thêm!',
        },
        { status: 429 }
      );
    }

    // 4. Chặn spam link quảng cáo / link độc hại
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

    // Sanitize input chống XSS
    const cleanAuthor = sanitizeText(authorName.trim());
    const cleanContent = sanitizeText(content.trim());

    // 5. AI & Rule-based Moderation Engine: Đọc hiểu, phát hiện chửi thề & độc hại
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

    // Chuẩn hóa productId: nếu là slug thì chuyển về primary id sản phẩm để đồng bộ
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

    let insertedData: any = null;

    if (moderation.isApproved || isSupabaseAdminConfigured()) {
      const { data, error } = await client
        .from('product_reviews')
        .insert({
          product_id: targetProductId,
          author_name: cleanAuthor,
          rating,
          content: cleanContent,
          is_approved: moderation.isApproved, // Tự động duyệt nếu an toàn, tự động ẩn nếu độc hại/chửi thề
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

    // Thông báo thân thiện cho khách hàng
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
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
