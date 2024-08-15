import { NextResponse } from "next/server";
import { withAuthGuard } from "@/libs/guards";
import prisma from "@/libs/prisma";
import { ApiException, ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";
import { PlatformIdSchema, PlatformInputSchema } from "../schemas";

export const dynamic = "force-dynamic";

export const GET = withAuthGuard<{ id: string }>(
  async (_, { params }) => {
    const { success, data } = PlatformIdSchema.safeParse(params.id);

    if (success) {
      const platform = await prisma.platform.findUnique({
        where: {
          id: data,
        },
      });

      return NextResponse.json(new ApiResponse(platform));
    }

    return NextResponse.json(new ApiResponse());
  },
  {
    role: Role.VISITOR,
  }
);

export const PUT = withAuthGuard<{ id: string }>(
  async (request, { params }) => {
    const paramsResult = PlatformIdSchema.safeParse(params.id);

    if (!paramsResult.success)
      return NextResponse.json(new ApiException("资源不存在"));

    try {
      const schema = await request.json();

      const bodyResult = PlatformInputSchema.partial().safeParse(schema);

      if (!bodyResult.success) {
        return NextResponse.json(new ApiException(bodyResult.error.issues));
      }

      const platform = await prisma.platform.findUnique({
        where: { id: paramsResult.data },
      });

      if (!platform) {
        return NextResponse.json(new ApiException("资源不存在"));
      }

      const exist = await prisma.platform.findFirst({
        where: {
          OR: [
            {
              label: { equals: bodyResult.data.label },
            },
            {
              value: { equals: bodyResult.data.value },
            },
          ],
        },
      });

      if (exist) {
        return NextResponse.json(new ApiException("平台名称或编码不能重复"));
      }

      const nextPlatform = await prisma.platform.update({
        where: { id: paramsResult.data },
        data: {
          ...platform,
          ...bodyResult.data,
        },
      });

      return NextResponse.json(nextPlatform);
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
    const { success, data } = PlatformIdSchema.safeParse(params.id);

    if (!success) return NextResponse.json(new ApiException("资源不存在"));

    try {
      const platform = await prisma.platform.findUnique({
        where: { id: data },
      });

      if (!platform) return NextResponse.json(new ApiException("资源不存在"));

      await prisma.platform.delete({ where: { id: data } });

      return NextResponse.json(new ApiResponse(platform));
    } catch (error) {
      return NextResponse.json(new ApiException((error as Error).message));
    }
  },
  {
    role: Role.ADMIN,
  }
);
