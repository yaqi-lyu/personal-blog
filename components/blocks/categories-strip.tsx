'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { Section } from '../layout/section';
import { PageBlocksCategories, PostConnectionQuery } from '@/tina/__generated__/types';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { sectionBlockSchemaField } from '../layout/section';
import { cn } from '@/lib/utils';

const tagColorClasses = {
  default: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200',
  blue: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200',
  green: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200',
  red: 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200',
  yellow: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200',
  purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200',
  pink: 'bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-pink-900 dark:text-pink-200',
  indigo: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200',
};

type TagInfo = {
  name: string;
  color?: string;
  count?: number;
};

export const CategoriesStrip = ({ data, extraPosts }: { data: PageBlocksCategories; extraPosts?: PostConnectionQuery }) => {
  // Combine custom tags from Tina editor with auto-discovered tags from posts
  const allTags = useMemo(() => {
    const tagMap = new Map<string, TagInfo>();

    // Add tags from tag references (with full metadata)
    if (data.tags) {
      data.tags.forEach(tagRef => {
        const tag = tagRef?.tag;
        if (tag?.name) {
          tagMap.set(tag.name, {
            name: tag.name,
            color: tag.color || 'default',
            count: 0,
          });
        }
      });
    }

    // Add tags from posts (if auto-discovery is enabled)
    if (data.showAutoDiscoveredTags) {
      (extraPosts?.postConnection?.edges || []).forEach(edge => {
        edge?.node?.tags?.forEach(t => {
          const tagData = t?.tag;
          if (tagData?.name) {
            const existing = tagMap.get(tagData.name);
            if (existing) {
              existing.count = (existing.count || 0) + 1;
            } else {
              tagMap.set(tagData.name, {
                name: tagData.name,
                color: tagData.color || 'default',
                count: 1,
              });
            }
          }
        });
      });
    }

    return Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [data, extraPosts]);

  if (!allTags.length) return null;

  return (
    <Section background={data.background as any}>
      <div className="container my-8">
        <h2
          className="mb-4 text-xl font-semibold"
          data-tina-field={tinaField(data, 'title')}
        >
          {data.title || 'Categories'}
        </h2>
        {data.description && (
          <p
            className="mb-6 text-muted-foreground"
            data-tina-field={tinaField(data, 'description')}
          >
            {data.description}
          </p>
        )}
        <div className="flex flex-wrap gap-2" data-tina-field={tinaField(data, 'tags')}>
          {allTags.map(tag => (
            <Link
              key={tag.name}
              href={`/posts?tag=${encodeURIComponent(tag.name)}`}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                tagColorClasses[tag.color as keyof typeof tagColorClasses] || tagColorClasses.default
              )}
            >
              {tag.name}
              {data.showCount && tag.count ? ` (${tag.count})` : ''}
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}

export const categoriesBlockSchema: Template = {
  name: 'categories',
  label: 'Categories',
  ui: {
    previewSrc: '/blocks/content.png',
    defaultItem: {
      title: 'Categories',
      description: '',
      showAutoDiscoveredTags: true,
      showCount: false,
      tags: [],
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: "string",
      label: "Title",
      name: "title",
      description: "The heading for the categories section",
    },
    {
      type: "string",
      label: "Description",
      name: "description",
      description: "Optional description text below the title",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "boolean",
      label: "Show Auto-Discovered Tags",
      name: "showAutoDiscoveredTags",
      description: "Automatically include tags from existing blog posts",
    },
    {
      type: "boolean",
      label: "Show Post Count",
      name: "showCount",
      description: "Display the number of posts for each tag",
    },
    {
      label: 'Tags',
      name: 'tags',
      type: 'object',
      list: true,
      description: 'Select specific tags to display (will merge with auto-discovered tags if enabled)',
      ui: {
        itemProps: (item) => {
          return { label: item?.tag?.name || 'New Tag' };
        },
      },
      fields: [
        {
          type: 'reference',
          label: 'Tag',
          name: 'tag',
          collections: ['tag'],
          required: true,
          ui: {
            optionComponent: (
              props: {
                name?: string;
                color?: string;
              },
              _internalSys: { path: string }
            ) => {
              const { name, color } = props;
              if (!name) return _internalSys.path;

              const colorClass = color && tagColorClasses[color as keyof typeof tagColorClasses]
                ? tagColorClasses[color as keyof typeof tagColorClasses].split(' ')[0]
                : 'bg-gray-100';

              return (
                <div className='flex items-center gap-2'>
                  <span className={`inline-block w-3 h-3 rounded-full ${colorClass}`} />
                  {name}
                </div>
              );
            },
          },
        },
      ],
    },
  ],
};


