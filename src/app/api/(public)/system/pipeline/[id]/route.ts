import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { ApiResponse } from "@/libs/utils";
import { z } from "zod";
import paginate from "@/libs/paginate";

const PipelineIdSchema = z.coerce.number();

export const dynamic = "force-dynamic";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { success, data } = PipelineIdSchema.safeParse(params.id);

    if (success) {
      const pipeline = await prisma.pipeline.findUnique({
        where: {
          id: data,
        },
        include: {
          app: true,
          releases: {
            orderBy: {
              createdAt: "desc",
            },
            skip: 0,
            take: 20,
          },
        },
      });

      return NextResponse.json(new ApiResponse(pipeline));
    }

    throw new ApiResponse();
  } catch (error) {
    return NextResponse.json(new ApiResponse());
  }
}
