'use client';
import React, { useEffect, useRef } from 'react';

type GiscusProps = {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping?: 'pathname' | 'url' | 'title' | 'og:title' | 'specific';
  strict?: '0' | '1';
  term?: string;
  reactionsEnabled?: '0' | '1';
  emitMetadata?: '0' | '1';
  inputPosition?: 'top' | 'bottom';
  theme?: 'light' | 'dark' | 'preferred_color_scheme' | string;
  lang?: string;
  loading?: 'lazy' | 'eager';
  crossorigin?: 'anonymous' | 'use-credentials';
};

export default function Giscus({
  repo,
  repoId,
  category,
  categoryId,
  mapping = 'pathname',
  strict = '0',
  term,
  reactionsEnabled = '1',
  emitMetadata = '0',
  inputPosition = 'bottom',
  theme = 'preferred_color_scheme',
  lang = 'en',
  loading = 'lazy',
  crossorigin = 'anonymous',
}: GiscusProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    const s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    s.async = true;
    s.setAttribute('data-repo', repo);
    s.setAttribute('data-repo-id', repoId);
    s.setAttribute('data-category', category);
    s.setAttribute('data-category-id', categoryId);
    s.setAttribute('data-mapping', mapping);
    s.setAttribute('data-strict', strict);
    if (term) s.setAttribute('data-term', term);
    s.setAttribute('data-reactions-enabled', reactionsEnabled);
    s.setAttribute('data-emit-metadata', emitMetadata);
    s.setAttribute('data-input-position', inputPosition);
    s.setAttribute('data-theme', theme);
    s.setAttribute('data-lang', lang);
    s.setAttribute('data-loading', loading);
    s.setAttribute('crossorigin', crossorigin);
    containerRef.current.appendChild(s);
  }, [
    repo,
    repoId,
    category,
    categoryId,
    mapping,
    strict,
    term,
    reactionsEnabled,
    emitMetadata,
    inputPosition,
    theme,
    lang,
    loading,
    crossorigin,
  ]);

  return <div ref={containerRef} />;
}


