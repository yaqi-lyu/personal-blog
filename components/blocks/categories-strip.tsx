'use client';
import React from 'react';
import Link from 'next/link';
import { Section } from '../layout/section';
import { PageBlocksCategories, TagConnectionQuery } from '@/tina/__generated__/types';
import type { Template } from 'tinacms';
import { sectionBlockSchemaField } from '../layout/section';
import { cn } from '@/lib/utils';

const tagColorClasses = {
  default: 'bg-gradient-to-r from-gray-950/50 to-gray-900/30 border-gray-700/40 text-gray-300 hover:from-gray-900/60 hover:to-gray-800/40 hover:border-gray-600/60 hover:text-gray-200 hover:shadow-gray-900/40',
  blue: 'bg-gradient-to-r from-blue-950/50 to-blue-900/30 border-blue-800/40 text-blue-400 hover:from-blue-900/60 hover:to-blue-800/40 hover:border-blue-600/60 hover:text-blue-300 hover:shadow-blue-900/40',
  green: 'bg-gradient-to-r from-green-950/50 to-green-900/30 border-green-800/40 text-green-400 hover:from-green-900/60 hover:to-green-800/40 hover:border-green-600/60 hover:text-green-300 hover:shadow-green-900/40',
  red: 'bg-gradient-to-r from-red-950/50 to-red-900/30 border-red-800/40 text-red-400 hover:from-red-900/60 hover:to-red-800/40 hover:border-red-600/60 hover:text-red-300 hover:shadow-red-900/40',
  yellow: 'bg-gradient-to-r from-yellow-950/50 to-yellow-900/30 border-yellow-700/40 text-yellow-400 hover:from-yellow-900/60 hover:to-yellow-800/40 hover:border-yellow-600/60 hover:text-yellow-300 hover:shadow-yellow-900/40',
  purple: 'bg-gradient-to-r from-purple-950/50 to-purple-900/30 border-purple-800/40 text-purple-400 hover:from-purple-900/60 hover:to-purple-800/40 hover:border-purple-600/60 hover:text-purple-300 hover:shadow-purple-900/40',
  pink: 'bg-gradient-to-r from-pink-950/50 to-pink-900/30 border-pink-800/40 text-pink-400 hover:from-pink-900/60 hover:to-pink-800/40 hover:border-pink-600/60 hover:text-pink-300 hover:shadow-pink-900/40',
  indigo: 'bg-gradient-to-r from-indigo-950/50 to-indigo-900/30 border-indigo-800/40 text-indigo-400 hover:from-indigo-900/60 hover:to-indigo-800/40 hover:border-indigo-600/60 hover:text-indigo-300 hover:shadow-indigo-900/40',
};

const tagGradientOverlay = {
  default: 'from-gray-600/0 via-gray-600/20 to-gray-600/0',
  blue: 'from-blue-600/0 via-blue-600/20 to-blue-600/0',
  green: 'from-green-600/0 via-green-600/20 to-green-600/0',
  red: 'from-red-600/0 via-red-600/20 to-red-600/0',
  yellow: 'from-yellow-600/0 via-yellow-600/20 to-yellow-600/0',
  purple: 'from-purple-600/0 via-purple-600/20 to-purple-600/0',
  pink: 'from-pink-600/0 via-pink-600/20 to-pink-600/0',
  indigo: 'from-indigo-600/0 via-indigo-600/20 to-indigo-600/0',
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
        <h2 className="mb-6 text-2xl font-bold text-white">Categories</h2>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag, index) => {
            const colorKey = badgeColor as keyof typeof tagColorClasses;
            const colorClasses = tagColorClasses[colorKey] || tagColorClasses.default;
            const gradientClasses = tagGradientOverlay[colorKey] || tagGradientOverlay.default;
            
            return (
              <Link
                key={index}
                href={`/posts?tag=${encodeURIComponent(tag?.name || '')}`}
                className={cn(
                  'group/cat relative px-4 py-2 text-sm font-medium tracking-wide border-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105',
                  colorClasses
                )}
              >
                <span className="relative z-10">{tag?.name}</span>
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-r opacity-0 group-hover/cat:opacity-100 transition-opacity rounded-lg',
                  gradientClasses
                )} />
              </Link>
            );
          })}
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


