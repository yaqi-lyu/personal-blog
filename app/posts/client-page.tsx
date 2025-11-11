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

          <div className="grid gap-y-10 sm:grid-cols-12 sm:gap-y-12 md:gap-y-16 lg:gap-y-20">
            {filtered.map((post) => (
              <Card
                key={post.id}
                className="order-last border-0 bg-transparent shadow-none sm:order-first sm:col-span-12 lg:col-span-10 lg:col-start-2"
              >
                <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-5 sm:gap-y-0 md:items-center md:gap-x-8 lg:gap-x-12">
                  <div className="sm:col-span-5">
                    <div className="mb-4 md:mb-6">
                      <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wider text-gray-400 md:gap-5 lg:gap-6">
                        {post.tags?.map((tag) => (
                          <Link 
                            key={tag}
                            href={`/posts?tag=${encodeURIComponent(tag)}`}
                            className="hover:text-white transition-colors"
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl text-white">
                      <Link
                        href={post.url}
                        className="hover:underline"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <div className="mt-4 text-gray-300 md:mt-5">
                      <TinaMarkdown content={post.excerpt} />
                    </div>
                    <div className="mt-6 flex items-center space-x-4 text-sm md:mt-8 text-gray-300">
                      <Avatar>
                        {post.author.avatar && (
                          <AvatarImage
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="h-8 w-8"
                          />
                        )}
                        <AvatarFallback>
                          <UserRound size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
                        </AvatarFallback>
                      </Avatar>
                      <span>{post.author.name}</span>
                      <span>•</span>
                      <span>
                        {post.published}
                      </span>
                    </div>
                    <div className="mt-6 flex items-center space-x-2 md:mt-8">
                      <Link
                        href={post.url}
                        className="inline-flex items-center font-semibold text-white hover:underline md:text-base"
                      >
                        <span>Read more</span>
                        <ArrowRight className="ml-2 size-4 transition-transform" />
                      </Link>
                    </div>
                  </div>
                  {post.heroImg && (
                    <div className="order-first sm:order-last sm:col-span-5">
                      <Link href={post.url} className="block">
                        <div className="aspect-[16/9] overflow-clip rounded-lg border border-border">
                          <Image
                            width={533}
                            height={300}
                            src={post.heroImg}
                            alt={post.title}
                            className="h-full w-full object-cover transition-opacity duration-200 fade-in hover:opacity-70"
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
