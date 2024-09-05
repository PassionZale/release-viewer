import { NextRequest, NextResponse } from "next/server";
import { ApiCode, Role, Status } from "@/types/enum";
import { ContextRequest, ContextResponse, Params } from "@/types/interface";
import { parseJwtPayload } from "./jwt";
import { ApiException } from "./utils";
import prisma from "./prisma";
import { headers } from "next/headers";
import dayjs from "@/libs/dayjs";

type AuthGuardOptions = {
  role?: Role;
};

// 守卫逻辑: jwt 合法 -> 用户存在 -> 非禁用 -> 角色正确
export function withAuthGuard<P extends Params = Params>(
  handler: (req: ContextRequest, res: ContextResponse<P>) => Promise<Response>,
  options?: AuthGuardOptions
) {
  return async (req: ContextRequest, res: ContextResponse<P>) => {
    // jwt 是否合法
    const jwtPayload = await parseJwtPayload();

    if (!jwtPayload) {
      return NextResponse.json(
        new ApiException("令牌无效", ApiCode.JWT_INVALID)
      );
    }

    const { userId } = jwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        new ApiException("账号不存在", ApiCode.JWT_INVALID)
      );
    }

    if (user.status === Status.OFF) {
      return NextResponse.json(
        new ApiException("账号被禁用", ApiCode.ACCOUNT_DISABLED)
      );
    }

    // 角色正确
    // 若定义了所需角色，通过 RBAC0，简单处理下权限
    // 用户权限值 大于 所需权限值，则无权访问
    if (options?.role !== undefined && user.role > options.role) {
      return NextResponse.json(
        new ApiException("权限不足", ApiCode.PERMISSION_DENIED)
      );
    }

    const { hashedPassword, ...contextUser } = user;

    req.auth = {
      user: contextUser,
    };

    return handler(req, res);
  };
}

// 守卫逻辑：accessKey 存在 -> 未过期 -> 更新 lastUsedAt
export function withTokenGuard(
  handler: (req: NextRequest, res: NextResponse) => Promise<Response>
) {
  return async (req: NextRequest, res: NextResponse) => {
    const authorization = headers().get("authorization");

    const accessKey = authorization ? authorization.split(" ")[1] : null;

    if (!accessKey) {
      return NextResponse.json(new ApiException("令牌不合法"), {
        status: 403,
      });
    }

    const token = await prisma.token.findFirst({
      where: { accessKey },
    });

    if (!token) {
      return NextResponse.json(new ApiException("令牌不合法"), {
        status: 403,
      });
    }

    if (token.expiresAt && dayjs().isSameOrAfter(dayjs(token.expiresAt))) {
      return NextResponse.json(new ApiException("令牌已过期"), {
        status: 403,
      });
    }

    await prisma.token.update({
      where: { id: token.id },
      data: {
        lastUsedAt: dayjs().toISOString(),
      },
    });

    return handler(req, res);
  };
}
