"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import PageContainer from "@/components/layouts/LayoutAdmin/PageContainer";
import request from "@/libs/request";
import { PrismaModels } from "@/types/interface";
import { useEffect, useState } from "react";
import { breadcrumbs } from "./breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import ProfleForm from "./form";

export default function Page() {
  const [initialData, setInitialData] = useState<PrismaModels["User"]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    request
      .get<PrismaModels["User"]>(`/api/users/profile`)
      .then(({ data }) => {
        setInitialData(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageContainer scrollable loading={loading}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex items-center justify-between">
          <Heading title={'个人资料'} />
        </div>

        <Separator />

        <ProfleForm initialData={initialData} />
      </div>
    </PageContainer>
  );
}
