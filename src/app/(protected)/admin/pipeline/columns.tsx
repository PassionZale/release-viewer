import { DataTableColumnHeader } from "@/components/DataTable/DataTableHeader";
import { PrismaModels } from "@/types/interface";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "@/components/DataTable/DataTableRowActions";

export type Pipeline = PrismaModels["Pipeline"] & {
  app?: PrismaModels["App"];
};

export const columns: ColumnDef<Pipeline>[] = [
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
    accessorKey: "name",
    header: "流水线名称",
  },
  {
    accessorKey: "previewWebUrl",
    header: "访问地址",
  },
  {
    accessorKey: "previewImgUrl",
    header: "图片地址",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        editPagePath={`/admin/pipeline/edit/${row.original.id}`}
        deleteApiPath={`/api/pipelines/${row.original.id}`}
      />
    ),
  },
];
