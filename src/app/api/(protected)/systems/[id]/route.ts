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
      const system = await prisma.system.findUnique({
        where: {
          id: data,
        },
      });

      return NextResponse.json(new ApiResponse(system));
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

    if (!paramsResult.success)
      return NextResponse.json(new ApiException("资源不存在"));

    try {
      const schema = await request.json();

      const bodyResult = SystemInputSchema.partial().safeParse(schema);

      if (!bodyResult.success) {
        return NextResponse.json(new ApiException(bodyResult.error.issues));
      }

      const system = await prisma.system.findUnique({
        where: { id: paramsResult.data },
      });

      if (!system) {
        return NextResponse.json(new ApiException("资源不存在"));
      }

      const exist = await prisma.system.findFirst({
        where: {
          OR: [
            {
              label: { equals: bodyResult.data.label },
            },
            {
              value: { equals: bodyResult.data.value },
            },
          ],
          AND: [{ id: { not: paramsResult.data } }],
        },
      });

      if (exist) {
        return NextResponse.json(new ApiException("系统名称或编码不能重复"));
      }

      const nextSystem = await prisma.system.update({
        where: { id: paramsResult.data },
        data: {
          ...system,
          ...bodyResult.data,
        },
      });

      return NextResponse.json(new ApiResponse(nextSystem));
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
    const { success, data } = SystemIdSchema.safeParse(params.id);

    if (!success) return NextResponse.json(new ApiException("资源不存在"));

    try {
      const system = await prisma.system.findUnique({
        where: { id: data },
      });

      if (!system) return NextResponse.json(new ApiException("资源不存在"));

      await prisma.system.delete({ where: { id: data } });

      return NextResponse.json(new ApiResponse(system));
    } catch (error) {
      return NextResponse.json(new ApiException((error as Error).message));
    }
  },
  {
    role: Role.DEVELOPER,
  }
);
