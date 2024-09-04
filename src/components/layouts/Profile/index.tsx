"use client";

import useUserStore, { User } from "@/stores/user";
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
import {
  IconArrowBackUp,
  IconBug,
  IconDashboard,
  IconEdit,
  IconLogin2,
  IconLogout2,
  IconRocket,
} from "@tabler/icons-react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import request from "@/libs/request";

const Profile = ({ isAdmin }: { isAdmin?: boolean }) => {
  const { user, reset, init } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    request.get<User>("/api/auth/profile").then(({ data }) => init(data));
  }, [init]);

  const logout: LinkProps["onClick"] = async (e) => {
    e.preventDefault();

    await request.post("/api/auth/signout");

    reset();

    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={user?.avatar || "/images/default-avatar.jpg"}
              alt={user?.nickname || "Release Viewer"}
            />
            <AvatarFallback>{user?.nickname || "RV"}</AvatarFallback>
          </Avatar>
          <span className="sr-only">展开菜单</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {user?.nickname || "Release Viewer"}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {isAdmin ? (
          <DropdownMenuItem>
            <IconArrowBackUp className="mr-2 h-5 w-5" />
            <Link href={"/"} replace>
              返回前台
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem>
            <IconDashboard className="mr-2 h-5 w-5" />
            {user ? (
              <Link href={"/admin"}>控制台</Link>
            ) : (
              <a href="/admin">控制台</a>
            )}
          </DropdownMenuItem>
        )}

        {user && (
          <DropdownMenuItem>
            <IconEdit className="mr-2 h-5 w-5" />
            <Link href={"/admin/profile"}>个人资料</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <IconRocket className="mr-2 h-5 w-5" />
          {user ? (
            <Link href={"/admin/release/create"}>发布应用</Link>
          ) : (
            <a href="/admin/release/create">发布应用</a>
          )}
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

        {user ? (
          <DropdownMenuItem>
            <IconLogout2 className="mr-2 h-5 w-5" />
            <Link href={"#"} onClick={logout}>
              退出登录
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem>
            <IconLogin2 className="mr-2 h-5 w-5" />
            <Link href={"/login"}>登录</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
