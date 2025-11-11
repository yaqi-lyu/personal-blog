'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Section } from '../layout/section';
import { Card } from '../ui/card';
import { PageBlocksFeatured, PostConnectionQuery } from '@/tina/__generated__/types';
import type { Template } from 'tinacms';
import { sectionBlockSchemaField } from '../layout/section';
import { tinaField } from 'tinacms/dist/react';

export const FeaturedPost = ({ data, extraPosts }: { data: PageBlocksFeatured; extraPosts?: PostConnectionQuery }) => {
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
  }, [extraPosts]);

  if (!post) return null;

  return (
    <Section background={data.background as any}>
      <div className="container my-10">
        <h2
          className="mb-6 text-2xl font-bold text-white"
          data-tina-field={tinaField(data, 'title')}
        >
          {data.title || 'Featured'}
        </h2>
        {data.description && (
          <p
            className="mb-6 text-gray-300"
            data-tina-field={tinaField(data, 'description')}
          >
            {data.description}
          </p>
        )}
        <Card className="group relative border-2 border-red-900/40 bg-gradient-to-br from-black via-zinc-950 to-red-950/20 p-0 overflow-hidden transition-all duration-300 hover:border-red-700/50 hover:shadow-2xl hover:shadow-red-900/30">
          {/* Decorative corner accent */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-red-600/30 via-red-700/10 to-transparent" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-red-600/20 via-red-800/10 to-transparent" />
          
          <div className="grid lg:grid-cols-2 relative">
            <div className="p-8 lg:p-10 space-y-5 flex flex-col justify-center">
              <Link href={post.url} className="block">
                <h3 className="text-3xl lg:text-4xl font-bold text-white leading-tight hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-red-400 hover:to-white transition-all duration-300">
                  {post.title}
                </h3>
              </Link>
              
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="font-medium text-gray-300">{post.published}</span>
                <span className="text-red-800">•</span>
                <span>{post.author}</span>
                <span className="text-red-800">•</span>
                <span>{post.readingMins} min read</span>
              </div>
              
              <div className="text-gray-300 leading-relaxed">
                <span>{typeof post.excerpt === 'string' ? post.excerpt : ''}</span>
              </div>
              
              <div className="pt-2">
                <Link
                  href={post.url}
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-red-700 to-red-900 rounded-lg transition-all duration-300 hover:from-red-600 hover:to-red-800 hover:shadow-lg hover:shadow-red-900/50 hover:scale-105"
                >
                  {data.buttonText || 'Read More'}
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {post.heroImg && (
              <Link href={post.url} className="block relative overflow-hidden h-full min-h-[300px] lg:min-h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-red-950/40 via-transparent to-transparent z-10" />
                <img 
                  src={post.heroImg} 
                  alt={post.title} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
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
    defaultItem: {
      title: 'Featured',
      description: '',
      buttonText: 'Read More',
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: 'string',
      label: 'Title',
      name: 'title',
      description: 'The heading for the featured section',
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
      type: 'string',
      label: 'Button Text',
      name: 'buttonText',
      description: 'Text for the call-to-action button',
    },
  ],
};


