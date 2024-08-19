"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  IconBug,
  IconMenu2,
  IconRocket,
  IconBrandGithub,
  IconMessageChatbot,
  IconDashboard,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import ActiveLink from "@/components/ActiveLink";
import { ThemeToggle } from "@/components/ThemeToggle";

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
  const router = useRouter();

  return (
    <header className="sticky z-50 top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      {/* desktop nav */}
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base h-6 w-6"
        >
          <Image src="/next.svg" width={24} height={24} alt="next" priority />
          <span className="sr-only">Omost</span>
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
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semiboldh-6 w-6"
            >
              <Image
                src="/vercel.svg"
                width={24}
                height={24}
                alt="vercel"
                priority
              />
              <span className="sr-only">Omost</span>
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

        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin")}
        >
          <IconDashboard />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/images/lei-zhang.jpg" alt="Lei Zhang" />
                <AvatarFallback>Lei</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Lei Zhang</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IconRocket className="mr-2 h-5 w-5" />
              <Link href={"/admin/release/create"} target="_blank">
                发布应用
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconBug className="mr-2 h-5 w-5" />
              <Link href="https://github.com/PassionZale/release-viewer/issues/new">
                报告问题
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IconMessageChatbot className="mr-2 h-5 w-5" />
              <Link href="https://www.lovchun.com" target="_blank">
                👋 Hello!
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconBrandGithub className="mr-2 h-5 w-5" />
              <Link href="https://github.com/PassionZale" target="_blank">
                PassionZale
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
