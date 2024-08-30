"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import PageContainer from "@/components/layouts/LayoutAdmin/PageContainer";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { breadcrumbs } from "./breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { columns, Dict } from "./columns";
import { filterColumns } from "./filterColumns";
import request from "@/libs/request";

export default function Page() {
  const [tabValue, setTabValue] = useState<"system" | "platform">("system");

  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbs} />
        <div className="flex items-center justify-between">
          <Heading title={`字典`} />
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
            <DataTable<Dict>
              paginated={false}
              columns={columns}
              filterColumns={filterColumns}
              request={(searchParams) => {
                return request.get<Dict[]>("/api/systems", {
                  params: searchParams,
                });
              }}
            />
          </TabsContent>

          <TabsContent value="platform">
            <DataTable<Dict>
              paginated={false}
              columns={columns}
              filterColumns={filterColumns}
              request={(searchParams) => {
                return request.get<Dict[]>("/api/platforms", {
                  params: searchParams,
                });
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
