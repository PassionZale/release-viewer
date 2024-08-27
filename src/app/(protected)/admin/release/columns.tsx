import { DataTableColumnHeader } from "@/components/DataTable/DataTableHeader";
import { PrismaModels } from "@/types/interface";
import { ColumnDef } from "@tanstack/react-table";

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
    header: "流水线名称",
    cell: ({ row }) => row.original.pipeline?.name,
  },
  {
    accessorKey: "version",
    header: "版本号",
    cell: ({ row }) => {
      const buildId = row.original.buildId ? `(${row.original.buildId})` : null;

      return `${row.original.version}${buildId}`;
    },
  },
  {
    accessorKey: "user",
    header: "创建人",
    cell: ({ row }) => row.original.user?.nickname,
  },
  {
    accessorKey: "createdAt",
    header: "创建时间",
    cell: ({ row }) => row.original.createdAt,
  },
];
