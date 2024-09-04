"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import PageContainer from "@/components/layouts/LayoutAdmin/PageContainer";
import { breadcrumbs } from "./breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import ReleaseForm from "./form";
import { usePermissionDenied } from "@/libs/hooks";
import { Role } from "@/types/enum";

export default function Page() {
  const { reason } = usePermissionDenied(Role.DEVELOPER);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex items-center justify-between">
          <Heading title={"发布应用"} description={reason} />
        </div>

        <Separator />

        <ReleaseForm />
      </div>
    </PageContainer>
  );
}
