"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import PageContainer from "@/components/layouts/LayoutAdmin/PageContainer";
import { notFound, useParams } from "next/navigation";
import { breadcrumbs } from "./breadcrumbs";
import { useEffect, useMemo, useState } from "react";
import request from "@/libs/request";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import RobotForm, { Robot } from "./form";
import { usePermissionDenied } from "@/libs/hooks";
import { Role } from "@/types/enum";

export default function Page() {
  const { name } = useParams<{ name: string }>();
  const { reason } = usePermissionDenied(Role.DEVELOPER);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Robot>();

  if (name !== "dingding" && name !== "workweixin") {
    return notFound();
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const title = useMemo(() => {
    switch (name) {
      case "dingding":
        return "钉钉机器人";

      case "workweixin":
        return "企微机器人";

      default:
        return "";
    }
  }, [name]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (name) {
      setLoading(true);

      request
        .get<Robot>(`/api/robots/${name}`)
        .then(({ data }) => {
          setInitialData(data);
        })
        .finally(() => setLoading(false));
    }
  }, [name]);

  return (
    <PageContainer scrollable loading={loading}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbs[name]} />

        <div className="flex items-center justify-between">
          <Heading title={title} description={reason} />
        </div>

        <Separator />

        <RobotForm name={name} initialData={initialData} />
      </div>
    </PageContainer>
  );
}
