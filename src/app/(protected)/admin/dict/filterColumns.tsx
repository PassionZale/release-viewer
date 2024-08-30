import { DataTableProps } from "@/components/DataTable";
import { Dict } from "./columns";

export const filterColumns: DataTableProps<Dict>["filterColumns"] = [
  {
    accessorKey: "label",
		placeholder: "键/值"
  },
];
