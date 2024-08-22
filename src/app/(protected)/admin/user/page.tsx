"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import PageContainer from "@/components/layouts/LayoutAdmin/PageContainer";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import { Heading } from "@/components/ui/heading";
import request from "@/libs/request";
import { PrismaModels } from "@/types/interface";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { IconPencilPlus } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { DataTableColumnHeader } from "@/components/DataTable/DataTableHeader";
import { Role, Status } from "@/types/enum";

const breadcrumbs = [
  { title: "首页", link: "/admin" },
  { title: "用户", link: "/admin/user" },
];

const columns: ColumnDef<PrismaModels["User"]>[] = [
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
  },
  {
    accessorKey: "status",
    header: "状态",
  },
];

const filterColumns = [
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
        label: "正常",
        value: Status.ON,
      },
      {
        label: "禁用",
        value: Status.OFF,
      },
    ],
  },
];

export default function Page() {
  const router = useRouter();

  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex items-start justify-between">
          <Heading
            title={`用户`}
            description="用户列表（用于登录管理后台操作资源）"
          />

          <Button
            size={"sm"}
            className="h8"
            onClick={() => router.push(`/admin/user/create`)}
          >
            <IconPencilPlus className="h-4 w-4 mr-2" /> 新增
          </Button>
        </div>

        <Separator />

        <DataTable<PrismaModels["User"]>
          columns={columns}
          filterColumns={filterColumns}
          request={(searchParams) => {
            const { pageIndex, ...rest } = searchParams;

            return request.get<PrismaModels["User"][]>("/api/users", {
              params: {
                page: pageIndex + 1,
                ...rest,
              },
            });
          }}
        />
      </div>
    </PageContainer>
  );
}
