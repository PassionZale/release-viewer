import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { withAuthGuard } from "@/libs/guards";
import { ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";

export async function GET() {
  const systems = await prisma.system.findMany();
  const platforms = await prisma.platform.findMany();

  return NextResponse.json(
    new ApiResponse({
      systems,
      platforms,
    })
  );
}

export const POST = withAuthGuard(
  async (req) => {
    const systems = await prisma.system.findMany();
    const platforms = await prisma.platform.findMany();

    return NextResponse.json(
      new ApiResponse({
        user: req.auth?.user,
        systems,
        platforms,
      })
    );
  },
  {
    role: Role.ADMIN,
  }
);
