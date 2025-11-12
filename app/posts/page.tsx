import Layout from '@/components/layout/layout';
import client from '@/tina/__generated__/client';
import PostsClientPage from './client-page';

export const revalidate = 300;

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;

  let posts = await client.queries.postConnection({
    sort: 'date',
    last: 1
  });
  const allPosts = posts;

  if (!allPosts.data.postConnection.edges) {
    return [];
  }

  while (posts.data?.postConnection.pageInfo.hasPreviousPage) {
    posts = await client.queries.postConnection({
      sort: 'date',
      before: posts.data.postConnection.pageInfo.endCursor,
    });

    if (!posts.data.postConnection.edges) {
      break;
    }

    allPosts.data.postConnection.edges.push(...posts.data.postConnection.edges.reverse());
  }

  // Fetch all tags
  const tagsData = await client.queries.tagConnection({
    first: 100,
  });

  return (
    <Layout rawPageData={allPosts.data}>
      <PostsClientPage {...allPosts} selectedTag={tag} allTags={tagsData.data.tagConnection} />
    </Layout>
  );
}
