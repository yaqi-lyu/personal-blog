'use client';
import React from 'react';
import Image from 'next/image';

import { TinaMarkdown } from 'tinacms/dist/rich-text';
import type { Template } from 'tinacms';
import { PageBlocksContent } from '../../tina/__generated__/types';
import { tinaField } from 'tinacms/dist/react';
import { Section } from '../layout/section';
import { Mermaid } from './mermaid';
import { sectionBlockSchemaField } from '../layout/section';
import { scriptCopyBlockSchema, ScriptCopyBtn } from '../magicui/script-copy-btn';

export const Content = ({ data }: { data: PageBlocksContent }) => {
  // Determine if background is dark
  const bgClass = data.background || 'bg-default';
  const isDark =
    typeof bgClass === 'string' &&
    (bgClass.includes('bg-black') ||
     bgClass.includes('bg-zinc-900') ||
     bgClass.includes('bg-neutral-900') ||
     bgClass.includes('bg-[#222222]') ||
     bgClass.includes('bg-[#1a1a1a]') ||
     bgClass.includes('bg-[#000000]'));

  const proseClasses = isDark
    ? 'prose prose-lg prose-invert'
    : 'prose prose-lg';

  console.log("check if content has image", data.image, data.body);
  return (
    <Section background={data.background!}>
      {data.image?.src ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <div className={`${proseClasses} lg:col-span-3`} data-tina-field={tinaField(data, 'body')}>
            <TinaMarkdown
              content={data.body}
              components={{
                mermaid: (props: any) => <Mermaid {...props} />,
                scriptCopyBlock: (props: any) => <ScriptCopyBtn {...props} />,
              }}
            />
          </div>
          <div className="lg:col-span-2 flex justify-center lg:justify-start">
            <div className="w-full overflow-hidden rounded-lg shadow-lg sticky top-12">
              <Image
                className="w-full h-auto"
                alt={data.image?.alt || "Image"}
                src={data.image.src}
                height={600}
                width={600}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={proseClasses} data-tina-field={tinaField(data, 'body')}>
          <TinaMarkdown
            content={data.body}
            components={{
              mermaid: (props: any) => <Mermaid {...props} />,
              scriptCopyBlock: (props: any) => <ScriptCopyBtn {...props} />,
            }}
          />
        </div>
      )}
    </Section>
  );
};

export const contentBlockSchema: Template = {
  name: 'content',
  label: 'Content',
  ui: {
    previewSrc: '/blocks/content.png',
    defaultItem: {
      body: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.',
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: 'rich-text',
      label: 'Body',
      name: 'body',
      templates: [scriptCopyBlockSchema],
    },
    {
      type: 'object',
      label: 'Image',
      name: 'image',
      fields: [
        {
          name: 'src',
          label: 'Image Source',
          type: 'image',
        },
        {
          name: 'alt',
          label: 'Alt Text',
          type: 'string',
        },
      ],
    },
  ],
};
