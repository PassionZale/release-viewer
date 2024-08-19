"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/libs/utils";
import {
  cloneElement,
  Dispatch,
  FunctionComponentElement,
  SetStateAction,
} from "react";
import useSidebarStore from "@/stores/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconProps } from "@tabler/icons-react";

interface NavItem {
  label: string;
  value: string;
  href: string;
  icon: FunctionComponentElement<IconProps>;
}

export interface NavbarProps {
  items?: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function Navbar({ items, setOpen, isMobileNav = false }: NavbarProps) {
  const path = usePathname();
  const isMinimized = useSidebarStore((state) => state.isMinimized);

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      <TooltipProvider>
        {items.map((item) => {
          return (
            <Tooltip key={item.value}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    path === item.href ? "bg-accent" : "transparent"
                  )}
                  onClick={() => {
                    if (setOpen) setOpen(false);
                  }}
                >
                  {cloneElement(item.icon, {
                    className: "ml-3 size-5 flex-none",
                  })}

                  {isMobileNav || (!isMinimized && !isMobileNav) ? (
                    <span className="mr-2 truncate">{item.label}</span>
                  ) : (
                    ""
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent
                align="center"
                side="right"
                sideOffset={8}
                className={!isMinimized ? "hidden" : "inline-block"}
              >
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </nav>
  );
}
