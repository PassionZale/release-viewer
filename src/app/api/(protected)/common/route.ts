import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { withAuthGuard } from "@/libs/guards";
import { ApiResponse } from "@/libs/utils";

const handler = withAuthGuard(async () => {
  const systems = await prisma.system.findMany();
  const platforms = await prisma.platform.findMany();

  return NextResponse.json(
    new ApiResponse({
      systems,
      platforms,
    })
  );
});

export { handler as GET };
