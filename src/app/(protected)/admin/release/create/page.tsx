"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import PageContainer from "@/components/layouts/LayoutAdmin/PageContainer";
import { breadcrumbs } from "./breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import ReleaseForm from "./form";

export default function Page() {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex items-center justify-between">
          <Heading title={"发布应用"} />
        </div>

        <Separator />

        <ReleaseForm />
      </div>
    </PageContainer>
  );
}
