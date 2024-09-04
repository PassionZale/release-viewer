import { withAuthGuard } from "@/libs/guards";
import prisma from "@/libs/prisma";
import { ApiException, ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";
import { NextResponse } from "next/server";
import { z } from "zod";
import dayjs from "@/libs/dayjs";
import { v4 as uuidv4 } from "uuid";
import { encrypt } from "@/libs/bcrypt";

const TokenInputSchema = z.object({
  name: z.string({ required_error: "名称不能为空" }).min(1, "名称不能为空"),
  desc: z.coerce.string().optional(),
  expiresAt: z.coerce
    .date({ required_error: "过期日期格式必须为 YYYY-MM-DD" })
    .optional(),
});

export const dynamic = "force-dynamic";

export const GET = withAuthGuard(
  async () => {
    const tokens = await prisma.token.findMany({
      omit: {
        accessKey: true,
      },
    });

    return NextResponse.json(new ApiResponse(tokens));
  },
  {
    role: Role.VISITOR,
  }
);

export const POST = withAuthGuard(
  async (request) => {
    const schema = await request.json();

    const { success, error, data } = TokenInputSchema.safeParse(schema);

    if (success) {
      const { name, desc, expiresAt } = data;

      const suffix = expiresAt ? dayjs(expiresAt).unix() : dayjs().unix();

      const accessKey = encrypt(`${name}-${uuidv4()}-${suffix}`);

      await prisma.token.create({
        data: {
          name,
          desc,
          accessKey,
          expiresAt: expiresAt ? dayjs(expiresAt).toISOString() : null,
          userId: request.auth?.user?.id,
        },
      });

      return NextResponse.json(new ApiResponse(accessKey));
    }

    const { issues } = error;

    return NextResponse.json(new ApiException(issues));
  },
  {
    role: Role.DEVELOPER,
  }
);
