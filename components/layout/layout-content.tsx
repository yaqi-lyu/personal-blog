"use client";

import React, { PropsWithChildren } from "react";
import { LayoutProvider } from "./layout-context";
import { Header } from "./nav/header";
import { Footer } from "./nav/footer";

type LayoutContentProps = PropsWithChildren & {
  globalSettings: any;
  pageData: any;
  isBlog: boolean;
};

export function LayoutContent({ children, globalSettings, pageData, isBlog }: LayoutContentProps) {
  const wrapperStyle = isBlog
    ? ({
        ["--background" as any]: "#000",
        ["--foreground" as any]: "#fff",
      } as React.CSSProperties)
    : undefined;
  const wrapperClass = isBlog ? "min-h-screen bg-background text-foreground" : undefined;

  return (
    <div className={wrapperClass} style={wrapperStyle}>
      <LayoutProvider globalSettings={globalSettings} pageData={pageData}>
        <Header />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </LayoutProvider>
    </div>
  );
}

