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
          className="mb-4 text-2xl font-semibold"
          data-tina-field={tinaField(data, 'title')}
        >
          {data.title || 'Featured'}
        </h2>
        {data.description && (
          <p
            className="mb-4 text-muted-foreground"
            data-tina-field={tinaField(data, 'description')}
          >
            {data.description}
          </p>
        )}
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
                <Link
                  href={post.url}
                  className="inline-flex rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
                >
                  {data.buttonText || 'Read More'}
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


