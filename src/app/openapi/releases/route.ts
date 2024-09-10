import { withTokenGuard } from "@/libs/guards";
import prisma from "@/libs/prisma";
import { ApiException, ApiResponse } from "@/libs/utils";
import { NextResponse } from "next/server";
import { ReleaseInputSchema } from "./schemas";
import {
  triggerDingdingRobotPush,
  triggerWorkweixinRobotPush,
} from "@/libs/robots";

export const dynamic = "force-dynamic";

export const POST = withTokenGuard(async (request) => {
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

    const release = await prisma.release.create({
      data: { ...data },
      include: {
        user: {
          select: {
            nickname: true,
          },
        },
      },
    });

    triggerDingdingRobotPush(app, pipeline, release);
    triggerWorkweixinRobotPush(app, pipeline, release);

    return NextResponse.json(new ApiResponse(release));
  }

  const { issues } = error;

  return NextResponse.json(new ApiException(issues));
});
