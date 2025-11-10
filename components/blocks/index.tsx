import { tinaField } from "tinacms/dist/react";
import { Page, PageBlocks, PostConnectionQuery } from "../../tina/__generated__/types";
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
import { CategoriesStrip } from "./categories-strip";
import { NewsletterSignup } from "./newsletter-signup";

type ExtendedBlock = (PageBlocks & { __typename?: PageBlocks['__typename'] }) | {
  __typename: 'PageBlocksFeatured' | 'PageBlocksRecent' | 'PageBlocksCategories' | 'PageBlocksNewsletter';
  background?: string;
};

export const Blocks = (props: Omit<Page, "id" | "_sys" | "_values"> & { extraPosts?: PostConnectionQuery }) => {
  if (!props.blocks) return null;
  return (
    <>
      {props.blocks.map(function (block, i) {
        return (
          <div key={i} data-tina-field={tinaField(block)}>
            <Block {...(block as ExtendedBlock)} extraPosts={props.extraPosts} />
          </div>
        );
      })}
    </>
  );
};

const Block = (block: ExtendedBlock & { extraPosts?: PostConnectionQuery }) => {
  switch (block.__typename) {
    case "PageBlocksVideo":
      return <Video data={block} />;
    case "PageBlocksHero":
      return <Hero data={block} />;
    case "PageBlocksCallout":
      return <Callout data={block} />;
    case "PageBlocksStats":
      return <Stats data={block} />;
    case "PageBlocksContent":
      return <Content data={block} />;
    case "PageBlocksFeatures":
      return <Features data={block} />;
    case "PageBlocksTestimonial":
      return <Testimonial data={block} />;
    case "PageBlocksCta":
      return <CallToAction data={block} />;
    case "PageBlocksFeatured":
      return block.extraPosts ? <FeaturedPost data={block} extraPosts={block.extraPosts} /> : null;
    case "PageBlocksRecent":
      return block.extraPosts ? <RecentPosts data={block} extraPosts={block.extraPosts} /> : null;
    case "PageBlocksCategories":
      return block.extraPosts ? <CategoriesStrip data={block} extraPosts={block.extraPosts} /> : null;
    case "PageBlocksNewsletter":
      return <NewsletterSignup data={block} />;
    default:
      return null;
  }
};
