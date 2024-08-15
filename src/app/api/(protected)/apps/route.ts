import { withAuthGuard } from "@/libs/guards";
import prisma from "@/libs/prisma";
import { ApiException, ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";
import { NextResponse } from "next/server";
import { AppInputSchema } from "./schemas";

export const dynamic = "force-dynamic";

export const GET = withAuthGuard(
  async () => {
    const apps = await prisma.app.findMany();

    return NextResponse.json(new ApiResponse(apps));
  },
  {
    role: Role.VISITOR,
  }
);

export const POST = withAuthGuard(
  async (request) => {
    const schema = await request.json();

    const { success, error, data } = AppInputSchema.safeParse(schema);

    if (success) {
      const app = await prisma.app.create({ data });

      return NextResponse.json(new ApiResponse(app));
    }

    const { issues } = error;

    return NextResponse.json(new ApiException(issues));
  },
  {
    role: Role.ADMIN,
  }
);
