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

  // Fetch posts (first 4 for featured + recent)
  const posts = await client.queries.postConnection({
    sort: 'date',
    first: 4,
  });

  // Fetch all tags
  const tags = await client.queries.tagConnection();

  return (
    <Layout rawPageData={data}>
      <ClientPage {...data} extraPosts={posts.data} allTags={tags.data} />
    </Layout>
  );
}
