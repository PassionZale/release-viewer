"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import PageContainer from "@/components/layouts/LayoutAdmin/PageContainer";
import request from "@/libs/request";
import { Actions, Role } from "@/types/enum";
import { DetailPageSlug } from "@/types/interface";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { breadcrumbs } from "./breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import AppForm from "./form";
import { App } from "../columns";
import { usePermissionDenied } from "@/libs/hooks";

export default function Page() {
  const { slug } = useParams<{ slug: DetailPageSlug }>();

  const [initialData, setInitialData] = useState<App>();
  const [loading, setLoading] = useState(true);
  const { denied, reason } = usePermissionDenied(Role.DEVELOPER);

  const [action, id] = slug;

  if (action !== Actions.CREATE && action !== Actions.EDIT) {
    notFound();
  }

  const title = action === Actions.CREATE ? "新增应用" : "编辑应用";

  useEffect(() => {
    if (id) {
      setLoading(true);
      request
        .get<App>(`/api/apps/${id}`)
        .then(({ data }) => {
          setInitialData(data);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  return (
    <PageContainer scrollable loading={loading}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex items-center justify-between">
          <Heading title={title} description={reason} />
        </div>

        <Separator />

        <AppForm initialData={initialData} />
      </div>
    </PageContainer>
  );
}
