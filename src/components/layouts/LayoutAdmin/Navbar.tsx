"use client";

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
import ActiveLink from "@/components/ActiveLink";
import { Role } from "@/types/enum";

interface NavItem {
  label: string;
  value: string;
  href: string;
  icon: FunctionComponentElement<IconProps>;
  role?: Role;
}

export interface NavbarProps {
  items?: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function Navbar({ items, setOpen, isMobileNav = false }: NavbarProps) {
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
                <ActiveLink
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transparent"
                  )}
                  activeClassName="bg-accent"
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
                </ActiveLink>
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
