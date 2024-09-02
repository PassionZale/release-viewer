import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { ApiResponse } from "@/libs/utils";

export const dynamic = "force-dynamic";

export async function GET(
  _: NextRequest,
  { params }: { params: { value: string } }
) {
  const apps = await prisma.app.findMany({
    where: {
      systemValue: params.value,
    },
    include: {
			platform: true,
			system: true,
      pipelines: {
        include: {
          releases: {
            skip: 0,
            take: 1,
            orderBy: { createdAt: "desc" },
            include: {
              user: {
                select: {
                  nickname: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return NextResponse.json(new ApiResponse(apps));
}
