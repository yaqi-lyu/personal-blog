'use client';
import React, { useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Card } from '../ui/card';
import { Section } from '../layout/section';
import { PageBlocksBlog_Grid, PostConnectionQuery, TagConnectionQuery } from '@/tina/__generated__/types';
import type { Template } from 'tinacms';
import { sectionBlockSchemaField } from '../layout/section';
import { tinaField } from 'tinacms/dist/react';
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

interface BlogGridProps {
  data: PageBlocksBlog_Grid;
  extraPosts?: PostConnectionQuery;
  allTags?: TagConnectionQuery;
  searchQuery?: string;
}

export const BlogGrid = ({ data, extraPosts, allTags, searchQuery = '' }: BlogGridProps) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [displayedCount, setDisplayedCount] = useState(data.postsPerPage || 3);
  const POSTS_PER_PAGE = data.postsPerPage || 3;

  // Get all tags
  const tags = useMemo(() => {
    return allTags?.tagConnection?.edges
      ?.map(edge => edge?.node)
      .filter(tag => tag?.name)
      .sort((a, b) => (a?.name || '').localeCompare(b?.name || '')) || [];
  }, [allTags]);

  // Transform raw posts into clean format
  const posts = useMemo(() => {
    const edges = extraPosts?.postConnection?.edges || [];
    return edges
      .map((edge) => {
        const post = edge?.node;
        if (!post) return null;

        const date = new Date(post.date!);
        const formattedDate = isNaN(date.getTime()) ? '' : format(date, 'MMM dd, yyyy');

        return {
          id: post.id,
          published: formattedDate,
          rawDate: date.getTime(), // Store raw timestamp for sorting
          title: post.title,
          tags: (post.tags?.map((tag) => ({
            name: tag?.tag?.name || '',
            color: tag?.tag?.color || 'default',
          })) || []).filter(t => t.name),
          url: `/posts/${post._sys.breadcrumbs?.join('/')}`,
          excerpt: post.excerpt,
          heroImg: post.heroImg,
          author: {
            name: post.author?.name || 'Anonymous',
            avatar: post.author?.avatar,
          },
          readingMins: Math.max(1, Math.round((JSON.stringify(post._body ?? '').split(/\s+/).length || 200) / 200)),
        };
      })
      .filter((post): post is NonNullable<typeof post> => post !== null)
      .sort((a, b) => b.rawDate - a.rawDate); // Sort newest first
  }, [extraPosts]);

  // Filter by selected tag
  const tagFilteredPosts = useMemo(() => {
    if (!selectedTag) return posts;
    return posts.filter(p => p.tags.some(t => t.name === selectedTag));
  }, [posts, selectedTag]);

  // Filter by search query
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return tagFilteredPosts;
    const q = searchQuery.toLowerCase();
    return tagFilteredPosts.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.tags?.some(t => t.name?.toLowerCase().includes(q)) ||
      JSON.stringify(p.excerpt).toLowerCase().includes(q)
    );
  }, [tagFilteredPosts, searchQuery]);

  // Get paginated posts
  const displayedPosts = useMemo(() => {
    return filtered.slice(0, displayedCount);
  }, [filtered, displayedCount]);

  // Check if there are more posts to load
  const hasMorePosts = displayedCount < filtered.length;

  // Load more handler
  const handleLoadMore = useCallback(() => {
    setDisplayedCount(prev => prev + POSTS_PER_PAGE);
  }, [POSTS_PER_PAGE]);

  // Clear filters
  const handleClearFilters = useCallback(() => {
    setSelectedTag(null);
  }, []);

  const isGrayBg = data.background?.includes('gray') || data.background?.includes('#222222');
  const badgeColor = data.badgeColor || 'default';

  return (
    <Section background={data.background as any}>
      <div className="container flex flex-col gap-8">
        {/* Title - Aligned Left */}
        <div className="text-left">
          <h2
            className={`${isGrayBg ? 'text-3xl lg:text-4xl' : 'text-2xl'} font-bold text-white mb-2`}
            data-tina-field={tinaField(data, 'title')}
          >
            {data.title || 'All Articles'}
          </h2>
          {data.description && (
            <p
              className={`${isGrayBg ? 'text-gray-300 text-lg' : 'text-gray-400'}`}
              data-tina-field={tinaField(data, 'description')}
            >
              {data.description}
            </p>
          )}
        </div>

        {/* Category Filter */}
        {data.showCategories && tags.length > 0 && (
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-300">Filter by category</span>
              {selectedTag && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => {
                const colorKey = badgeColor as keyof typeof tagColorClasses;
                const colorClasses = tagColorClasses[colorKey] || tagColorClasses.default;
                const isSelected = selectedTag === tag?.name;

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedTag(isSelected ? null : tag?.name || null)}
                    className={cn(
                      'group/cat relative font-medium tracking-wide border transition-all duration-300 px-3 py-1.5 rounded text-xs',
                      isSelected
                        ? 'border-red-600/60 bg-red-950/50 text-red-300'
                        : colorClasses
                    )}
                  >
                    <span className="relative z-10">{tag?.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active filters display */}
        {(selectedTag || searchQuery) && (
          <div className="w-full flex items-center text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              {searchQuery && <span>Search: "{searchQuery}"</span>}
              {selectedTag && <span>Tag: "{selectedTag}"</span>}
              <span className="text-gray-500">({filtered.length} results)</span>
            </div>
          </div>
        )}

        {/* Posts Grid - 3 Columns */}
        {displayedPosts.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayedPosts.map((post) => (
                <Card
                  key={post.id}
                  className="group relative border border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm transition-all duration-300 hover:border-red-700/40 hover:shadow-lg hover:shadow-red-900/20 rounded-lg overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  {post.heroImg && (
                    <Link href={post.url} className="block relative overflow-hidden h-40">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                      <Image
                        width={400}
                        height={225}
                        src={post.heroImg}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </Link>
                  )}

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-grow">
                    {/* Tags */}
                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {post.tags?.slice(0, 2).map((tag) => (
                          <button
                            key={tag.name}
                            onClick={() => setSelectedTag(tag.name)}
                            className="px-2 py-0.5 text-xs font-medium bg-red-950/40 border border-red-800/40 rounded text-red-400 hover:bg-red-900/50 transition-all duration-200"
                          >
                            {tag.name}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-base font-bold text-white mb-2 line-clamp-2">
                      <Link
                        href={post.url}
                        className="hover:text-red-400 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>

                    {/* Meta */}
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <span>{post.published}</span>
                      <span className="text-red-800">•</span>
                      <span>{post.readingMins} min</span>
                      {post.author?.name && post.author.name !== 'Anonymous' && (
                        <>
                          <span className="text-red-800">•</span>
                          <span>{post.author.name}</span>
                        </>
                      )}
                    </div>

                    {/* Read More Button */}
                    <div className="mt-auto">
                      <Link
                        href={post.url}
                        className="inline-block px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-red-700 to-red-900 rounded transition-all duration-300 hover:from-red-600 hover:to-red-800 hover:shadow-lg hover:shadow-red-900/50"
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Show More Button */}
            {hasMorePosts && (
              <div className="flex justify-center pt-4">
                <Link
                  href="/posts"
                  className="px-8 py-3 font-semibold text-white bg-gradient-to-r from-red-700 to-red-900 rounded-lg transition-all duration-300 hover:from-red-600 hover:to-red-800 hover:shadow-lg hover:shadow-red-900/50 hover:scale-105 inline-block"
                >
                  View All Posts
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No posts found. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </Section>
  );
};

export const blogGridBlockSchema: Template = {
  name: 'blog_grid',
  label: 'Blog Grid',
  ui: {
    previewSrc: '/blocks/content.png',
    defaultItem: {
      title: 'All Articles',
      description: '',
      showCategories: true,
      postsPerPage: 3,
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: 'string',
      label: 'Title',
      name: 'title',
      description: 'The heading for the blog grid section',
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
      type: 'boolean',
      label: 'Show Categories',
      name: 'showCategories',
      description: 'Display category filter buttons',
    },
    {
      type: 'number',
      label: 'Posts Per Page',
      name: 'postsPerPage',
      description: 'Number of posts to display initially and per show more click (default: 3)',
      ui: {
        min: 1,
        max: 20,
      },
    },
    {
      type: 'string',
      label: 'Badge Color',
      name: 'badgeColor',
      description: 'Color for category filter badges',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
        { label: 'Red', value: 'red' },
        { label: 'Yellow', value: 'yellow' },
        { label: 'Purple', value: 'purple' },
        { label: 'Pink', value: 'pink' },
        { label: 'Indigo', value: 'indigo' },
      ],
    },
  ],
};
