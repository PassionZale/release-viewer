"use client";

import Link from "next/link";
import { IconMenu2, IconGhost2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import ActiveLink from "@/components/ActiveLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import Profile from "../Profile";

const NavSkeleton = () => (
  <div className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
    <Skeleton className="h-6 w-[100px]" />
    <Skeleton className="h-6 w-[100px]" />
    <Skeleton className="h-6 w-[100px]" />
  </div>
);

export interface NavbarProps {
  items?: { label: string; value: string; href: string }[];
}

const Navbar = ({ items = [] }: NavbarProps) => {
  return (
    <header className="sticky z-50 top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      {/* desktop nav */}
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base h-6 w-6"
        >
          <IconGhost2 className="w-6 h-6" />
          <span className="sr-only">Release Viewer</span>
        </Link>

        {items?.length ? (
          <>
            {items.map((item) => (
              <ActiveLink
                key={item.value}
                href={item.href}
                className="text-nowrap text-muted-foreground transition-colors hover:text-foreground"
                activeClassName="!text-foreground"
              >
                {item.label}
              </ActiveLink>
            ))}
          </>
        ) : (
          <NavSkeleton />
        )}
      </nav>

      {/* mobile nav */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <IconMenu2 className="h-5 w-5" />
            <span className="sr-only">展开菜单</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semiboldh-6 w-6"
            >
              <IconGhost2 className="w-6 h-6" />
              <span className="sr-only">Release Viewer</span>
            </Link>

            {items.map((item) => (
              <ActiveLink
                key={item.value}
                href={item.href}
                className="text-nowrap text-muted-foreground transition-colors hover:text-foreground"
                activeClassName="!text-foreground"
              >
                {item.label}
              </ActiveLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* social nav */}
      <div className="flex w-full justify-end items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <ThemeToggle />

        <Profile />
      </div>
    </header>
  );
};

export default Navbar;
