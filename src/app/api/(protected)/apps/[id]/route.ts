import { NextResponse } from "next/server";
import { z } from "zod";
import { withAuthGuard } from "@/libs/guards";
import prisma from "@/libs/prisma";
import { ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";

export const dynamic = "force-dynamic";

export const GET = withAuthGuard<{ id: string }>(
  async (_, { params }) => {
    const schema = z.coerce.number();

    const { success, data } = schema.safeParse(params.id);

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
