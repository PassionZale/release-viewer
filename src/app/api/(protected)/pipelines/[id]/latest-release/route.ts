import { NextResponse } from "next/server";
import { withAuthGuard } from "@/libs/guards";
import prisma from "@/libs/prisma";
import { ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";
import { PipelineIdSchema } from "../../schemas";

export const dynamic = "force-dynamic";

export const GET = withAuthGuard<{ id: string }>(
  async (_, { params }) => {
    try {
      const { success, data } = PipelineIdSchema.safeParse(params.id);

      if (success) {
        const pipeline = await prisma.pipeline.findUnique({
          where: {
            id: data,
          },
          include: {
            releases: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            },
          },
        });

        return NextResponse.json(new ApiResponse(pipeline));
      }

      throw new ApiResponse();
    } catch (error) {
      return NextResponse.json(new ApiResponse());
    }
  },
  {
    role: Role.VISITOR,
  }
);
