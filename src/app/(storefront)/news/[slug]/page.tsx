import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogBySlug, getBlogs } from '@/lib/queries';
import { BlogDetailView } from '@/features/blogs/BlogDetailView';

export const revalidate = 60; // ISR: 60s

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return {
      title: 'Không tìm thấy bài viết - Mai Kim Tuyến',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.maikimtuyen.io.vn';
  const pageUrl = `${siteUrl}/news/${post.slug}`;
  const thumbnail = post.thumbnail || `${siteUrl}/hero.jpg`;

  return {
    title: `${post.title} - Cẩm nang Mai Kim Tuyến`,
    description: post.summary || post.title,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: post.title,
      description: post.summary || post.title,
      url: pageUrl,
      siteName: 'Mai Kim Tuyến Store',
      images: [
        {
          url: thumbnail,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'vi_VN',
      type: 'article',
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch recent articles for the bottom section
  const { blogs } = await getBlogs({ limit: 4 });
  const otherPosts = blogs.filter((b) => b.id !== post.id).slice(0, 3);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.maikimtuyen.io.vn';
  const articleUrl = `${siteUrl}/news/${post.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary || post.title,
    image: post.thumbnail || `${siteUrl}/hero.jpg`,
    author: {
      '@type': 'Person',
      name: post.author || 'Mai Kim Tuyến',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mai Kim Tuyến Store',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/icon.jpg`,
      },
    },
    datePublished: post.createdAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetailView initialPost={post} initialOtherPosts={otherPosts} />
    </>
  );
}
