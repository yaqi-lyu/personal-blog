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

  const date = new Date(post.date!);
  const formattedDate = isNaN(date.getTime()) ? '' : format(date, 'MMM dd, yyyy');
  
  // Calculate reading time
  const readingTime = useMemo(() => {
    const words = JSON.stringify(post._body).split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  }, [post._body]);

  // Extract headings for TOC from TinaCMS rich-text structure
  const headings = useMemo(() => {
    const extractedHeadings: { id: string; text: string; level: number }[] = [];
    
    const extractHeadingsFromNode = (node: any) => {
      if (!node) return;
      
      if (node.type === 'h1' || node.type === 'h2' || node.type === 'h3' || node.type === 'h4' || node.type === 'h5' || node.type === 'h6') {
        const level = parseInt(node.type.substring(1));
        let text = '';
        
        // Extract text from children
        if (node.children) {
          node.children.forEach((child: any) => {
            if (child.type === 'text') {
              text += child.text;
            }
          });
        }
        
        if (text) {
          const id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          
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
        return {
          id: p.id,
          title: p.title,
          url: `/posts/${p._sys.breadcrumbs!.join('/')}`,
          heroImg: p.heroImg as string | undefined,
          excerpt: p.excerpt,
          date: isNaN(postDate.getTime()) ? '' : format(postDate, 'MMM dd, yyyy'),
        };
      })
      .filter(Boolean);
  }, [props.relatedPosts]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black">
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
                <div className="relative aspect-video overflow-hidden rounded-xl border-2 border-red-900/30 shadow-2xl shadow-red-900/20">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                  <Image
                    priority={true}
                    src={post.heroImg}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* Content Area with Sidebar */}
        <Section>
          <div className="container max-w-7xl mx-auto px-4 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Table of Contents - Sidebar */}
              {headings.length > 0 && (
                <aside className="lg:col-span-3 hidden lg:block">
                  <div className="sticky top-24">
                    <div className="p-5 bg-gradient-to-br from-zinc-950 to-red-950/10 border-2 border-red-900/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen size={18} className="text-red-400" />
                        <h3 className="font-bold text-white">Table of Contents</h3>
                      </div>
                      <nav className="space-y-2">
                        {headings.map((heading) => (
                          <a
                            key={heading.id}
                            href={`#${heading.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              const element = document.getElementById(heading.id);
                              if (element) {
                                const offset = 100;
                                const elementPosition = element.getBoundingClientRect().top;
                                const offsetPosition = elementPosition + window.pageYOffset - offset;
                                window.scrollTo({
                                  top: offsetPosition,
                                  behavior: 'smooth'
                                });
                              }
                            }}
                            className={`block text-sm transition-colors ${
                              activeHeading === heading.id
                                ? 'text-red-400 font-semibold'
                                : 'text-gray-400 hover:text-red-400'
                            }`}
                            style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                          >
                            {heading.text}
                          </a>
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
                    prose-headings:text-white prose-headings:font-bold
                    prose-h1:text-4xl prose-h1:mb-6 prose-h1:bg-gradient-to-r prose-h1:from-white prose-h1:to-red-400 prose-h1:bg-clip-text prose-h1:text-transparent
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-l-4 prose-h2:border-red-600 prose-h2:pl-4
                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-red-400
                    prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-red-400 prose-a:no-underline hover:prose-a:text-red-300 hover:prose-a:underline
                    prose-strong:text-white prose-strong:font-semibold
                    prose-code:text-red-400 prose-code:bg-red-950/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-zinc-950 prose-pre:border-2 prose-pre:border-red-900/30 prose-pre:rounded-lg
                    prose-blockquote:border-l-4 prose-blockquote:border-red-600 prose-blockquote:bg-red-950/20 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:text-gray-300 prose-blockquote:italic
                    prose-ul:text-gray-300 prose-ol:text-gray-300
                    prose-li:marker:text-red-400
                    prose-img:rounded-lg prose-img:border-2 prose-img:border-red-900/30 prose-img:shadow-lg
                    prose-hr:border-red-900/30
                    prose-table:border-2 prose-table:border-red-900/30
                    prose-th:bg-red-950/30 prose-th:text-white prose-th:font-bold
                    prose-td:border-red-900/20 prose-td:text-gray-300"
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
        </Section>

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
                    className="group block overflow-hidden bg-gradient-to-br from-zinc-950 to-red-950/10 border-2 border-red-900/30 rounded-lg transition-all duration-300 hover:border-red-700/50 hover:shadow-xl hover:shadow-red-900/20"
                  >
                    <div className="relative aspect-video mb-4 overflow-hidden rounded-t-lg bg-gradient-to-br from-zinc-900 to-red-950/30">
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
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-950/20 to-red-900/10">
                          <svg className="w-12 h-12 text-red-900/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-gray-400">{related.date}</p>
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
            <div className="p-6 bg-gradient-to-br from-zinc-950 to-red-950/10 border-2 border-red-900/30 rounded-lg">
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
