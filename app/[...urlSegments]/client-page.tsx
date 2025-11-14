"use client";
import { useTina } from "tinacms/dist/react";
import { Blocks } from "@/components/blocks";
import { PageQuery } from "@/tina/__generated__/types";
import ErrorBoundary from "@/components/error-boundary";
import { useState } from "react";

export interface ClientPageProps {
  data: {
    page: PageQuery["page"];
  };
  variables: {
    relativePath: string;
  };
  query: string;
  extraPosts?: any;
  allTags?: any;
}

export default function ClientPage(props: ClientPageProps) {
  const { data } = useTina({ ...props });
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#222222]">
        <Blocks
          {...data?.page as any}
          extraPosts={props.extraPosts}
          allTags={props.allTags}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
    </ErrorBoundary>
  );
}
