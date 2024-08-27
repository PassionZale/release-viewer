import { withAuthGuard } from "@/libs/guards";
import prisma from "@/libs/prisma";
import { ApiException, ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";
import { NextResponse } from "next/server";
import { AppInputSchema } from "./schemas";
import paginate from "@/libs/paginate";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export const GET = withAuthGuard(
  async (request) => {
    const searchParams = request.nextUrl.searchParams;

    const where: Prisma.AppWhereInput = {};

    const name = searchParams.get("name");

    if (name) {
      where.name = { contains: name };
    }

    const platform = searchParams.get("platform");

    if (platform) {
      where.platformValue = platform;
    }

    const system = searchParams.get("system");

    if (system) {
      where.systemValue = system;
    }

    const include: Prisma.AppInclude = {
      system: { select: { label: true, value: true } },
      platform: { select: { label: true, value: true } },
    };

    const populate = searchParams.getAll("populate");

    if (populate.length) {
      populate.map((item) => {
        if (item === "pipelines") {
          include.pipelines = { select: { id: true, name: true } };
        }

        if (item === "releases") {
          include.releases = true;
        }
      });
    }

    const apps = await paginate(prisma.app, {
      searchParams,
      where,
      include,
    });

    return NextResponse.json(new ApiResponse(apps));
  },
  {
    role: Role.VISITOR,
  }
);

export const POST = withAuthGuard(
  async (request) => {
    const schema = await request.json();

    const { success, error, data } = AppInputSchema.safeParse(schema);

    if (success) {
      const app = await prisma.app.create({ data });

      return NextResponse.json(new ApiResponse(app));
    }

    const { issues } = error;

    return NextResponse.json(new ApiException(issues));
  },
  {
    role: Role.ADMIN,
  }
);
