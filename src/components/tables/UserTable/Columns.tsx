"use client";

import { PrismaModels } from "@/types/interface";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<PrismaModels["User"]>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "nickname",
    header: "昵称",
  },
  {
    accessorKey: "username",
    header: "用户名",
  },
  {
    accessorKey: "role",
    header: "角色",
  },
  {
    accessorKey: "status",
    header: "状态",
  },
];
