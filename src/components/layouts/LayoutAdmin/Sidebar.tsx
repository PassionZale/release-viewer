"use client";
import React from "react";
import { cn } from "@/libs/utils";
import {
  IconApps,
  IconChevronLeft,
  IconHome,
  IconRobot,
  IconUser,
} from "@tabler/icons-react";
import useSidebarStore from "@/stores/sidebar";
import Link from "next/link";
import { Navbar } from "./Navbar";

type SidebarProps = {
  className?: string;
};

const NavItems = [
  {
    label: "首页",
    value: "admin",
    href: "/admin",
    icon: <IconHome />,
  },
  {
    label: "用户",
    value: "user",
    href: "/admin/user",
    icon: <IconUser />,
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
    icon: <IconApps />,
  },
  {
    label: "发布记录",
    value: "release",
    href: "/admin/release",
    icon: <IconApps />,
  },
  {
    label: "钉钉机器人",
    value: "dingding",
    href: "/admin/robot/dingding",
    icon: <IconRobot />,
  },
  {
    label: "企微机器人",
    value: "workweixin",
    href: "/admin/robot/workweixin",
    icon: <IconRobot />,
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
        !isMinimized ? "w-72" : "w-[72px]",
        className
      )}
    >
      <div className="hidden p-5 pt-10 lg:block">
        <Link
          href={"https://github.com/PassionZale/release-viewer"}
          target="_blank"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
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
