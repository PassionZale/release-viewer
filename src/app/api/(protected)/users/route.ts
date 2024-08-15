import { withAuthGuard } from "@/libs/guards";
import prisma from "@/libs/prisma";
import { ApiException, ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";
import { NextResponse } from "next/server";
import { UserInputSchema } from "./schemas";
import { encrypt } from "@/libs/bcrypt";

export const dynamic = "force-dynamic";

export const GET = withAuthGuard(
  async () => {
    const users = await prisma.user.findMany({
      omit: {
        hashedPassword: true,
      },
    });

    return NextResponse.json(new ApiResponse(users));
  },
  {
    role: Role.ADMIN,
  }
);

export const POST = withAuthGuard(
  async (request) => {
    const schema = await request.json();

    const { success, error, data } = UserInputSchema.safeParse(schema);

    if (success) {
      const exist = await prisma.user.findUnique({
        where: {
          username: data.username,
        },
      });

      if (exist) {
        return NextResponse.json(new ApiException("用户名不能重复"));
      }

      const { password, ...rest } = data;

      const _hashedPassword = encrypt(password);

      const { hashedPassword, ...user } = await prisma.user.create({
        data: {
          hashedPassword: _hashedPassword,
          ...rest,
        },
      });

      return NextResponse.json(new ApiResponse(user));
    }

    const { issues } = error;

    return NextResponse.json(new ApiException(issues));
  },
  {
    role: Role.ADMIN,
  }
);
