import type { Collection } from 'tinacms';
import { heroBlockSchema } from '@/components/blocks/hero';
import { contentBlockSchema } from '@/components/blocks/content';
import { testimonialBlockSchema } from '@/components/blocks/testimonial';
import { featureBlockSchema } from '@/components/blocks/features';
import { videoBlockSchema } from '@/components/blocks/video';
import { calloutBlockSchema } from '@/components/blocks/callout';
import { statsBlockSchema } from '@/components/blocks/stats';
import { ctaBlockSchema } from '@/components/blocks/call-to-action';
import { featuredBlockSchema } from '@/components/blocks/featured-post';
import { recentBlockSchema } from '@/components/blocks/recent-posts';
import { blogGridBlockSchema } from '@/components/blocks/blog-grid';
import { categoriesBlockSchema } from '@/components/blocks/categories-strip';
import { rssBlockSchema } from '@/components/blocks/rss-feed';
import { imageBlockSchema } from '@/components/blocks/image';

const Page: Collection = {
  label: 'Pages',
  name: 'page',
  path: 'content/pages',
  format: 'mdx',
  ui: {
    router: ({ document }) => {
      const filepath = document._sys.breadcrumbs.join('/');
      if (filepath === 'home') {
        return '/';
      }
      return `/${filepath}`;
    },
  },
  fields: [
    {
      type: 'object',
      list: true,
      name: 'blocks',
      label: 'Sections',
      ui: {
        visualSelector: true,
      },
      templates: [
        heroBlockSchema,
        calloutBlockSchema,
        featureBlockSchema,
        statsBlockSchema,
        ctaBlockSchema,
        contentBlockSchema,
        testimonialBlockSchema,
        videoBlockSchema,
        imageBlockSchema,
        featuredBlockSchema,
        recentBlockSchema,
        blogGridBlockSchema,
        categoriesBlockSchema,
        rssBlockSchema,
      ],
    },
  ],
};

export default Page;
