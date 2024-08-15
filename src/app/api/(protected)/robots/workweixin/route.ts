import { withAuthGuard } from "@/libs/guards";
import prisma from "@/libs/prisma";
import { ApiException, ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";
import { NextResponse } from "next/server";
import { RobotSchema } from "../schemas";

export const dynamic = "force-dynamic";

export const GET = withAuthGuard(
  async () => {
    const robot = await prisma.robotWorkWeixin.findFirst({
      omit: { id: true },
    });

    return NextResponse.json(new ApiResponse(robot));
  },
  {
    role: Role.DEVELOPER,
  }
);

export const PUT = withAuthGuard(
  async (request) => {
    try {
      const schema = await request.json();

      const result = RobotSchema.safeParse(schema);

      if (!result.success) {
        return NextResponse.json(new ApiException(result.error.issues));
      }

      const robot = await prisma.robotWorkWeixin.upsert({
        where: {
          id: 1,
        },
        omit: { id: true },
        create: result.data,
        update: result.data,
      });

      return NextResponse.json(new ApiResponse(robot));
    } catch (error) {
      return NextResponse.json(new ApiException((error as Error).message));
    }
  },
  {
    role: Role.DEVELOPER,
  }
);
