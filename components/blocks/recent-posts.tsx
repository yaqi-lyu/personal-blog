'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Card } from '../ui/card';
import { Section } from '../layout/section';
import { PostConnectionQuery } from '@/tina/__generated__/types';
import type { Template } from 'tinacms';
import { sectionBlockSchemaField } from '../layout/section';

type RecentBlockData = { background?: string };

export const RecentPosts = ({ data, extraPosts }: { data: RecentBlockData; extraPosts?: PostConnectionQuery }) => {
  const posts = useMemo(() => {
    const edges = extraPosts?.postConnection?.edges || [];
    return edges
      .map((edge) => edge?.node)
      .filter(Boolean)
      .slice(0, 3)
      .map((post) => {
        const date = new Date(post!.date!);
        const published = isNaN(date.getTime()) ? '' : format(date, 'MMM dd, yyyy');
        return {
          id: post!.id,
          title: post!.title,
          url: `/posts/${post!._sys.breadcrumbs!.join('/')}`,
          heroImg: post!.heroImg as string | undefined,
          excerpt: post!.excerpt,
          tags: (post!.tags || []).map(t => t?.tag?.name).filter(Boolean) as string[],
          author: post!.author?.name || 'Anonymous',
          published,
          readingMins: Math.max(1, Math.round((JSON.stringify(post!.excerpt ?? '').split(/\s+/).length || 200) / 200)),
        };
      });
  }, [data]);

  if (!posts?.length) return null;

  return (
    <Section background={data.background as any}>
      <div className="container my-8">
        <h2 className="mb-6 text-2xl font-semibold">Recent Articles</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Card key={p.id} className="p-4">
              {p.heroImg && (
                <Link href={p.url} className="block mb-3">
                  <img src={p.heroImg} alt={p.title} className="w-full rounded-md border object-cover aspect-[16/9]" />
                </Link>
              )}
              <Link href={p.url} className="text-lg font-medium hover:underline">
                {p.title}
              </Link>
              <div className="mt-1 text-sm text-muted-foreground">
                {p.published} • {p.author} • {p.readingMins} min read
              </div>
              {p.tags?.length ? (
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded bg-accent px-2 py-0.5">{t}</span>
                  ))}
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}

export const recentBlockSchema: Template = {
  name: 'recent',
  label: 'Recent Posts',
  ui: {
    previewSrc: '/blocks/content.png',
    defaultItem: {},
  },
  fields: [
    sectionBlockSchemaField as any,
  ],
};


