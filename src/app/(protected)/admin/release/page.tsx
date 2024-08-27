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
import { Release, columns } from "./columns";
import { useEffect, useMemo, useState } from "react";
import { PrismaModels } from "@/types/interface";
import { FilterColumn } from "@/components/DataTable/DataTableToolbar";

export default function Page() {
  const router = useRouter();

  const [apps, setApps] = useState<FilterColumn["options"]>([]);

  const filterColumns: DataTableProps<Release>["filterColumns"] = useMemo(
    () => [
      {
        accessorKey: "app",
        placeholder: "应用",
        options: apps,
      },
    ],
    [apps]
  );

  useEffect(() => {
    request
      .get<PrismaModels["App"][]>("/api/apps", {
        params: {
          page: 1,
          pageSize: 100, // 取100个应用...应该够用了吧
        },
      })
      .then(({ data }) => {
        setApps(data.map((item) => ({ label: item.name, value: item.id })));
      });
  }, []);

  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex items-center justify-between">
          <Heading title={`发布记录`} description="发布记录列表" />

          <Button
            size={"sm"}
            className="h8"
            onClick={() => router.push(`/admin/release/create`)}
          >
            <IconPencilPlus className="h-4 w-4 mr-2" /> 新增
          </Button>
        </div>

        <Separator />

        <DataTable<Release>
          columns={columns}
          filterColumns={filterColumns}
          request={(searchParams) => {
            const { pageIndex, ...rest } = searchParams;

            return request.get<Release[]>("/api/releases", {
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
