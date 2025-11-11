'use client';
import React from 'react';
import Link from 'next/link';
import { Section } from '../layout/section';
import { PageBlocksCategories, TagConnectionQuery } from '@/tina/__generated__/types';
import type { Template } from 'tinacms';
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

export const CategoriesStrip = ({ data, allTags }: { data: PageBlocksCategories; allTags?: TagConnectionQuery }) => {
  const tags = allTags?.tagConnection?.edges
    ?.map(edge => edge?.node)
    .filter(tag => tag?.name)
    .sort((a, b) => (a?.name || '').localeCompare(b?.name || '')) || [];

  if (!tags.length) return null;

  const badgeColor = data.badgeColor || 'default';

  return (
    <Section background={data.background as any}>
      <div className="container my-8">
        <h2 className="mb-4 text-xl font-semibold">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Link
              key={index}
              href={`/posts?tag=${encodeURIComponent(tag?.name || '')}`}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                tagColorClasses[badgeColor as keyof typeof tagColorClasses] || tagColorClasses.default
              )}
            >
              {tag?.name}
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
      badgeColor: 'default',
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: "string",
      label: "Badge Color",
      name: "badgeColor",
      description: "Color for all tag badges in this section",
      options: [
        { label: "Default", value: "default" },
        { label: "Blue", value: "blue" },
        { label: "Green", value: "green" },
        { label: "Red", value: "red" },
        { label: "Yellow", value: "yellow" },
        { label: "Purple", value: "purple" },
        { label: "Pink", value: "pink" },
        { label: "Indigo", value: "indigo" },
      ],
    },
  ],
};


