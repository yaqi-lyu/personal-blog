import client from '@/tina/__generated__/client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SITE_TITLE = 'Willow Notes';
const SITE_DESCRIPTION = 'Willow Notes - Personal reflections and notes from my everyday learning.';

export async function GET() {
  try {
    // Fetch all posts
    let posts = await client.queries.postConnection({
      sort: 'date',
      last: 1,
    });

    const allPosts = posts;

    if (allPosts.data.postConnection.edges) {
      while (posts.data?.postConnection.pageInfo.hasPreviousPage) {
        posts = await client.queries.postConnection({
          sort: 'date',
          before: posts.data.postConnection.pageInfo.endCursor,
        });

        if (!posts.data.postConnection.edges) {
          break;
        }

        allPosts.data.postConnection.edges.push(
          ...posts.data.postConnection.edges.reverse()
        );
      }
    }

    const edges = allPosts.data.postConnection.edges || [];

    // Generate RSS feed
    const rssItems = edges
      .filter((edge) => edge?.node)
      .map((edge) => {
        const post = edge!.node!;
        const postPath = post._sys.relativePath.replace(/\.mdx?$/, '');
        const postUrl = `${SITE_URL}/posts/${postPath}`;
        const pubDate = post.date ? new Date(post.date).toUTCString() : new Date().toUTCString();

        // Extract plain text from excerpt if it's a rich text object
        let description = '';
        if (post.excerpt) {
          if (typeof post.excerpt === 'string') {
            description = post.excerpt;
          } else if (typeof post.excerpt === 'object' && 'children' in post.excerpt) {
            // Handle MDX-like structure
            description = JSON.stringify(post.excerpt);
          }
        }

        return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(postUrl)}</link>
      <guid>${escapeXml(postUrl)}</guid>
      <pubDate>${pubDate}</pubDate>
      ${description ? `<description>${escapeXml(description)}</description>` : ''}
      ${post.author?.name ? `<author>${escapeXml(post.author.name)}</author>` : ''}
      ${post.heroImg ? `<image>${escapeXml(post.heroImg)}</image>` : ''}
    </item>`;
      })
      .join('');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new Response('Error generating RSS feed', { status: 500 });
  }
}

function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
