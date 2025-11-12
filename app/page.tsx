import React from "react";
import client from "@/tina/__generated__/client";
import Layout from "@/components/layout/layout";
import ClientPage from "./[...urlSegments]/client-page";
// home extensions are rendered inside ClientPage to keep block-based style

export const revalidate = 300;

export default async function Home() {
  const data = await client.queries.page({
    relativePath: `home.mdx`,
  });

  // Fetch all posts (blog grid needs complete list for search/filtering)
  const posts = await client.queries.postConnection({
    sort: 'date',
    first: 100, // Increased to get more posts for blog grid
  });

  // Fetch all tags
  const tags = await client.queries.tagConnection();

  return (
    <Layout rawPageData={data}>
      <ClientPage {...data} extraPosts={posts.data} allTags={tags.data} />
    </Layout>
  );
}
