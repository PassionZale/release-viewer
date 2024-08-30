import { PrismaModels } from "@/types/interface";
import { ColumnDef } from "@tanstack/react-table";

export type Dict = PrismaModels["System"] | PrismaModels["Platform"];

export const columns: ColumnDef<Dict>[] = [
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
];
