import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogBySlug, getBlogs } from '@/lib/queries';
import { buildBlogJsonLd, buildBlogMetadata } from '@/lib/seo/structuredData';
import { BlogDetailView } from '@/features/blogs/BlogDetailView';

export const revalidate = 60;

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  return buildBlogMetadata(post);
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  const { blogs } = await getBlogs({ limit: 4 });
  const otherPosts = blogs.filter((b) => b.id !== post.id).slice(0, 3);
  const jsonLd = buildBlogJsonLd(post);

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
