import { NextResponse } from "next/server";
import { ApiCode, Role, Status } from "@/types/enum";
import { ContextRequest, ContextResponse, Params } from "@/types/interface";
import { parseJwtPayload } from "./jwt";
import { ApiException } from "./utils";
import prisma from "./prisma";

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
