import { ReactNode } from "react";

export default function Head(): ReactNode {
  return (
    <>
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" title="Willow Notes RSS Feed" />
    </>
  );
}
