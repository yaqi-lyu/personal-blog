'use client';
import React, { useState } from 'react';
import { Section } from '../layout/section';
import { Card } from '../ui/card';
import type { Template } from 'tinacms';
import { sectionBlockSchemaField } from '../layout/section';
import { tinaField } from 'tinacms/dist/react';
import { RssIcon, Copy, Check } from 'lucide-react';
import type { PageBlocksRss } from '@/tina/__generated__/types';

export const RssFeed = ({ data }: { data: PageBlocksRss }) => {
  const feedUrl = data.placeholder || '/feed.xml';
  const [copied, setCopied] = useState(false);
  const isGrayBg = data.background?.includes('gray') || data.background?.includes('#222222');

  const handleCopyFeedUrl = () => {
    const fullUrl = feedUrl.startsWith('http') ? feedUrl : `${typeof window !== 'undefined' ? window.location.origin : ''}${feedUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section background={data.background as any}>
      <div className={`container ${isGrayBg ? 'my-12 lg:my-16' : 'my-12'}`}>
        <Card className={`relative border backdrop-blur-sm overflow-hidden transition-all duration-300 ${
          isGrayBg
            ? 'border-red-900/30 bg-[#1a1a1a] p-10 lg:p-12 hover:border-red-700/50 hover:shadow-xl hover:shadow-red-900/40 rounded-2xl'
            : 'border-red-900/20 bg-[#1a1a1a] p-8 lg:p-10 hover:border-red-700/40 hover:shadow-xl hover:shadow-red-900/30'
        }`}>
          {/* Subtle accent line */}
          <div className={`absolute top-0 left-0 w-full bg-gradient-to-r from-transparent via-red-600/40 to-transparent opacity-0 hover:opacity-100 transition-opacity ${
            isGrayBg ? 'h-1 rounded-t-2xl' : 'h-px'
          }`} />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-red-900/20 border border-red-700/30">
                <RssIcon className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h3
                  className={`font-bold text-white ${isGrayBg ? 'text-3xl lg:text-4xl' : 'text-2xl lg:text-3xl'}`}
                  data-tina-field={tinaField(data, 'title')}
                >
                  {data.title || 'Subscribe to RSS Feed'}
                </h3>
                <p
                  className={`text-gray-300 mt-2 ${isGrayBg ? 'text-base lg:text-lg' : 'text-sm lg:text-base'}`}
                  data-tina-field={tinaField(data, 'description')}
                >
                  {data.description || 'Get the latest posts delivered via RSS feed. No ads, no algorithms, just content.'}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleCopyFeedUrl}
              className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-red-700 to-red-900 rounded-lg transition-all duration-300 hover:from-red-600 hover:to-red-800 hover:shadow-lg hover:shadow-red-900/50 hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap"
              data-tina-field={tinaField(data, 'buttonText')}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  {data.buttonText || 'Copy Feed URL'}
                </>
              )}
            </button>
          </div>
        </Card>
      </div>
    </Section>
  );
}

export const rssBlockSchema: Template = {
  name: 'rss',
  label: 'RSS Feed',
  ui: {
    previewSrc: '/blocks/content.png',
    defaultItem: {
      title: 'Subscribe to RSS Feed',
      description: 'Get the latest posts delivered via RSS feed. No ads, no algorithms, just content.',
      placeholder: '/feed.xml',
      buttonText: 'Copy Feed URL',
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: 'string',
      label: 'Title',
      name: 'title',
    },
    {
      type: 'string',
      label: 'Description',
      name: 'description',
      ui: {
        component: 'textarea',
      },
    },
    {
      type: 'string',
      label: 'Feed URL (optional - defaults to /feed.xml)',
      name: 'placeholder',
      description: 'Leave blank to use the default /feed.xml endpoint',
    },
    {
      type: 'string',
      label: 'Button Text',
      name: 'buttonText',
    },
  ],
};
