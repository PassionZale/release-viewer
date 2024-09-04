"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import PageContainer from "@/components/layouts/LayoutAdmin/PageContainer";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import { Heading } from "@/components/ui/heading";
import request from "@/libs/request";
import { PrismaModels } from "@/types/interface";
import { useRouter } from "next/navigation";
import { IconPencilPlus } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { breadcrumbs } from "./breadcrumbs";
import { columns } from "./columns";
import { filterColumns } from "./filterColumns";

export default function Page() {
  const router = useRouter();

  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex items-center justify-between">
          <Heading
            title={`用户`}
            description="用于登录管理后台操作资源，只有管理员才可操作用户。"
          />

          <Button
            size={"sm"}
            className="h-8"
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
            const { pageIndex = 0, ...rest } = searchParams;

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
