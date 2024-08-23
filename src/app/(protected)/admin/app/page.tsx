"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import PageContainer from "@/components/layouts/LayoutAdmin/PageContainer";
import { Button } from "@/components/ui/button";
import { DataTable, DataTableProps } from "@/components/DataTable";
import { Heading } from "@/components/ui/heading";
import request from "@/libs/request";
import { useRouter } from "next/navigation";
import { IconPencilPlus } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { breadcrumbs } from "./breadcrumbs";
import { App, columns } from "./columns";
import useDicStore from "@/stores/dict";
import { useMemo } from "react";

export default function Page() {
  const router = useRouter();

  const { platforms, systems } = useDicStore();

  const filterColumns: DataTableProps<App>["filterColumns"] = useMemo(
    () => [
      {
        accessorKey: "name",
        placeholder: "应用名称",
      },
      {
        accessorKey: "system",
        placeholder: "系统",
        options: systems,
      },
      {
        accessorKey: "platform",
        placeholder: "平台",
        options: platforms,
      },
    ],
    [platforms, systems]
  );

  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex items-center justify-between">
          <Heading title={`应用`} description="应用列表" />

          <Button
            size={"sm"}
            className="h8"
            onClick={() => router.push(`/admin/app/create`)}
          >
            <IconPencilPlus className="h-4 w-4 mr-2" /> 新增
          </Button>
        </div>

        <Separator />

        <DataTable<App>
          columns={columns}
          filterColumns={filterColumns}
          request={(searchParams) => {
            const { pageIndex, ...rest } = searchParams;

            return request.get<App[]>("/api/apps", {
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
