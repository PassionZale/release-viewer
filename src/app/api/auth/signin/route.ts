import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getJwtSecretKey } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { verify } from "@/lib/bcrypt";
import { ApiException, ApiResponse } from "@/lib/utils";
import { Status } from "@/types/enum";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    // 用户存在、非禁用、密码正确
    if (
      user &&
      user.status !== Status.OFF &&
      verify(password, user.hashedPassword)
    ) {
      const { hashedPassword, ...rest } = user;

      // 颁发 jwt
      const token = await new SignJWT(rest)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(getJwtSecretKey());

      // 组装 user
      const res = NextResponse.json(new ApiResponse({ ...rest, token }));

      const cookieOptions = {
        httpOnly: true,
        secure: true,
      };

      // 写入 cookie
      res.cookies.set("token", token, cookieOptions);

      return res;
    }

    throw new ApiException("账号或密码错误");
  } catch (error) {
    return NextResponse.json(new ApiException((error as Error).message), {
      status: 500,
    });
  }
}
