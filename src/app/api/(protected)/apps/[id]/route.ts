import { NextResponse } from "next/server";
import { withAuthGuard } from "@/libs/guards";
import prisma from "@/libs/prisma";
import { ApiException, ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";
import { AppIdSchema, AppInputSchema } from "../schemas";

export const dynamic = "force-dynamic";

export const GET = withAuthGuard<{ id: string }>(
  async (_, { params }) => {
    const { success, data } = AppIdSchema.safeParse(params.id);

    if (success) {
      const app = await prisma.app.findUnique({
        where: {
          id: data,
        },
      });

      return NextResponse.json(new ApiResponse(app));
    }

    return NextResponse.json(new ApiResponse());
  },
  {
    role: Role.VISITOR,
  }
);

export const PUT = withAuthGuard<{ id: string }>(
  async (request, { params }) => {
    const paramsResult = AppIdSchema.safeParse(params.id);

    if (!paramsResult.success)
      return NextResponse.json(new ApiException("资源不存在"));

    try {
      const schema = await request.json();

      const bodyResult = AppInputSchema.partial().safeParse(schema);

      if (!bodyResult.success) {
        return NextResponse.json(new ApiException(bodyResult.error.issues));
      }

      const app = await prisma.app.findUnique({
        where: { id: paramsResult.data },
      });

      if (!app) return NextResponse.json(new ApiException("资源不存在"));

      const nextApp = await prisma.app.update({
        where: { id: paramsResult.data },
        data: {
          ...app,
          ...bodyResult.data,
        },
      });

      return NextResponse.json(new ApiResponse(nextApp));
    } catch (error) {
      return NextResponse.json(new ApiException((error as Error).message));
    }
  },
  {
    role: Role.ADMIN,
  }
);

export const DELETE = withAuthGuard<{ id: string }>(
  async (_, { params }) => {
    const { success, data } = AppIdSchema.safeParse(params.id);

    if (!success) return NextResponse.json(new ApiException("资源不存在"));

    try {
      const app = await prisma.app.findUnique({
        where: { id: data },
      });

      if (!app) return NextResponse.json(new ApiException("资源不存在"));

      await prisma.app.delete({ where: { id: data } });

      return NextResponse.json(new ApiResponse(app));
    } catch (error) {
      return NextResponse.json(new ApiException());
    }
  },
  {
    role: Role.ADMIN,
  }
);
