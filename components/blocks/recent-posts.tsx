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
    const allPosts = edges.map((edge) => edge?.node).filter(Boolean);
    return allPosts
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

  const isGrayBg = data.background?.includes('gray') || data.background?.includes('#222222');

  return (
    <Section background={data.background as any}>
      <div className={`container ${isGrayBg ? 'my-12 lg:my-16' : 'my-8'}`}>
        <div className={isGrayBg ? 'mb-10' : 'mb-6'}>
          <h2
            className={`${isGrayBg ? 'text-3xl lg:text-4xl' : 'text-2xl'} font-bold text-white`}
            data-tina-field={tinaField(data, 'title')}
          >
            {data.title || 'Recent Articles'}
          </h2>
          {data.description && (
            <p
              className={`${isGrayBg ? 'mt-2 text-gray-300 text-lg' : 'mt-2 text-gray-300'}`}
              data-tina-field={tinaField(data, 'description')}
            >
              {data.description}
            </p>
          )}
        </div>
        <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isGrayBg ? 'gap-8' : ''}`}>
          {posts.map((p) => (
            <Card 
              key={p.id} 
              className={`group relative border backdrop-blur-sm p-0 overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                isGrayBg
                  ? 'border-red-900/30 bg-[#1a1a1a] hover:border-red-700/50 hover:shadow-xl hover:shadow-red-900/30 rounded-xl'
                  : 'border-zinc-800/50 bg-zinc-950/80 hover:border-red-700/40 hover:shadow-xl hover:shadow-red-900/20'
              }`}
            >
              {p.heroImg && (
                <Link href={p.url} className="block relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-t z-10 ${
                    isGrayBg ? 'from-[#1a1a1a]/80 via-transparent to-transparent' : 'from-black/70 via-transparent to-transparent'
                  }`} />
                  <img 
                    src={p.heroImg} 
                    alt={p.title} 
                    className={`w-full object-cover aspect-[16/9] transition-transform duration-500 group-hover:scale-110 ${
                      isGrayBg ? 'border-b border-red-900/30' : 'border-b border-zinc-800/50'
                    }`}
                  />
                </Link>
              )}
              
              <div className={isGrayBg ? 'p-6 space-y-3' : 'p-5 space-y-3'}>
                <Link href={p.url} className="block">
                  <h3 className={`font-bold leading-tight hover:text-red-400 transition-colors line-clamp-2 ${
                    isGrayBg ? 'text-xl text-white' : 'text-lg text-white'
                  }`}>
                    {p.title}
                  </h3>
                </Link>
                
                <div className={`flex items-center gap-2 text-xs ${isGrayBg ? 'text-gray-300' : 'text-gray-400'}`}>
                  <span>{p.published}</span>
                  <span className={isGrayBg ? 'text-red-700' : 'text-red-800'}>•</span>
                  <span>{p.author}</span>
                  <span className={isGrayBg ? 'text-red-700' : 'text-red-800'}>•</span>
                  <span>{p.readingMins} min read</span>
                </div>
                
                {data.showTags && p.tags?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <Link
                        key={t.name}
                        href={`/posts?tag=${encodeURIComponent(t.name)}`}
                        className={`px-2.5 py-1 text-xs font-medium rounded transition-all duration-200 ${
                          isGrayBg
                            ? 'bg-red-950/50 border border-red-800/50 text-red-400 hover:bg-red-900/60 hover:border-red-600/70 hover:text-red-300'
                            : 'bg-red-950/40 border border-red-800/40 text-red-400 hover:bg-red-900/50 hover:border-red-600/60 hover:text-red-300'
                        }`}
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


