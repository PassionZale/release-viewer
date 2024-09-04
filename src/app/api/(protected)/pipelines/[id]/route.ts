import { NextResponse } from "next/server";
import { withAuthGuard } from "@/libs/guards";
import prisma from "@/libs/prisma";
import { ApiException, ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";
import { PipelineIdSchema, PipelineInputSchema } from "../schemas";

export const dynamic = "force-dynamic";

export const GET = withAuthGuard<{ id: string }>(
  async (_, { params }) => {
    const { success, data } = PipelineIdSchema.safeParse(params.id);

    if (success) {
      const pipeline = await prisma.pipeline.findUnique({
        where: {
          id: data,
        },
      });

      return NextResponse.json(new ApiResponse(pipeline));
    }

    return NextResponse.json(new ApiResponse());
  },
  {
    role: Role.VISITOR,
  }
);

export const PUT = withAuthGuard<{ id: string }>(
  async (request, { params }) => {
    const paramsResult = PipelineIdSchema.safeParse(params.id);

    if (!paramsResult.success)
      return NextResponse.json(new ApiException("资源不存在"));

    try {
      const schema = await request.json();

      const bodyResult = PipelineInputSchema.partial().safeParse(schema);

      if (!bodyResult.success) {
        return NextResponse.json(new ApiException(bodyResult.error.issues));
      }

      const pipeline = await prisma.pipeline.findUnique({
        where: { id: paramsResult.data },
      });

      if (!pipeline) return NextResponse.json(new ApiException("资源不存在"));

      const nextPipeline = await prisma.pipeline.update({
        where: { id: paramsResult.data },
        data: {
          ...pipeline,
          ...bodyResult.data,
        },
      });

      return NextResponse.json(new ApiResponse(nextPipeline));
    } catch (error) {
      return NextResponse.json(new ApiException((error as Error).message));
    }
  },
  {
    role: Role.DEVELOPER,
  }
);

export const DELETE = withAuthGuard<{ id: string }>(
  async (_, { params }) => {
    const { success, data } = PipelineIdSchema.safeParse(params.id);

    if (!success) return NextResponse.json(new ApiException("资源不存在"));

    try {
      const pipeline = await prisma.pipeline.findUnique({
        where: { id: data },
      });

      if (!pipeline) return NextResponse.json(new ApiException("资源不存在"));

      await prisma.pipeline.delete({ where: { id: data } });

      return NextResponse.json(new ApiResponse(pipeline));
    } catch (error) {
      return NextResponse.json(new ApiException());
    }
  },
  {
    role: Role.DEVELOPER,
  }
);
