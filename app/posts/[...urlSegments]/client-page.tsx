'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { tinaField, useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { PostQuery, PostConnectionQuery } from '@/tina/__generated__/types';
import { Section } from '@/components/layout/section';
import { components } from '@/components/mdx-components';
import ErrorBoundary from '@/components/error-boundary';
import Giscus from '@/components/giscus';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRound, Clock, Calendar, BookOpen } from 'lucide-react';

interface ClientPostProps {
  data: PostQuery;
  variables: {
    relativePath: string;
  };
  query: string;
  relatedPosts?: PostConnectionQuery;
}

export default function PostClientPage(props: ClientPostProps) {
  const { data } = useTina({ ...props });
  const post = data.post;
  const [activeHeading, setActiveHeading] = useState('');

  const formattedDate = useMemo(() => {
    const date = new Date(post.date!);
    return isNaN(date.getTime()) ? '' : format(date, 'MMM dd, yyyy');
  }, [post.date]);
  
  // Calculate reading time
  const readingTime = useMemo(() => {
    const words = JSON.stringify(post._body).split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  }, [post._body]);

  // Helper to generate ID from text (must match mdx-components.tsx)
  const generateHeadingId = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Helper to extract text from node
  const extractHeadingText = (node: any): string => {
    if (typeof node === 'string') return node;
    if (!node) return '';

    let text = '';

    if (node.type === 'text') {
      text += node.text || '';
    }

    if (node.children && Array.isArray(node.children)) {
      node.children.forEach((child: any) => {
        text += extractHeadingText(child);
      });
    }

    return text;
  };

  // Extract headings for TOC from TinaCMS rich-text structure
  const headings = useMemo(() => {
    const extractedHeadings: { id: string; text: string; level: number }[] = [];

    const extractHeadingsFromNode = (node: any) => {
      if (!node) return;

      if (node.type === 'h1' || node.type === 'h2' || node.type === 'h3' || node.type === 'h4' || node.type === 'h5' || node.type === 'h6') {
        const level = parseInt(node.type.substring(1));
        const text = extractHeadingText(node);

        if (text) {
          const id = generateHeadingId(text);
          extractedHeadings.push({ id, text, level });
        }
      }

      // Recursively check children
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach((child: any) => extractHeadingsFromNode(child));
      }
    };

    if (post._body && Array.isArray(post._body.children)) {
      post._body.children.forEach((node: any) => extractHeadingsFromNode(node));
    }

    return extractedHeadings;
  }, [post._body]);

  // Track active heading on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          setActiveHeading(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  // Related posts
  const relatedPostsData = useMemo(() => {
    if (!props.relatedPosts?.postConnection?.edges) return [];
    return props.relatedPosts.postConnection.edges
      .slice(0, 3)
      .map(edge => {
        const p = edge?.node;
        if (!p) return null;
        const postDate = new Date(p.date!);
        const readingTime = Math.max(1, Math.round((JSON.stringify(p.excerpt ?? '').split(/\s+/).length || 200) / 200));
        return {
          id: p.id,
          title: p.title,
          url: `/posts/${p._sys.breadcrumbs!.join('/')}`,
          heroImg: p.heroImg as string | undefined,
          excerpt: p.excerpt,
          date: isNaN(postDate.getTime()) ? '' : format(postDate, 'MMM dd, yyyy'),
          author: p.author?.name || 'Anonymous',
          readingTime,
          tags: (p.tags || []).map(t => t?.tag?.name || '').filter(Boolean),
        };
      })
      .filter(Boolean);
  }, [props.relatedPosts]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#222222] dark:bg-gray-900">
        {/* Hero Section */}
        <Section>
          <div className="container max-w-6xl mx-auto px-4 pt-12 pb-8">
            {/* Title */}
            <h1 
              data-tina-field={tinaField(post, 'title')} 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 bg-gradient-to-r from-white via-gray-100 to-red-400 bg-clip-text text-transparent leading-tight"
            >
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-gray-300">
              {post.author && (
                <div className="flex items-center gap-3">
                  <Avatar className="ring-2 ring-red-900/50">
                    {post.author.avatar && (
                      <AvatarImage
                        data-tina-field={tinaField(post.author, 'avatar')}
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="h-10 w-10"
                      />
                    )}
                    <AvatarFallback className="bg-red-950/50 text-red-400">
                      <UserRound size={18} />
                    </AvatarFallback>
                  </Avatar>
                  <span 
                    data-tina-field={tinaField(post.author, 'name')}
                    className="font-medium text-white"
                  >
                    {post.author.name}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-red-400" />
                <span data-tina-field={tinaField(post, 'date')}>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} className="text-red-400" />
                <span>{readingTime} min read</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                {post.tags.map((tagObj, idx) => (
                  <Link
                    key={idx}
                    href={`/posts?tag=${encodeURIComponent(tagObj?.tag?.name || '')}`}
                    className="px-3 py-1 text-xs font-medium bg-red-950/40 border border-red-800/40 rounded-md text-red-400 transition-all duration-200 hover:bg-red-900/50 hover:border-red-600/60 hover:text-red-300"
                  >
                    {tagObj?.tag?.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Hero Image */}
            {post.heroImg && (
              <div data-tina-field={tinaField(post, 'heroImg')} className="relative w-full max-w-4xl mx-auto mb-12">
                <div className="relative aspect-video overflow-hidden rounded-xl border border-zinc-800 shadow-2xl shadow-black/40">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
                  <Image
                    priority={true}
                    src={post.heroImg}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 896px"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* Content Area with Sidebar */}
        <div className="bg-[#222222]" style={{ overflow: 'visible' }}>
          <div className="container max-w-7xl mx-auto px-4 py-12" style={{ overflow: 'visible' }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" style={{ overflow: 'visible' }}>
              {/* Table of Contents - Sidebar */}
              {headings.length > 0 && (
                <aside className="lg:col-span-3 hidden lg:block" style={{ overflow: 'visible' }}>
                  <div
                    className="sticky top-24 self-start"
                    style={{
                      position: 'sticky',
                      top: '6rem',
                      zIndex: 10,
                      maxHeight: 'calc(100vh - 8rem)'
                    }}
                  >
                    <div className="p-5 bg-[#1a1a1a] backdrop-blur-sm border border-red-900/20 rounded-lg max-h-full overflow-y-auto">
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen size={18} className="text-red-400" />
                        <h3 className="font-bold text-white">Table of Contents</h3>
                      </div>
                      <nav className="space-y-2">
                        {headings.map((heading) => (
                          <button
                            key={heading.id}
                            onClick={(e) => {
                              e.preventDefault();
                              const element = document.getElementById(heading.id);
                              if (element) {
                                const offset = 100;
                                const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                                window.scrollTo({
                                  top: elementPosition - offset,
                                  behavior: 'smooth'
                                });
                              }
                            }}
                            className={`block w-full text-left text-sm transition-colors py-1 cursor-pointer ${
                              activeHeading === heading.id
                                ? 'text-red-400 font-semibold'
                                : 'text-gray-400 hover:text-red-400'
                            }`}
                            style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                          >
                            {heading.text}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                </aside>
              )}

              {/* Main Content */}
              <article className={headings.length > 0 ? "lg:col-span-9" : "lg:col-span-12"}>
                <div 
                  id="content"
                  data-tina-field={tinaField(post, '_body')} 
                  className="prose prose-invert prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-white
                    prose-h1:text-5xl prose-h1:mb-8 prose-h1:mt-0 prose-h1:text-white
                    prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-white prose-h2:border-l-4 prose-h2:border-red-600 prose-h2:pl-4
                    prose-h3:text-3xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-white
                    prose-h4:text-2xl prose-h4:mt-6 prose-h4:mb-3 prose-h4:text-white
                    prose-h5:text-xl prose-h5:mt-4 prose-h5:mb-2 prose-h5:text-white
                    prose-h6:text-lg prose-h6:mt-4 prose-h6:mb-2 prose-h6:text-white
                    prose-p:text-gray-200 prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-red-400 prose-a:no-underline hover:prose-a:text-red-300 hover:prose-a:underline prose-a:font-medium
                    prose-strong:text-white prose-strong:font-bold
                    prose-em:text-gray-100 prose-em:italic
                    prose-code:text-red-300 prose-code:bg-[#0a0a0a] prose-code:border prose-code:border-red-900/30 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-code:font-mono
                    prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-red-900/30 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
                    prose-pre:text-gray-200
                    prose-blockquote:border-l-4 prose-blockquote:border-red-600 prose-blockquote:bg-[#1a1a1a] prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:text-gray-200 prose-blockquote:italic prose-blockquote:not-italic:first-child:mt-0
                    prose-ul:text-gray-200
                    prose-ol:text-gray-200
                    prose-li:text-gray-200
                    prose-li:marker:text-red-500
                    prose-img:rounded-lg prose-img:border prose-img:border-red-900/30 prose-img:shadow-lg prose-img:shadow-red-900/20
                    prose-hr:border-red-900/30
                    prose-table:border-collapse
                    prose-table:border prose-table:border-red-900/30
                    prose-th:bg-[#0a0a0a] prose-th:text-white prose-th:font-bold prose-th:border prose-th:border-red-900/30 prose-th:px-4 prose-th:py-2
                    prose-td:border prose-td:border-red-900/30 prose-td:text-gray-200 prose-td:px-4 prose-td:py-2"
                >
                  <TinaMarkdown
                    content={post._body}
                    components={{
                      ...components,
                    }}
                  />
                </div>
              </article>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPostsData.length > 0 && (
          <Section>
            <div className="container max-w-6xl mx-auto px-4 py-16 border-t-2 border-red-900/30">
              <h2 className="text-3xl font-bold text-white mb-8">Related Articles</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedPostsData.map((related: any) => (
                  <Link
                    key={related.id}
                    href={related.url}
                    className="group block overflow-hidden bg-[#1a1a1a] backdrop-blur-sm border border-red-900/20 rounded-lg transition-all duration-300 hover:border-red-700/40 hover:shadow-xl hover:shadow-red-900/30"
                  >
                    <div className="relative aspect-video mb-4 overflow-hidden rounded-t-lg bg-[#0a0a0a]">
                      {related.heroImg ? (
                        <Image
                          src={related.heroImg}
                          alt={related.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          priority={false}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
                          <svg className="w-12 h-12 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-5 space-y-3">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{related.date}</span>
                        <span className="text-zinc-700">•</span>
                        <span>{related.author}</span>
                        <span className="text-zinc-700">•</span>
                        <span>{related.readingTime} min read</span>
                      </div>
                      {related.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {related.tags.map((tag: string) => (
                            <button
                              key={tag}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.location.href = `/posts?tag=${encodeURIComponent(tag)}`;
                              }}
                              className="px-2 py-0.5 text-xs font-medium bg-red-950/40 border border-red-800/40 rounded text-red-400 transition-all duration-200 hover:bg-red-900/50 hover:border-red-600/60 hover:text-red-300"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* Comments */}
        <Section>
          <div className="container max-w-6xl mx-auto px-4 py-16">
            <div className="p-6 bg-[#1a1a1a] backdrop-blur-sm border border-red-900/20 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-6">Comments</h2>
              <Giscus
                repo={process.env.NEXT_PUBLIC_GISCUS_REPO as string}
                repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID as string}
                category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY as string}
                categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID as string}
                mapping='pathname'
                reactionsEnabled='1'
                emitMetadata='0'
                inputPosition='bottom'
                theme='dark'
                lang='en'
                loading='lazy'
              />
            </div>
          </div>
        </Section>
      </div>
    </ErrorBoundary>
  );
}
