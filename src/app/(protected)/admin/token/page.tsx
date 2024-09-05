"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import PageContainer from "@/components/layouts/LayoutAdmin/PageContainer";
import { breadcrumbs } from "./breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import TokenForm from "./form";
import { columns, Token } from "./columns";
import request from "@/libs/request";
import { DataTable } from "@/components/DataTable";

export default function Page() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex items-center justify-between">
          <Heading
            title={`访问令牌`}
            description="为需要访问 openapi 的第三方应用生成访问令牌。"
          />
        </div>

        <Separator />

        <TokenForm />

        <Separator />

        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          有效的访问令牌
        </h4>

        <DataTable<Token>
          columns={columns}
          withScrollArea={false}
          withToolbar={false}
          paginated={false}
          request={(searchParams) => {
            return request.get<Token[]>("/api/tokens", {
              params: searchParams,
            });
          }}
        />
      </div>
    </PageContainer>
  );
}
