"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface DataTableRowActionsProps {
  editHref?: string;
  deleteRequest?: () => void;
}

export function DataTableRowActions({
  editHref,
  deleteRequest,
}: DataTableRowActionsProps) {
  const router = useRouter();

  const onEdit = () => {
    editHref && router.push(editHref);
  };

  const onDelete = () => {};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">打开菜单</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onEdit}>
          <IconEdit className="mr-2 h-4 w-4" />
          <span>编辑</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete}>
          <IconTrash className="mr-2 h-4 w-4" />
          <span>删除</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
