import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { withAuthGuard } from "@/libs/guards";
import { ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";

export const dynamic = "force-dynamic";

export const GET = withAuthGuard(
  async () => {
    const systems = await prisma.platform.findMany();

    return NextResponse.json(new ApiResponse(systems));
  },
  {
    role: Role.VISITOR,
  }
);
