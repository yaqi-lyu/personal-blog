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

  // Check if all required props are provided
  if (!repo || !repoId || !category || !categoryId) {
    return (
      <div className="border border-yellow-400 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-600 rounded-lg p-6 text-sm">
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
          Giscus Comments Not Configured
        </h3>
        <p className="text-yellow-700 dark:text-yellow-300 mb-3">
          To enable comments on your blog posts, you need to configure Giscus with your GitHub repository.
        </p>
        <ol className="list-decimal list-inside space-y-1 text-yellow-700 dark:text-yellow-300 mb-3">
          <li>Enable GitHub Discussions on your repository</li>
          <li>Visit <a href="https://giscus.app" target="_blank" rel="noopener noreferrer" className="underline">giscus.app</a> to generate your configuration</li>
          <li>Add the generated values to your <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">.env.local</code> file:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li><code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">NEXT_PUBLIC_GISCUS_REPO</code></li>
              <li><code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">NEXT_PUBLIC_GISCUS_REPO_ID</code></li>
              <li><code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">NEXT_PUBLIC_GISCUS_CATEGORY</code></li>
              <li><code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">NEXT_PUBLIC_GISCUS_CATEGORY_ID</code></li>
            </ul>
          </li>
          <li>Restart your development server</li>
        </ol>
        <p className="text-xs text-yellow-600 dark:text-yellow-400">
          Missing values: {[
            !repo && 'NEXT_PUBLIC_GISCUS_REPO',
            !repoId && 'NEXT_PUBLIC_GISCUS_REPO_ID',
            !category && 'NEXT_PUBLIC_GISCUS_CATEGORY',
            !categoryId && 'NEXT_PUBLIC_GISCUS_CATEGORY_ID',
          ].filter(Boolean).join(', ')}
        </p>
      </div>
    );
  }

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


