import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";

export const dynamic = "force-dynamic";

export async function GET() {
  const count = await prisma.user.count({
    where: {
      role: Role.ADMIN,
    },
  });

  return NextResponse.json(
    new ApiResponse({
      isInitialized: !!count,
    })
  );
}
