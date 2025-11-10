'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { Section } from '../layout/section';
import { PostConnectionQuery } from '@/tina/__generated__/types';
import type { Template } from 'tinacms';
import { sectionBlockSchemaField } from '../layout/section';

export const CategoriesStrip = ({ data }: { data: PostConnectionQuery }) => {
  const tags = useMemo(() => {
    const set = new Set<string>();
    (data?.postConnection?.edges || []).forEach(edge => {
      edge?.node?.tags?.forEach(t => {
        const name = t?.tag?.name;
        if (name) set.add(name);
      });
    });
    return Array.from(set).sort();
  }, [data]);

  if (!tags.length) return null;

  return (
    <Section>
      <div className="container my-8">
        <h2 className="mb-4 text-xl font-semibold">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map(t => (
            <Link
              key={t}
              href={`/posts?tag=${encodeURIComponent(t)}`}
              className="rounded-full border px-3 py-1 text-sm hover:bg-accent"
            >
              {t}
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
    defaultItem: {},
  },
  fields: [
    sectionBlockSchemaField as any,
  ],
};


