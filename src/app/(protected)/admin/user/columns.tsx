import { DataTableColumnHeader } from "@/components/DataTable/DataTableHeader";
import { Role, Status } from "@/types/enum";
import { PrismaModels } from "@/types/interface";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "@/components/DataTable/DataTableRowActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    accessorKey: "nickname",
    header: "昵称",
  },
  {
    accessorKey: "avatar",
    header: "头像",
    cell: ({ row }) => (
      <>
        {row.original.avatar && (
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={row.original.avatar}
              alt={row.original.nickname}
            />
            <AvatarFallback>{row.original.nickname}</AvatarFallback>
          </Avatar>
        )}
      </>
    ),
  },
  {
    accessorKey: "username",
    header: "用户名",
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
