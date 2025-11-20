import { tinaField } from "tinacms/dist/react";
import { Page, PageBlocks, PostConnectionQuery, TagConnectionQuery, PageBlocksFeatured, PageBlocksRecent, PageBlocksCategories, PageBlocksRss, PageBlocksBlog_Grid } from "../../tina/__generated__/types";
import { Hero } from "./hero";
import { Content } from "./content";
import { Features } from "./features";
import { Testimonial } from "./testimonial";
import { Video } from "./video";
import { Callout } from "./callout";
import { Stats } from "./stats";
import { CallToAction } from "./call-to-action";
import { FeaturedPost } from "./featured-post";
import { RecentPosts } from "./recent-posts";
import { BlogGrid } from "./blog-grid";
import { CategoriesStrip } from "./categories-strip";
import { RssFeed } from "./rss-feed";
import { ImageBlock } from "./image";

type ExtendedBlock = PageBlocks | PageBlocksFeatured | PageBlocksRecent | PageBlocksCategories | PageBlocksRss | PageBlocksBlog_Grid;

export const Blocks = (props: Omit<Page, "id" | "_sys" | "_values"> & { extraPosts?: PostConnectionQuery; allTags?: TagConnectionQuery; searchQuery?: string; setSearchQuery?: (q: string) => void }) => {
  if (!props.blocks) return null;
  return (
    <>
      {props.blocks.map(function (block, i) {
        // Filter out null blocks
        if (!block) return null;

        // Always show hero blocks, show blog grid when searching, hide other blocks during search
        const isHeroBlock = block.__typename === "PageBlocksHero";
        const isBlogGridBlock = block.__typename === "PageBlocksBlog_grid";
        const shouldShowBlock = isHeroBlock || isBlogGridBlock || !props.searchQuery;

        if (!shouldShowBlock) return null;

        return (
          <div key={i} data-tina-field={tinaField(block)}>
            <Block {...(block as ExtendedBlock)} extraPosts={props.extraPosts} allTags={props.allTags} searchQuery={props.searchQuery} setSearchQuery={props.setSearchQuery} />
          </div>
        );
      })}
    </>
  );
};

const Block = (block: ExtendedBlock & { extraPosts?: PostConnectionQuery; allTags?: TagConnectionQuery; searchQuery?: string; setSearchQuery?: (q: string) => void }) => {
  switch (block.__typename) {
    case "PageBlocksVideo":
      return <Video data={block as any} />;
    case "PageBlocksHero":
      return <Hero data={block as any} searchQuery={block.searchQuery} setSearchQuery={block.setSearchQuery} />;
    case "PageBlocksCallout":
      return <Callout data={block as any} />;
    case "PageBlocksStats":
      return <Stats data={block as any} />;
    case "PageBlocksContent":
      return <Content data={block as any} />;
    case "PageBlocksFeatures":
      return <Features data={block as any} />;
    case "PageBlocksTestimonial":
      return <Testimonial data={block as any} />;
    case "PageBlocksCta":
      return <CallToAction data={block as any} />;
    case "PageBlocksFeatured":
      return block.extraPosts ? <FeaturedPost data={block as PageBlocksFeatured} extraPosts={block.extraPosts} /> : null;
    case "PageBlocksRecent":
      return block.extraPosts ? <RecentPosts data={block as PageBlocksRecent} extraPosts={block.extraPosts} /> : null;
    case "PageBlocksBlog_grid":
      return block.extraPosts ? <BlogGrid data={block as PageBlocksBlog_Grid} extraPosts={block.extraPosts} allTags={block.allTags} searchQuery={block.searchQuery} /> : null;
    case "PageBlocksCategories":
      return <CategoriesStrip data={block as PageBlocksCategories} allTags={block.allTags} />;
    case "PageBlocksRss":
      return <RssFeed data={block as PageBlocksRss} />;
    case "PageBlocksImage":
      return <ImageBlock data={block as any} />;
    default:
      return null;
  }
};
