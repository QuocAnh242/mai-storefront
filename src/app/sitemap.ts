import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.maikimtuyen.io.vn';

  const routes = [
    '',
    '/san-pham',
    '/tin-tuc',
    '/lien-he',
    '/chinh-sach-bao-mat',
    '/huong-dan-mua-hang',
    '/chinh-sach-doi-tra',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return routes;
}
