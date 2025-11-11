'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Card } from '../ui/card';
import { Section } from '../layout/section';
import { PageBlocksRecent, PostConnectionQuery } from '@/tina/__generated__/types';
import type { Template } from 'tinacms';
import { sectionBlockSchemaField } from '../layout/section';
import { tinaField } from 'tinacms/dist/react';
import { cn } from '@/lib/utils';

const tagColorClasses = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
};

export const RecentPosts = ({ data, extraPosts }: { data: PageBlocksRecent; extraPosts?: PostConnectionQuery }) => {
  const count = data.count || 3;

  const posts = useMemo(() => {
    const edges = extraPosts?.postConnection?.edges || [];
    return edges
      .map((edge) => edge?.node)
      .filter(Boolean)
      .slice(0, count)
      .map((post) => {
        const date = new Date(post!.date!);
        const published = isNaN(date.getTime()) ? '' : format(date, 'MMM dd, yyyy');
        return {
          id: post!.id,
          title: post!.title,
          url: `/posts/${post!._sys.breadcrumbs!.join('/')}`,
          heroImg: post!.heroImg as string | undefined,
          excerpt: post!.excerpt,
          tags: (post!.tags || []).map(t => ({
            name: t?.tag?.name || '',
            color: t?.tag?.color || 'default',
          })).filter(t => t.name),
          author: post!.author?.name || 'Anonymous',
          published,
          readingMins: Math.max(1, Math.round((JSON.stringify(post!.excerpt ?? '').split(/\s+/).length || 200) / 200)),
        };
      });
  }, [extraPosts, count]);

  if (!posts?.length) return null;

  return (
    <Section background={data.background as any}>
      <div className="container my-8">
        <h2
          className="mb-6 text-2xl font-bold text-white"
          data-tina-field={tinaField(data, 'title')}
        >
          {data.title || 'Recent Articles'}
        </h2>
        {data.description && (
          <p
            className="mb-6 text-gray-300"
            data-tina-field={tinaField(data, 'description')}
          >
            {data.description}
          </p>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Card 
              key={p.id} 
              className="group relative border-2 border-red-900/30 bg-gradient-to-br from-black via-zinc-950 to-red-950/20 p-0 overflow-hidden transition-all duration-300 hover:border-red-700/50 hover:shadow-xl hover:shadow-red-900/30 hover:-translate-y-1"
            >
              {/* Accent corner */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-red-600/20 to-transparent" />
              
              {p.heroImg && (
                <Link href={p.url} className="block relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <img 
                    src={p.heroImg} 
                    alt={p.title} 
                    className="w-full border-b-2 border-red-900/30 object-cover aspect-[16/9] transition-transform duration-500 group-hover:scale-110" 
                  />
                </Link>
              )}
              
              <div className="p-5 space-y-3">
                <Link href={p.url} className="block">
                  <h3 className="text-lg font-bold text-white leading-tight hover:text-red-400 transition-colors line-clamp-2">
                    {p.title}
                  </h3>
                </Link>
                
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{p.published}</span>
                  <span className="text-red-800">•</span>
                  <span>{p.author}</span>
                  <span className="text-red-800">•</span>
                  <span>{p.readingMins} min read</span>
                </div>
                
                {data.showTags && p.tags?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <Link
                        key={t.name}
                        href={`/posts?tag=${encodeURIComponent(t.name)}`}
                        className="px-2 py-0.5 text-xs font-medium bg-red-950/40 border border-red-800/40 rounded text-red-400 transition-all duration-200 hover:bg-red-900/50 hover:border-red-600/60 hover:text-red-300"
                      >
                        {t.name}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
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
    defaultItem: {
      title: 'Recent Articles',
      description: '',
      count: 3,
      showTags: true,
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: 'string',
      label: 'Title',
      name: 'title',
      description: 'The heading for the recent posts section',
    },
    {
      type: 'string',
      label: 'Description',
      name: 'description',
      description: 'Optional description text below the title',
      ui: {
        component: 'textarea',
      },
    },
    {
      type: 'number',
      label: 'Number of Posts',
      name: 'count',
      description: 'How many recent posts to display (default: 3)',
      ui: {
        min: 1,
        max: 12,
      },
    },
    {
      type: 'boolean',
      label: 'Show Tags',
      name: 'showTags',
      description: 'Display tags on post cards',
    },
  ],
};


