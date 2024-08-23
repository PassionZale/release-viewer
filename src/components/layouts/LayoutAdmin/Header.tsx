import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/libs/utils";
import MobileSidebar from "./MobileSidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconBrandGithub,
  IconBug,
  IconMessageChatbot,
  IconRocket,
} from "@tabler/icons-react";
import Link from "next/link";
import useUserStore from "@/stores/user";

export default function Header() {
  const { user } = useUserStore();

  return (
    <header className="sticky inset-x-0 top-0 w-full">
      <nav className="flex items-center justify-between px-4 py-2 md:justify-end">
        <div className={cn("block md:!hidden")}>
          <MobileSidebar />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/images/lei-zhang.jpg" alt="Lei Zhang" />
                  <AvatarFallback>Lei</AvatarFallback>
                </Avatar>
                <span className="sr-only">展开菜单</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.nickname}</DropdownMenuLabel>
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
      </nav>
    </header>
  );
}
