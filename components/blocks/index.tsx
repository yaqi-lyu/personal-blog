import { tinaField } from "tinacms/dist/react";
import { Page, PageBlocks, PostConnectionQuery, TagConnectionQuery, PageBlocksFeatured, PageBlocksRecent, PageBlocksCategories, PageBlocksNewsletter } from "../../tina/__generated__/types";
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

type ExtendedBlock = PageBlocks | PageBlocksFeatured | PageBlocksRecent | PageBlocksCategories | PageBlocksNewsletter;

export const Blocks = (props: Omit<Page, "id" | "_sys" | "_values"> & { extraPosts?: PostConnectionQuery; allTags?: TagConnectionQuery }) => {
  if (!props.blocks) return null;
  return (
    <>
      {props.blocks.map(function (block, i) {
        return (
          <div key={i} data-tina-field={tinaField(block)}>
            <Block {...(block as ExtendedBlock)} extraPosts={props.extraPosts} allTags={props.allTags} />
          </div>
        );
      })}
    </>
  );
};

const Block = (block: ExtendedBlock & { extraPosts?: PostConnectionQuery; allTags?: TagConnectionQuery }) => {
  switch (block.__typename) {
    case "PageBlocksVideo":
      return <Video data={block as any} />;
    case "PageBlocksHero":
      return <Hero data={block as any} />;
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
    case "PageBlocksCategories":
      return <CategoriesStrip data={block as PageBlocksCategories} allTags={block.allTags} />;
    case "PageBlocksNewsletter":
      return <NewsletterSignup data={block as PageBlocksNewsletter} />;
    default:
      return null;
  }
};
