import { NextResponse } from "next/server";
import { withAuthGuard } from "@/libs/guards";
import prisma from "@/libs/prisma";
import { ApiException, ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";
import { UserIdSchema, UserInputSchema } from "../schemas";

export const dynamic = "force-dynamic";

export const GET = withAuthGuard<{ id: string }>(
  async (_, { params }) => {
    const { success, data } = UserIdSchema.safeParse(params.id);

    if (success) {
      const user = await prisma.user.findUnique({
        where: {
          id: data,
        },
        omit: {
          hashedPassword: true,
        },
      });

      return NextResponse.json(new ApiResponse(user));
    }

    return NextResponse.json(new ApiResponse());
  },
  {
    role: Role.ADMIN,
  }
);

export const PUT = withAuthGuard<{ id: string }>(
  async (request, { params }) => {
    const paramsResult = UserIdSchema.safeParse(params.id);

    if (!paramsResult.success)
      return NextResponse.json(new ApiException("资源不存在"));

    try {
      const schema = await request.json();

      const bodyResult = UserInputSchema.omit({
        username: true,
        password: true,
      }).safeParse(schema);

      if (!bodyResult.success) {
        return NextResponse.json(new ApiException(bodyResult.error.issues));
      }

      const user = await prisma.user.findUnique({
        where: { id: paramsResult.data },
        omit: {
          username: true,
          hashedPassword: true,
        },
      });

      if (!user) return NextResponse.json(new ApiException("资源不存在"));

      const nextUser = await prisma.user.update({
        where: { id: paramsResult.data },
        data: {
          ...user,
          ...bodyResult.data,
        },
        omit: {
          hashedPassword: true,
        },
      });

      return NextResponse.json(new ApiResponse(nextUser));
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
    const { success, data } = UserIdSchema.safeParse(params.id);

    if (!success) return NextResponse.json(new ApiException("资源不存在"));

    try {
      const user = await prisma.user.findUnique({
        where: { id: data },
        omit: {
          hashedPassword: true,
        },
      });

      if (!user) return NextResponse.json(new ApiException("资源不存在"));

      await prisma.user.delete({ where: { id: data } });

      return NextResponse.json(new ApiResponse(user));
    } catch (error) {
      return NextResponse.json(new ApiException());
    }
  },
  {
    role: Role.ADMIN,
  }
);
