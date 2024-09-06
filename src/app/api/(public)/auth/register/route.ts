import { NextResponse } from "next/server";
import { signJwtToken } from "@/libs/jwt";
import prisma from "@/libs/prisma";
import { encrypt } from "@/libs/bcrypt";
import { ApiException, ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";
import { COOKIE_JWT_KEY } from "@/types/constant";
import { z } from "zod";

export const dynamic = "force-dynamic";

const RegisterInputSchema = z.object({
  nickname: z
    .string({ required_error: "昵称不能为空" })
    .min(1, "昵称至少1个字符"),
  username: z
    .string({ required_error: "用户名不能为空" })
    .min(1, "用户名至少1个字符"),
  password: z
    .string({ required_error: "用户密码不能为空" })
    .min(6, "密码至少6个字符"),
});

export async function POST(request: Request) {
  try {
    const count = await prisma.user.count({
      where: {
        role: Role.ADMIN,
      },
    });

    if (count) {
      return NextResponse.json(new ApiException("管理员已存在"));
    }

    const schema = await request.json();

    const { success, error, data } = RegisterInputSchema.safeParse(schema);

    if (success) {
      const { password, ...rest } = data;

      const _hashedPassword = encrypt(password);

      const { hashedPassword, ...user } = await prisma.user.create({
        data: {
          hashedPassword: _hashedPassword,
          role: Role.ADMIN,
          ...rest,
        },
      });

      const token = await signJwtToken({ userId: user.id });

      const res = NextResponse.json(new ApiResponse({ token, user: rest }));

      const cookieOptions = {
        httpOnly: true,
        secure: true,
      };

      res.cookies.set(COOKIE_JWT_KEY, token, cookieOptions);

      return res;
    }

    const { issues } = error;

    return NextResponse.json(new ApiException(issues));
  } catch (error) {
    return NextResponse.json(new ApiException((error as Error).message), {
      status: 400,
    });
  }
}
