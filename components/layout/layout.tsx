import React, { PropsWithChildren } from "react";
import client from "../../tina/__generated__/client";
import { LayoutContent } from "./layout-content";

type LayoutProps = PropsWithChildren & {
  rawPageData?: any;
};

export default async function Layout({ children, rawPageData }: LayoutProps) {
  const { data: globalData } = await client.queries.global({
    relativePath: "index.json",
  },
    {
      fetchOptions: {
        next: {
          revalidate: 60,
        },
      }
    }
  );

  // For blog listing and single post pages, force a black background by
  // overriding the design tokens (CSS variables) locally. This avoids
  // affecting other routes that also use this Layout.
  const isBlog = Boolean((rawPageData as any)?.post || (rawPageData as any)?.postConnection);

  return (
    <LayoutContent 
      globalSettings={globalData.global} 
      pageData={rawPageData}
      isBlog={isBlog}
    >
      {children}
    </LayoutContent>
  );
}