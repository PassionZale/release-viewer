import { DataTableColumnHeader } from "@/components/DataTable/DataTableHeader";
import { PrismaModels } from "@/types/interface";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "@/libs/dayjs";
import Link from "next/link";

export type Release = PrismaModels["Release"] & {
  app?: PrismaModels["App"];
  pipeline?: PrismaModels["Pipeline"];
  user?: PrismaModels["User"];
};

export const columns: ColumnDef<Release>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "app",
    header: "所属应用",
    cell: ({ row }) => row.original.app?.name,
  },
  {
    accessorKey: "pipeline",
    header: "所属流水线",
    cell: ({ row }) => row.original.pipeline?.name,
  },
  {
    accessorKey: "version",
    header: "版本号",
    cell: ({ row }) => {
      const buildId = row.original.buildId ? `(${row.original.buildId})` : '';

      return `${row.original.version}${buildId}`;
    },
  },
  {
    accessorKey: "desc",
    header: "更新说明",
    cell: ({ row }) => (
      <div className="line-clamp-1 max-w-[200px]">{row.original.desc}</div>
    ),
  },
  {
    accessorKey: "attachment",
    header: "附件",
    cell: ({ row }) =>
      row.original.attachment && (
        <Link href={row.original.attachment} download>
          下载附件
        </Link>
      ),
  },
  {
    accessorKey: "user",
    header: "创建人",
    cell: ({ row }) => row.original.user?.nickname,
  },
  {
    accessorKey: "createdAt",
    header: "发布时间",
    cell: ({ row }) => dayjs(row.original.createdAt).fromNow(),
  },
];
