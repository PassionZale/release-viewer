import { DataTableProps } from "@/components/DataTable";
import { Dict } from "./[...slug]/page";

export const filterColumns: DataTableProps<Dict>["filterColumns"] = [
  {
    accessorKey: "label",
		placeholder: "键/值"
  },
];
