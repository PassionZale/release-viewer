import { withAuthGuard } from "@/libs/guards";
import prisma from "@/libs/prisma";
import { ApiException, ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";
import { NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

export const DELETE = withAuthGuard<{ id: string }>(
  async (_, { params }) => {
    const { success, data } = z.coerce.number().safeParse(params.id);

    if (!success) return NextResponse.json(new ApiException("资源不存在"));

    try {
      const token = await prisma.token.findUnique({
        where: { id: data },
      });

      if (!token) return NextResponse.json(new ApiException("资源不存在"));

      await prisma.token.delete({ where: { id: data } });

      return NextResponse.json(new ApiResponse(token));
    } catch (error) {
      return NextResponse.json(new ApiException((error as Error).message));
    }
  },
  {
    role: Role.DEVELOPER,
  }
);
