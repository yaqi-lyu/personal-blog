import client from '@/tina/__generated__/client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function GET() {
  try {
    // Fetch all posts and pages
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

    // Fetch all pages
    const pagesData = await client.queries.pageConnection({ first: 100 });
    const pages = pagesData.data.pageConnection.edges || [];

    // Generate sitemap entries
    const postEntries = (allPosts.data.postConnection.edges || [])
      .filter((edge) => edge?.node)
      .map((edge) => {
        const post = edge!.node!;
        const postPath = post._sys.relativePath.replace(/\.mdx?$/, '');
        const postUrl = `${SITE_URL}/posts/${postPath}`;
        const lastmod = post.date || new Date().toISOString();

        return `  <url>
    <loc>${escapeXml(postUrl)}</loc>
    <lastmod>${lastmod.split('T')[0]}</lastmod>
    <priority>0.8</priority>
  </url>`;
      })
      .join('\n');

    const pageEntries = pages
      .filter((edge) => edge?.node)
      .map((edge) => {
        const page = edge!.node!;
        const pagePath = page._sys.breadcrumbs.join('/');
        const pageUrl = pagePath === 'home' ? SITE_URL : `${SITE_URL}/${pagePath}`;

        return `  <url>
    <loc>${escapeXml(pageUrl)}</loc>
    <priority>${pagePath === 'home' ? '1.0' : '0.7'}</priority>
  </url>`;
      })
      .join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageEntries}
${postEntries}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
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
