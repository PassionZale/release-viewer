import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { ApiResponse } from "@/libs/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const count = await prisma.user.count();

  return NextResponse.json(
    new ApiResponse({
      isInitialized: !!count,
    })
  );
}
