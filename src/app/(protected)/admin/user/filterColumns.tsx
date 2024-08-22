import { DataTableProps } from "@/components/DataTable";
import { Role, Status } from "@/types/enum";
import { PrismaModels } from "@/types/interface";

export const filterColumns: DataTableProps<
  PrismaModels["User"]
>["filterColumns"] = [
  {
    accessorKey: "username",
    placeholder: "用户名",
  },
  {
    accessorKey: "role",
    placeholder: "角色",
    options: [
      {
        label: "管理员",
        value: Role.ADMIN,
      },
      {
        label: "开发者",
        value: Role.DEVELOPER,
      },
      {
        label: "访客",
        value: Role.VISITOR,
      },
    ],
  },
  {
    accessorKey: "status",
    placeholder: "状态",
    options: [
      {
        label: "启用",
        value: Status.ON,
      },
      {
        label: "禁用",
        value: Status.OFF,
      },
    ],
  },
];
