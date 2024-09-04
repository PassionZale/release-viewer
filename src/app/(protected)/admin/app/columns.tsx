import { DataTableColumnHeader } from "@/components/DataTable/DataTableHeader";
import { PrismaModels } from "@/types/interface";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "@/components/DataTable/DataTableRowActions";
import { Status } from "@/types/enum";

export type App = PrismaModels["App"] & {
  system?: PrismaModels["System"];
  platform?: PrismaModels["Platform"];
};

export const columns: ColumnDef<App>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "应用名称",
  },
  {
    accessorKey: "system",
    header: "所属系统",
    cell: ({ row }) => row.original.system?.label,
  },
  {
    accessorKey: "platform",
    header: "所属平台",
    cell: ({ row }) => row.original.platform?.label,
  },
  {
    accessorKey: "desc",
    header: "应用描述",
		cell: ({ row }) => (
      <div className="line-clamp-1 max-w-[200px]">{row.original.desc}</div>
    ),
  },
  {
    accessorKey: "subscribers",
    header: "订阅者",
		cell: ({ row }) => (
      <div className="line-clamp-1 max-w-[200px]">{row.original.subscribers}</div>
    ),
  },
  {
    accessorKey: "robotDingDingStatus",
    header: "钉钉机器人",
    cell: ({ row }) => {
      switch (row.original.robotDingDingStatus) {
        case Status.OFF:
          return "禁用";

        case Status.ON:
          return "启用";

        default:
          return "---";
      }
    },
  },
  {
    accessorKey: "robotWorkWeixinStatus",
    header: "企微机器人",
    cell: ({ row }) => {
      switch (row.original.robotDingDingStatus) {
        case Status.OFF:
          return "禁用";

        case Status.ON:
          return "启用";

        default:
          return "---";
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        editPagePath={`/admin/app/edit/${row.original.id}`}
        deleteApiPath={`/api/apps/${row.original.id}`}
      />
    ),
  },
];
