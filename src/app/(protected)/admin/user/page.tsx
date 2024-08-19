"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import PageContainer from "@/components/layouts/LayoutAdmin/PageContainer";
import { columns } from "@/components/tables/UserTable/Columns";
import { DataTable } from "@/components/ui/data-table";
import { PrismaModels } from "@/types/interface";
import { useEffect } from "react";

const breadcrumbs = [
  { title: "首页", link: "/admin" },
  { title: "用户", link: "/admin/user" },
];

async function getData(): Promise<PrismaModels["User"][]> {
  const res = await fetch("http://localhost:3000/api/users", {
    method: "GET",
    cache: "no-store",
  });

  return await res.json();
}

export default function Page() {
  useEffect(() => {
		getData().then(res => {
			console.log(res)
		})
	}, []);

  return (
    <PageContainer>
      <div className="space-y-2">
        <Breadcrumbs items={breadcrumbs} />

        <DataTable data={[]} columns={columns} />
      </div>
    </PageContainer>
  );
}
