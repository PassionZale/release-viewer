"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useContext } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { ConfirmModal } from "../ConfirmModal";
import request from "@/libs/request";
import DataTableContext from "./context";
import { ApiException } from "@/libs/utils";

interface DataTableRowActionsProps {
  editPagePath?: string;
  deleteApiPath?: string;
}

export function DataTableRowActions({
  editPagePath,
  deleteApiPath,
}: DataTableRowActionsProps) {
  const router = useRouter();
  const { toast } = useToast();

  const { loadData, getSearchParams } = useContext(DataTableContext);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onEdit = () => {
    editPagePath && router.push(editPagePath);
  };

  const onConfirm = async () => {
    try {
      setLoading(true);

      await request.delete(deleteApiPath!);

      setLoading(false);
      setOpen(false);

      loadData?.(getSearchParams?.());
    } catch (error) {
      setLoading(false);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: (error as ApiException).message,
      });

    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />

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
          <DropdownMenuItem onClick={() => deleteApiPath && setOpen(true)}>
            <IconTrash className="mr-2 h-4 w-4" />
            <span>删除</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
