import React from "react";
import client from "@/tina/__generated__/client";
import Layout from "@/components/layout/layout";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const revalidate = 300;

const tagColorClasses = {
  default: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200',
  blue: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200',
  green: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200',
  red: 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200',
  yellow: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200',
  purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200',
  pink: 'bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-pink-900 dark:text-pink-200',
  indigo: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200',
};

export default async function TagsPage() {
  // Fetch all tags
  const tagsResponse = await client.queries.tagConnection();

  // Fetch all posts to count posts per tag
  const postsResponse = await client.queries.postConnection({
    first: 1000,
  });

  // Count posts per tag
  const tagCounts = new Map<string, number>();
  postsResponse.data?.postConnection?.edges?.forEach(edge => {
    edge?.node?.tags?.forEach(t => {
      const tagName = t?.tag?.name;
      if (tagName) {
        tagCounts.set(tagName, (tagCounts.get(tagName) || 0) + 1);
      }
    });
  });

  // Build tag list with metadata
  const tags = tagsResponse.data?.tagConnection?.edges
    ?.map(edge => {
      const tag = edge?.node;
      if (!tag?.name) return null;
      return {
        name: tag.name,
        description: tag.description,
        color: tag.color || 'default',
        count: tagCounts.get(tag.name) || 0,
      };
    })
    .filter(Boolean)
    .sort((a, b) => (b?.count || 0) - (a?.count || 0)) || [];

  return (
    <Layout>
      <div className="container mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">All Tags</h1>
        <p className="text-muted-foreground mb-8">
          Browse all topics and categories
        </p>

        {tags.length === 0 ? (
          <p className="text-muted-foreground">No tags found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tags.map((tag) => (
              <Link
                key={tag?.name}
                href={`/posts?tag=${encodeURIComponent(tag?.name || '')}`}
                className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={cn(
                      'inline-block px-3 py-1 rounded-full text-sm font-medium',
                      tagColorClasses[tag?.color as keyof typeof tagColorClasses] || tagColorClasses.default
                    )}
                  >
                    {tag?.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {tag?.count} {tag?.count === 1 ? 'post' : 'posts'}
                  </span>
                </div>
                {tag?.description && (
                  <p className="text-sm text-muted-foreground">
                    {tag.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
