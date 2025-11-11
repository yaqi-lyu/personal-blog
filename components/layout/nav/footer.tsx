"use client";
import React from "react";
import Link from "next/link";
import { Icon } from "../../icon";
import { useLayout } from "../layout-context";

export const Footer = () => {
  const { globalSettings } = useLayout();
  const { header, footer } = globalSettings!;
  const footerTheme = (footer?.theme || {}) as { background?: string; foreground?: string };

  return (
    <footer
      className="border-b bg-background pt-20 text-foreground"
      style={{
        ...(footerTheme.background ? { ['--background' as any]: footerTheme.background } : {}),
        ...(footerTheme.foreground ? { ['--foreground' as any]: footerTheme.foreground } : {}),
      }}
    >
      <div className="w-full border-t">
        <div className="w-full px-6 py-6 mx-auto max-w-7xl flex flex-wrap items-center gap-6 flex-col md:flex-row md:justify-between">
          <div className="flex justify-center md:justify-start">
            <span className="self-center text-muted-foreground text-sm">© {new Date().getFullYear()} {header?.name || 'YakShaver'}, All rights reserved</span>
          </div>

          <div className="flex justify-center gap-6 text-sm md:justify-end">
            {footer?.social?.map((link, index) => (
              <Link key={`${link!.icon}${index}`} href={link!.url!} target="_blank" rel="noopener noreferrer" >
                <Icon data={{ ...link!.icon, size: 'small' }} className="text-muted-foreground hover:text-primary block" />
              </Link>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
}
