import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { ApiResponse } from "@/libs/utils";

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
