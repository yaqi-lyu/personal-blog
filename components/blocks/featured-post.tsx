'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Section } from '../layout/section';
import { Card } from '../ui/card';
import { PostConnectionQuery } from '@/tina/__generated__/types';
import type { Template } from 'tinacms';
import { sectionBlockSchemaField } from '../layout/section';

type FeaturedBlockData = { background?: string };

export const FeaturedPost = ({ data, extraPosts }: { data: FeaturedBlockData; extraPosts?: PostConnectionQuery }) => {
  const post = useMemo(() => {
    const node = extraPosts?.postConnection?.edges?.[0]?.node;
    if (!node) return null;
    const date = new Date(node.date!);
    const published = isNaN(date.getTime()) ? '' : format(date, 'MMM dd, yyyy');
    return {
      id: node.id,
      title: node.title,
      url: `/posts/${node._sys.breadcrumbs!.join('/')}`,
      heroImg: node.heroImg as string | undefined,
      excerpt: node.excerpt,
      author: node.author?.name || 'Anonymous',
      published,
      readingMins: Math.max(1, Math.round((JSON.stringify(node.excerpt ?? '').split(/\s+/).length || 400) / 200)),
    };
  }, [data]);

  if (!post) return null;

  return (
    <Section background={data.background as any}>
      <div className="container my-10">
        <h2 className="mb-4 text-2xl font-semibold">Featured</h2>
        <Card className="p-0 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-6 lg:p-8">
              <Link href={post.url} className="text-2xl font-semibold hover:underline">{post.title}</Link>
              <div className="mt-2 text-sm text-muted-foreground">
                {post.published} • {post.author} • {post.readingMins} min read
              </div>
              <div className="mt-4 text-muted-foreground">
                <span>{typeof post.excerpt === 'string' ? post.excerpt : ''}</span>
              </div>
              <div className="mt-6">
                <Link href={post.url} className="inline-flex rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90">
                  Read More
                </Link>
              </div>
            </div>
            {post.heroImg && (
              <Link href={post.url} className="block">
                <img src={post.heroImg} alt={post.title} className="h-full w-full object-cover" />
              </Link>
            )}
          </div>
        </Card>
      </div>
    </Section>
  );
}

export const featuredBlockSchema: Template = {
  name: 'featured',
  label: 'Featured Post',
  ui: {
    previewSrc: '/blocks/content.png',
    defaultItem: {},
  },
  fields: [
    sectionBlockSchemaField as any,
  ],
};


