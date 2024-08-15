import { withAuthGuard } from "@/libs/guards";
import prisma from "@/libs/prisma";
import { ApiException, ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";
import { NextResponse } from "next/server";
import { SystemInputSchema } from "./schemas";

export const dynamic = "force-dynamic";

export const GET = withAuthGuard(
  async () => {
    const systems = await prisma.system.findMany();

    return NextResponse.json(new ApiResponse(systems));
  },
  {
    role: Role.VISITOR,
  }
);

export const POST = withAuthGuard(
  async (request) => {
    const schema = await request.json();

    const { success, error, data } = SystemInputSchema.safeParse(schema);

    if (success) {
      const exist = await prisma.system.findFirst({
        where: {
          OR: [
            {
              label: { equals: data.label },
            },
            {
              value: { equals: data.value },
            },
          ],
        },
      });

      if (exist) {
        return NextResponse.json(new ApiException("系统名称或编码不能重复"));
      }

      const system = await prisma.system.create({ data });

      return NextResponse.json(new ApiResponse(system));
    }

    const { issues } = error;

    return NextResponse.json(new ApiException(issues));
  },
  {
    role: Role.ADMIN,
  }
);
