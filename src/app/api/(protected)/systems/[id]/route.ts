import { NextResponse } from "next/server";
import { withAuthGuard } from "@/libs/guards";
import prisma from "@/libs/prisma";
import { ApiException, ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";
import { SystemIdSchema, SystemInputSchema } from "../schemas";

export const dynamic = "force-dynamic";

export const GET = withAuthGuard<{ id: string }>(
  async (_, { params }) => {
    const { success, data } = SystemIdSchema.safeParse(params.id);

    if (success) {
      const apps = await prisma.system.findUnique({
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
    const paramsResult = SystemIdSchema.safeParse(params.id);

    if (!paramsResult.success) return NextResponse.json(new ApiException());

    try {
      const schema = await request.json();

      const bodyResult = SystemInputSchema.safeParse(schema);

      if (!bodyResult.success) {
        return NextResponse.json(new ApiException(bodyResult.error.issues));
      }

      const system = await prisma.system.update({
        where: { id: paramsResult.data },
        data: bodyResult.data,
      });

      return NextResponse.json(system);
    } catch (error) {
      return NextResponse.json(new ApiException((error as Error).message));
    }
  }
);

export const DELETE = withAuthGuard<{ id: string }>(
  async (_, { params }) => {
    const { success, data } = SystemIdSchema.safeParse(params.id);

    if (!success) return NextResponse.json(new ApiException("资源不存在"));

    try {
      await prisma.system.delete({ where: { id: data } });

      return NextResponse.json(new ApiResponse());
    } catch (error) {
      return NextResponse.json(new ApiException());
    }
  },
  {
    role: Role.ADMIN,
  }
);
