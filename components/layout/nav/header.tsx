"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "../../icon";
import { useLayout } from "../layout-context";
import { Menu, X } from "lucide-react";

export const Header = () => {
  const { globalSettings, theme } = useLayout();
  const header = globalSettings!.header!;

  const [menuState, setMenuState] = React.useState(false)
  const headerTheme = (header?.theme as any) || {};

  // Determine if we have a custom background color
  const hasCustomBg = headerTheme?.background;
  const bgClass = hasCustomBg
    ? "bg-[var(--header-bg)]/95 backdrop-blur-xl"
    : "bg-background/50 backdrop-blur-3xl";

  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className={`${bgClass} fixed z-20 w-full border-b border-transparent text-foreground`}
        style={{
          // locally scope background/foreground so header can differ from page
          // values should be CSS colors; fall back to inherited vars
          ...(headerTheme.background ? {
            ['--header-bg' as any]: headerTheme.background,
            ['--background' as any]: headerTheme.background
          } : {}),
          ...(headerTheme.foreground ? { ['--foreground' as any]: headerTheme.foreground } : {}),
        }}>
        <div className="mx-auto max-w-7xl px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-4 lg:gap-0 lg:py-5">
            <div className="flex w-full items-center justify-between gap-14">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2">
                <Icon
                  parentColor={header.color!}
                  data={{
                    name: header.icon!.name,
                    color: header.icon!.color,
                    style: header.icon!.style,
                  }}
                />{" "}
                <span className="font-semibold">
                  {header.name}
                </span>
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>

              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm font-medium">
                  {header.nav!.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item!.href!}
                        className="text-foreground/80 hover:text-foreground block duration-150">
                        <span>{item!.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {header.nav!.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item!.href!}
                        className="text-foreground/80 hover:text-foreground block duration-150">
                        <span>{item!.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
