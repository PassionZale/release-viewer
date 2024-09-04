"use client";

import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PrismaModels } from "@/types/interface";
import { Actions, Role } from "@/types/enum";
import request from "@/libs/request";
import PageContainer from "@/components/layouts/LayoutAdmin/PageContainer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { breadcrumbs } from "../breadcrumbs";
import DictForm from "./form";
import { usePermissionDenied } from "@/libs/hooks";

export type Dict = PrismaModels["System"] | PrismaModels["Platform"];
export type DictType = "systems" | "platforms";
export type DetailPageSlug =
  | [Actions.CREATE]
  | [Actions.EDIT, DictType, string];

export default function Page() {
  const { slug } = useParams<{ slug: DetailPageSlug }>();
  const { reason } = usePermissionDenied(Role.DEVELOPER);
  const [initialData, setInitialData] = useState<Dict>();
  const [loading, setLoading] = useState(true);

  const [action, dictType, id] = slug;

  if (action !== Actions.CREATE && action !== Actions.EDIT) {
    notFound();
  }

  if (dictType && dictType !== "systems" && dictType !== "platforms") {
    notFound();
  }

  const title = action === Actions.CREATE ? "新增字典" : "编辑字典";

  useEffect(() => {
    if (id) {
      setLoading(true);

      request
        .get<Dict>(`/api/${dictType}/${id}`)
        .then(({ data }) => setInitialData(data))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, dictType]);

  return (
    <PageContainer scrollable loading={loading}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex items-center justify-between">
          <Heading title={title} description={reason} />
        </div>

        <Separator />

        <DictForm initialData={initialData} dictType={dictType} />
      </div>
    </PageContainer>
  );
}
