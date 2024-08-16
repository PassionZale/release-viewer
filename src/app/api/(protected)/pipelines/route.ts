import { withAuthGuard } from "@/libs/guards";
import prisma from "@/libs/prisma";
import { ApiException, ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";
import { NextResponse } from "next/server";
import { PipelineInputSchema } from "./schemas";

export const dynamic = "force-dynamic";

export const GET = withAuthGuard(
  async () => {
    const pipelines = await prisma.pipeline.findMany();

    return NextResponse.json(new ApiResponse(pipelines));
  },
  {
    role: Role.VISITOR,
  }
);

export const POST = withAuthGuard(
  async (request) => {
    const schema = await request.json();

    const { success, error, data } = PipelineInputSchema.safeParse(schema);

    if (success) {
      const app = await prisma.app.findUnique({ where: { id: data.appId } });

      if (!app) return NextResponse.json(new ApiException("所属应用不存在"));

      const pipeline = await prisma.pipeline.create({ data });

      return NextResponse.json(new ApiResponse(pipeline));
    }

    const { issues } = error;

    return NextResponse.json(new ApiException(issues));
  },
  {
    role: Role.ADMIN,
  }
);
