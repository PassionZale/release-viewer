import { DataTableRowActions } from "@/components/DataTable/DataTableRowActions";
import { PrismaModels } from "@/types/interface";
import { ColumnDef } from "@tanstack/react-table";

export const systemColumns: ColumnDef<PrismaModels["System"]>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "label",
    header: "键",
  },
  {
    accessorKey: "value",
    header: "值",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        editPagePath={`/admin/dict/edit/system/${row.original.id}`}
        deleteApiPath={`/api/systems/${row.original.id}`}
      />
    ),
  },
];

export const platformColumns: ColumnDef<PrismaModels["Platform"]>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "label",
    header: "键",
  },
  {
    accessorKey: "value",
    header: "值",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        editPagePath={`/admin/dict/edit/platform/${row.original.id}`}
        deleteApiPath={`/api/platforms/${row.original.id}`}
      />
    ),
  },
];
