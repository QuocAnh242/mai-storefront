import { supabaseAdmin } from '@/lib/supabase';
import { withAdminRoute, ok, fail } from '@/lib/api/withAdminRoute';
import { generateEntityId } from '@/lib/ids';

// GET: Fetch blogs with server pagination and filtering
export const GET = withAdminRoute(
  { rateLimit: { key: 'adm_blog_get', limit: 120, windowSeconds: 60 }, requireServiceRole: false },
  async ({ req, auth }) => {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSizeParam = searchParams.get('pageSize');
    const isAll = pageSizeParam === 'all' || !searchParams.has('page');
    const pageSize = isAll ? 500 : Math.max(1, Math.min(100, parseInt(pageSizeParam || '20', 10)));
    const q = searchParams.get('q')?.trim();
    const category = searchParams.get('category')?.trim();

    let query = supabaseAdmin!
      .from('blogs')
      .select('*', { count: 'exact' });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (q) {
      query = query.or(`title.ilike.%${q}%,summary.ilike.%${q}%,author.ilike.%${q}%`);
    }

    query = query.order('created_at', { ascending: false });

    if (!isAll) {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
    }

    const { data, count, error } = await query;
    if (error) {
      console.error('Supabase Blog Fetch Error:', error);
      return fail(error.message, 500);
    }

    const total = count ?? (data?.length || 0);
    const totalPages = isAll ? 1 : Math.max(1, Math.ceil(total / pageSize));

    return ok(
      {
        data: data || [],
        total,
        page: isAll ? 1 : page,
        pageSize: isAll ? total : pageSize,
        totalPages,
      },
      { newSession: auth.newSession },
    );
  },
);

// POST: Create a new blog post
export const POST = withAdminRoute(
  { rateLimit: { key: 'adm_blog_create', limit: 60, windowSeconds: 60 } },
  async ({ req, auth }) => {
    const body = await req.json();
    const {
      id,
      title,
      slug,
      category,
      thumbnail,
      summary,
      content,
      sections,
      author,
      isPublished,
    } = body;

    if (!title || !title.trim()) {
      return fail('Tiêu đề bài viết không được để trống', 400);
    }

    const blogId = id || generateEntityId('blog');
    const insertPayload = {
      id: blogId,
      title: title.trim(),
      slug: slug || blogId,
      category: category || 'Mẹo hay',
      thumbnail: thumbnail || null,
      summary: summary || '',
      content: content || '',
      sections: Array.isArray(sections) ? sections : [],
      author: author || 'Chị Mai Kim Tuyến',
      is_published: isPublished !== undefined ? Boolean(isPublished) : true,
    };

    const { data, error } = await supabaseAdmin!
      .from('blogs')
      .insert([insertPayload])
      .select()
      .single();

    if (error) {
      console.error('Supabase Blog Insert Error:', error);
      return fail(error.message, 500);
    }

    return ok({ data }, { message: 'Tạo bài viết thành công', newSession: auth.newSession });
  },
);

// PATCH: Update a blog post
export const PATCH = withAdminRoute(
  {},
  async ({ req, auth }) => {
    const body = await req.json();
    const { id, ...updatedFields } = body;

    if (!id) {
      return fail('Thiếu ID bài viết', 400);
    }

    const dbPayload: Record<string, any> = {};
    if (updatedFields.title !== undefined) dbPayload.title = updatedFields.title.trim();
    if (updatedFields.slug !== undefined) dbPayload.slug = updatedFields.slug;
    if (updatedFields.category !== undefined) dbPayload.category = updatedFields.category;
    if (updatedFields.thumbnail !== undefined) dbPayload.thumbnail = updatedFields.thumbnail;
    if (updatedFields.summary !== undefined) dbPayload.summary = updatedFields.summary;
    if (updatedFields.content !== undefined) dbPayload.content = updatedFields.content;
    if (updatedFields.sections !== undefined) dbPayload.sections = updatedFields.sections;
    if (updatedFields.author !== undefined) dbPayload.author = updatedFields.author;
    if (updatedFields.isPublished !== undefined) dbPayload.is_published = Boolean(updatedFields.isPublished);

    const { data, error } = await supabaseAdmin!
      .from('blogs')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Supabase Blog Update Error:', error);
      return fail(error.message, 500);
    }

    if (!data) {
      return fail('Không tìm thấy bài viết để cập nhật', 404);
    }

    return ok({ data }, { message: 'Cập nhật bài viết thành công', newSession: auth.newSession });
  },
);

// DELETE: Remove a blog post
export const DELETE = withAdminRoute(
  {},
  async ({ req, auth }) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return fail('Thiếu ID bài viết cần xóa', 400);
    }

    const { error } = await supabaseAdmin!
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase Blog Delete Error:', error);
      return fail(error.message, 500);
    }

    return ok({}, { message: 'Đã xóa bài viết thành công', newSession: auth.newSession });
  },
);
