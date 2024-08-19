import { withAuthGuard } from "@/libs/guards";
import prisma from "@/libs/prisma";
import { ApiException, ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";
import { NextResponse } from "next/server";
import { ReleaseInputSchema } from "./schemas";
import paginate from "@/libs/paginate";

export const dynamic = "force-dynamic";

export const GET = withAuthGuard(
  async (request) => {
    const searchParams = request.nextUrl.searchParams;

    const releases = await paginate(prisma.pipeline, { searchParams });

    return NextResponse.json(new ApiResponse(releases));
  },
  {
    role: Role.VISITOR,
  }
);

export const POST = withAuthGuard(
  async (request) => {
    const schema = await request.json();

    const { success, error, data } = ReleaseInputSchema.safeParse(schema);

    if (success) {
      const app = await prisma.app.findUnique({
        where: { id: data.appId },
        include: { pipelines: true },
      });

      if (!app) {
        return NextResponse.json(new ApiException("所属应用不存在"));
      }

      const pipeline = await prisma.pipeline.findUnique({
        where: { id: data.pipelineId },
      });

      if (!pipeline) {
        return NextResponse.json(new ApiException("所属流水线不存在"));
      }

      const isPipelineExsitInApp = app.pipelines.find(
        ({ id }) => id === pipeline.id
      );

      if (!isPipelineExsitInApp) {
        return NextResponse.json(new ApiException("流水线不属于所属应用"));
      }

      const release = await prisma.release.create({ data });

      return NextResponse.json(new ApiResponse(release));
    }

    const { issues } = error;

    return NextResponse.json(new ApiException(issues));
  },
  {
    role: Role.ADMIN,
  }
);
