import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getJwtSecretKey } from "@/libs/jwt";
import prisma from "@/libs/prisma";
import { verify } from "@/libs/bcrypt";
import { ApiException, ApiResponse } from "@/libs/utils";
import { Status } from "@/types/enum";
import { COOKIE_JWT_KEY } from "@/types/constant";

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
      const { hashedPassword, ...payload } = user;

      // 颁发 jwt
      const token = await new SignJWT({
        user: payload,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(getJwtSecretKey());

      // 组装 user
      const res = NextResponse.json(new ApiResponse({ user: payload, token }));

      const cookieOptions = {
        httpOnly: true,
        secure: true,
      };

      // 写入 cookie
      res.cookies.set(COOKIE_JWT_KEY, token, cookieOptions);

      return res;
    }

    return NextResponse.json(new ApiException("账号或密码错误"));
  } catch (error) {
    return NextResponse.json(new ApiException((error as Error).message), {
      status: 400,
    });
  }
}
