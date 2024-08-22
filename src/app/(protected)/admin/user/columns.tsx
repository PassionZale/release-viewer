import { DataTableColumnHeader } from "@/components/DataTable/DataTableHeader";
import { Role, Status } from "@/types/enum";
import { PrismaModels } from "@/types/interface";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "@/components/DataTable/DataTableRowActions";

export const columns: ColumnDef<PrismaModels["User"]>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "username",
    header: "用户名",
  },
  {
    accessorKey: "nickname",
    header: "昵称",
  },
  {
    accessorKey: "role",
    header: "角色",
    cell: ({ row }) => {
      switch (row.original.role) {
        case Role.ADMIN:
          return "管理员";

        case Role.DEVELOPER:
          return "开发者";

        case Role.VISITOR:
          return "访客";

        default:
          return "---";
      }
    },
  },
  {
    accessorKey: "status",
    header: "状态",
    cell: ({ row }) => {
      switch (row.original.status) {
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
        editPagePath={`/admin/user/edit/${row.original.id}`}
        deleteApiPath={`/api/users/${row.original.id}`}
      />
    ),
  },
];
