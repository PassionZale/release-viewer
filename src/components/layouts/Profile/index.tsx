"use client";

import useUserStore from "@/stores/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconBug, IconLogout2, IconRocket } from "@tabler/icons-react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";

const Profile = () => {
  const { user, reset } = useUserStore();
  const router = useRouter();

  const logout: LinkProps["onClick"] = (e) => {
    e.preventDefault();

    reset();

    router.push("/api/auth/signout");
  };

  if (!user) {
    return (
      <Button
        variant="secondary"
        size="icon"
        className="rounded-full"
        onClick={() => router.push("/login")}
      >
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={"/images/default-avatar.jpg"}
            alt={"Release Viewer"}
          />
          <AvatarFallback>Release Viewer</AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={user?.avatar || "/images/default-avatar.jpg"}
              alt={user.nickname}
            />
            <AvatarFallback>{user.nickname}</AvatarFallback>
          </Avatar>
          <span className="sr-only">展开菜单</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user?.nickname}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <IconRocket className="mr-2 h-5 w-5" />
          <Link href={"/admin/release/create"}>发布应用</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconBug className="mr-2 h-5 w-5" />
          <Link
            href="https://github.com/PassionZale/release-viewer/issues/new"
            target="_blank"
          >
            报告问题
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <IconLogout2 className="mr-2 h-5 w-5" />
          <Link href={"#"} onClick={logout}>
            退出登录
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
