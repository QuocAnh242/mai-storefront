import { MetadataRoute } from 'next';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const revalidate = 3600; // revalidate dynamic sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.maikimtuyen.io.vn';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/san-pham`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tin-tuc`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lien-he`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/chinh-sach-bao-mat`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/huong-dan-mua-hang`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/chinh-sach-doi-tra`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  let blogRoutes: MetadataRoute.Sitemap = [];

  if (isSupabaseConfigured()) {
    try {
      const [{ data: products }, { data: blogs }] = await Promise.all([
        supabase.from('products').select('id, slug, updated_at, created_at'),
        supabase.from('blogs').select('id, slug, updated_at, created_at'),
      ]);

      if (products && products.length > 0) {
        productRoutes = products.map((prod) => ({
          url: `${baseUrl}/san-pham/${prod.slug || prod.id}`,
          lastModified: prod.updated_at
            ? new Date(prod.updated_at)
            : new Date(prod.created_at || Date.now()),
          changeFrequency: 'weekly' as const,
          priority: 0.85,
        }));
      }

      if (blogs && blogs.length > 0) {
        blogRoutes = blogs.map((blog) => ({
          url: `${baseUrl}/tin-tuc/${blog.slug || blog.id}`,
          lastModified: blog.updated_at
            ? new Date(blog.updated_at)
            : new Date(blog.created_at || Date.now()),
          changeFrequency: 'weekly' as const,
          priority: 0.75,
        }));
      }
    } catch (err) {
      console.error('Error fetching dynamic routes for sitemap:', err);
    }
  }

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
