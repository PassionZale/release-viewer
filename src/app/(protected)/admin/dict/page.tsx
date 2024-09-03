"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import PageContainer from "@/components/layouts/LayoutAdmin/PageContainer";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { breadcrumbs } from "./breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { systemColumns, platformColumns } from "./columns";
import { filterColumns } from "./filterColumns";
import request from "@/libs/request";
import { Button } from "@/components/ui/button";
import { IconPencilPlus } from "@tabler/icons-react";
import { PrismaModels } from "@/types/interface";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [tabValue, setTabValue] = useState<"system" | "platform">("system");

  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbs} />
        <div className="flex items-center justify-between">
          <Heading title={`字典`} />

          <Button
            size={"sm"}
            className="h-8"
            onClick={() => router.push(`/admin/dict/create`)}
          >
            <IconPencilPlus className="h-4 w-4 mr-2" /> 新增
          </Button>
        </div>

        <Separator />

        <Tabs
          className="w-full space-y-4"
          value={tabValue}
          onValueChange={(value) => setTabValue(value as "system" | "platform")}
        >
          <TabsList>
            <TabsTrigger value="system">系统</TabsTrigger>
            <TabsTrigger value="platform">平台</TabsTrigger>
          </TabsList>

          <TabsContent value="system">
            <DataTable<PrismaModels["System"]>
              paginated={false}
              columns={systemColumns}
              filterColumns={filterColumns}
              request={(searchParams) => {
                return request.get<PrismaModels["System"][]>("/api/systems", {
                  params: searchParams,
                });
              }}
            />
          </TabsContent>

          <TabsContent value="platform">
            <DataTable<PrismaModels["Platform"]>
              paginated={false}
              columns={platformColumns}
              filterColumns={filterColumns}
              request={(searchParams) => {
                return request.get<PrismaModels["Platform"][]>(
                  "/api/platforms",
                  {
                    params: searchParams,
                  }
                );
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
