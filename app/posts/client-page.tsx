'use client';
import React, { useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { PostConnectionQuery, PostConnectionQueryVariables } from '@/tina/__generated__/types';
import ErrorBoundary from '@/components/error-boundary';
import { ArrowRight, UserRound } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/layout/section';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ClientPostProps {
  data: PostConnectionQuery;
  variables: PostConnectionQueryVariables;
  query: string;
  selectedTag?: string;
}

export default function PostsClientPage(props: ClientPostProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Transform raw posts into clean format
  const posts = useMemo(() => props.data?.postConnection.edges!.map((postData) => {
    const post = postData!.node!;
    const date = new Date(post.date!);
    const formattedDate = isNaN(date.getTime()) ? '' : format(date, 'MMM dd, yyyy');

    return {
      id: post.id,
      published: formattedDate,
      title: post.title,
      tags: (post.tags?.map((tag) => tag?.tag?.name) || []).filter(Boolean) as string[],
      url: `/posts/${post._sys.breadcrumbs.join('/')}`,
      excerpt: post.excerpt,
      heroImg: post.heroImg,
      author: {
        name: post.author?.name || 'Anonymous',
        avatar: post.author?.avatar,
      }
    }
  }) || [], [props.data]);

  // First filter by tag
  const tagFilteredPosts = useMemo(() => {
    if (!props.selectedTag) return posts;
    return posts.filter(p => p.tags.includes(props.selectedTag!));
  }, [posts, props.selectedTag]);

  // Then filter by search query
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return tagFilteredPosts;
    const q = searchQuery.toLowerCase();
    return tagFilteredPosts.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.tags?.some(t => t?.toLowerCase().includes(q)) ||
      JSON.stringify(p.excerpt).toLowerCase().includes(q)
    );
  }, [tagFilteredPosts, searchQuery]);

  // Clear all filters and navigate
  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    router.push('/posts');
  }, [router]);

  return (
    <ErrorBoundary>
      <Section>
        <div className="container flex flex-col items-center gap-16">
          <div className="text-center">
            <h2 className="mx-auto mb-6 text-pretty text-3xl font-semibold md:text-4xl lg:max-w-3xl text-white">
              {props.selectedTag ? `Posts tagged with "${props.selectedTag}"` : 'YakShaver Blog'}
            </h2>
            <p className="mx-auto max-w-2xl text-gray-300 md:text-lg">
              {props.selectedTag 
                ? `Showing all posts related to ${props.selectedTag}`
                : 'Practical engineering notes, patterns, and templates—so you can ship faster with fewer yaks.'
              }
            </p>
          </div>

          <div className="w-full max-w-3xl">
            {props.selectedTag && (
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">Filtered by tag:</span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-white">
                    {props.selectedTag}
                    <button
                      onClick={handleClearFilters}
                      className="hover:text-primary"
                      aria-label="Clear tag filter"
                    >
                      ✕
                    </button>
                  </span>
                </div>
                <button 
                  onClick={handleClearFilters}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  View all posts →
                </button>
              </div>
            )}
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts by title, tag, or excerpt..."
              className="w-full rounded-md border bg-background px-4 py-2 text-base text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-ring"
              aria-label="Search posts"
            />
          </div>

          <div className="grid gap-y-8 sm:grid-cols-12 sm:gap-y-10 md:gap-y-12 lg:gap-y-16">
            {filtered.map((post) => (
              <Card
                key={post.id}
                className="group relative order-last border-2 border-red-900/30 bg-gradient-to-br from-black via-zinc-950 to-red-950/20 shadow-lg shadow-red-900/10 transition-all duration-300 hover:border-red-700/50 hover:shadow-xl hover:shadow-red-900/20 sm:order-first sm:col-span-12 lg:col-span-10 lg:col-start-2 rounded-xl overflow-hidden backdrop-blur-sm"
              >
                {/* Accent bar */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-600 via-red-700 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                
                <div className="p-6 md:p-8 grid gap-y-6 sm:grid-cols-10 sm:gap-x-6 sm:gap-y-0 md:items-center md:gap-x-8 lg:gap-x-10">
                  <div className="sm:col-span-5 space-y-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {post.tags?.map((tag) => (
                        <Link 
                          key={tag}
                          href={`/posts?tag=${encodeURIComponent(tag)}`}
                          className="group/tag relative px-3 py-1.5 text-xs font-medium tracking-wide uppercase bg-red-950/40 border border-red-800/40 rounded-md text-red-400 transition-all duration-200 hover:bg-red-900/50 hover:border-red-600/60 hover:text-red-300 hover:shadow-lg hover:shadow-red-900/30 hover:-translate-y-0.5"
                        >
                          <span className="relative z-10">{tag}</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/10 to-red-600/0 opacity-0 group-hover/tag:opacity-100 transition-opacity rounded-md" />
                        </Link>
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold md:text-2xl lg:text-3xl text-white leading-tight">
                      <Link
                        href={post.url}
                        className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent hover:from-red-400 hover:to-white transition-all duration-300"
                      >
                        {post.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <div className="mt-3 text-gray-300 text-sm md:text-base leading-relaxed line-clamp-3">
                      <TinaMarkdown content={post.excerpt} />
                    </div>

                    {/* Author & Date */}
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <Avatar className="ring-2 ring-red-900/30">
                        {post.author.avatar && (
                          <AvatarImage
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="h-9 w-9"
                          />
                        )}
                        <AvatarFallback className="bg-red-950/50 text-red-400">
                          <UserRound size={16} strokeWidth={2} />
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-300">{post.author.name}</span>
                      <span className="text-red-800">•</span>
                      <span>{post.published}</span>
                    </div>

                    {/* Read More Button */}
                    <div className="pt-2">
                      <Link
                        href={post.url}
                        className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-white bg-gradient-to-r from-red-700 to-red-900 rounded-lg transition-all duration-300 hover:from-red-600 hover:to-red-800 hover:shadow-lg hover:shadow-red-900/50 hover:translate-x-1 group/button"
                      >
                        <span>Read more</span>
                        <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-1" />
                      </Link>
                    </div>
                  </div>

                  {/* Image */}
                  {post.heroImg && (
                    <div className="order-first sm:order-last sm:col-span-5">
                      <Link href={post.url} className="block group/image">
                        <div className="relative aspect-[16/9] overflow-hidden rounded-lg border-2 border-red-900/30 shadow-lg shadow-red-900/20 group-hover/image:border-red-700/50 transition-all duration-300">
                          {/* Red gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-red-950/40 via-transparent to-transparent opacity-60 group-hover/image:opacity-30 transition-opacity z-10" />
                          <Image
                            width={533}
                            height={300}
                            src={post.heroImg}
                            alt={post.title}
                            className="h-full w-full object-cover transition-all duration-500 group-hover/image:scale-105"
                          />
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </ErrorBoundary>
  );
}
