"use client";
import React from "react";
import { cn } from "@/libs/utils";
import {
  IconApps,
  IconBook,
  IconBrandAlipay,
  IconBrandWechat,
  IconChevronLeft,
  IconGhost2,
  IconHomeHand,
  IconKey,
  IconRocket,
  IconUsers,
  IconZeppelin,
} from "@tabler/icons-react";
import useSidebarStore from "@/stores/sidebar";
import Link from "next/link";
import { Navbar } from "./Navbar";
import { Role } from "@/types/enum";

type SidebarProps = {
  className?: string;
};

export const NavItems = [
  {
    label: "首页",
    value: "admin",
    href: "/admin",
    icon: <IconHomeHand />,
  },
  {
    label: "字典",
    value: "dict",
    href: "/admin/dict",
    icon: <IconBook />,
  },
  {
    label: "用户",
    value: "user",
    href: "/admin/user",
    icon: <IconUsers />,
    role: Role.ADMIN,
  },
  {
    label: "应用",
    value: "app",
    href: "/admin/app",
    icon: <IconApps />,
  },
  {
    label: "流水线",
    value: "pipeline",
    href: "/admin/pipeline",
    icon: <IconZeppelin />,
  },
  {
    label: "发布记录",
    value: "release",
    href: "/admin/release",
    icon: <IconRocket />,
  },
	{
		label: "访问令牌",
		value: "token",
		href: "/admin/token",
		icon: <IconKey />
	},
  {
    label: "钉钉机器人",
    value: "dingding",
    href: "/admin/robot/dingding",
    icon: <IconBrandAlipay />,
  },
  {
    label: "企微机器人",
    value: "workweixin",
    href: "/admin/robot/workweixin",
    icon: <IconBrandWechat />,
  },
];

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebarStore();

  const handleToggle = () => {
    toggle();
  };

  return (
    <aside
      className={cn(
        `relative  hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block`,
        !isMinimized ? "w-52" : "w-[72px]",
        className
      )}
    >
      <div className="hidden p-5 pt-10 lg:block">
        <Link href={"/"} className="flex font-bold tracking-tight">
          <IconGhost2 className="mr-2 h-6 w-6" />
          <div className={cn(isMinimized ? "hidden" : "block")}>
            Release Viewer
          </div>
        </Link>
      </div>
      <IconChevronLeft
        className={cn(
          "absolute -right-3 top-10 z-50  cursor-pointer rounded-full border bg-background text-3xl text-foreground",
          isMinimized && "rotate-180"
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <Navbar items={NavItems} />
          </div>
        </div>
      </div>
    </aside>
  );
}
