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
      const apps = await prisma.app.findUnique({
        where: {
          id: data,
        },
      });

      return NextResponse.json(new ApiResponse(apps));
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

    if (!paramsResult.success) return NextResponse.json(new ApiException());

    try {
      const schema = await request.json();

      const bodyResult = AppInputSchema.safeParse(schema);

      if (!bodyResult.success) {
        return NextResponse.json(new ApiException(bodyResult.error.issues));
      }

      const app = await prisma.app.update({
        where: { id: paramsResult.data },
        data: bodyResult.data,
      });

      return NextResponse.json(app);
    } catch (error) {
      return NextResponse.json(new ApiException((error as Error).message));
    }
  }
);

export const DELETE = withAuthGuard<{ id: string }>(
  async (_, { params }) => {
    const { success, data } = AppIdSchema.safeParse(params.id);

    if (!success) return NextResponse.json(new ApiException("应用不存在"));

    try {
      await prisma.app.delete({ where: { id: data } });

      return NextResponse.json(new ApiResponse());
    } catch (error) {
      return NextResponse.json(new ApiException());
    }
  },
  {
    role: Role.ADMIN,
  }
);
