import { withAuthGuard } from "@/libs/guards";
import prisma from "@/libs/prisma";
import { ApiException, ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";
import { NextResponse } from "next/server";
import { PlatformInputSchema } from "./schemas";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export const GET = withAuthGuard(
  async (request) => {
    const searchParams = request.nextUrl.searchParams;

    const where: Prisma.PlatformWhereInput = {};

    const keyword = searchParams.get("label");

    if (keyword) {
      where.OR = [
        {
          label: { contains: keyword },
        },
        {
          value: { contains: keyword },
        },
      ];
    }

    const platforms = await prisma.platform.findMany();

    return NextResponse.json(new ApiResponse(platforms));
  },
  {
    role: Role.VISITOR,
  }
);

export const POST = withAuthGuard(
  async (request) => {
    const schema = await request.json();

    const { success, error, data } = PlatformInputSchema.safeParse(schema);

    if (success) {
      const exist = await prisma.platform.findFirst({
        where: {
          OR: [
            {
              label: { equals: data.label },
            },
            {
              value: { equals: data.value },
            },
          ],
        },
      });

      if (exist) {
        return NextResponse.json(new ApiException("平台名称或编码不能重复"));
      }

      const platform = await prisma.platform.create({ data });

      return NextResponse.json(new ApiResponse(platform));
    }

    const { issues } = error;

    return NextResponse.json(new ApiException(issues));
  },
  {
    role: Role.ADMIN,
  }
);
