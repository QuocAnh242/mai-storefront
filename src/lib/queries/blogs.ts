import { supabase, isSupabaseConfigured, supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase';
import { BlogPost } from '@/shared/types';
import { INITIAL_BLOGS } from '@/shared/constants/initialData';

function getClient() {
  if (isSupabaseAdminConfigured() && supabaseAdmin) return supabaseAdmin;
  return supabase;
}

function mapBlogRow(row: any): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category || 'Mẹo hay',
    thumbnail: row.thumbnail || '',
    summary: row.summary || '',
    content: row.content || '',
    sections: Array.isArray(row.sections) ? row.sections : [],
    author: row.author || 'Chị Mai Kim Tuyến',
    isPublished: row.is_published !== false,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export interface GetBlogsParams {
  category?: string;
  page?: number;
  limit?: number;
}

export interface GetBlogsResult {
  blogs: BlogPost[];
  total: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Fetch published blog articles with pagination.
 */
export async function getBlogs(params: GetBlogsParams = {}): Promise<GetBlogsResult> {
  const { category, page = 1, limit = 12 } = params;

  if (!isSupabaseConfigured()) {
    let filtered = INITIAL_BLOGS.filter((b) => b.isPublished);
    if (category && category !== 'all') {
      filtered = filtered.filter((b) => b.category === category);
    }
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;

    return {
      blogs: filtered.slice(offset, offset + limit),
      total,
      totalPages,
      currentPage: page,
    };
  }

  try {
    const client = getClient();
    let query = client
      .from('blogs')
      .select('id, title, slug, category, thumbnail, summary, author, is_published, created_at', { count: 'exact' })
      .eq('is_published', true);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    query = query.order('created_at', { ascending: false });

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error || !data) {
      console.warn('[getBlogs query error]:', error);
      return { blogs: [], total: 0, totalPages: 1, currentPage: page };
    }

    const blogs = data.map(mapBlogRow);
    const total = count ?? blogs.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    return {
      blogs,
      total,
      totalPages,
      currentPage: page,
    };
  } catch (err) {
    console.warn('[getBlogs exception]:', err);
    return { blogs: [], total: 0, totalPages: 1, currentPage: page };
  }
}

/**
 * Fetch a single published blog article by slug.
 */
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  if (!slug) return null;

  if (!isSupabaseConfigured()) {
    const found = INITIAL_BLOGS.find((b) => b.slug === slug && b.isPublished);
    return found || null;
  }

  try {
    const client = getClient();
    const { data, error } = await client
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapBlogRow(data);
  } catch (err) {
    console.warn('[getBlogBySlug error]:', err);
    return null;
  }
}
