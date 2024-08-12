import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_JWT_KEY } from "@/types/constant";
import { ApiCode, Role } from "@/types/enum";
import { ContextRequest } from "@/types/interface";
import { verifyJwtToken } from "./jwt";
import { ApiException } from "./utils";

export async function getVerifiedToken() {
  const authorization = headers().get("authorization");

  const { value: sessionData } = cookies().get(COOKIE_JWT_KEY) ?? {
    value: null,
  };

  // 解析 JWT，header 优先，cookie 其次
  const token = authorization ? authorization.split(" ")[1] : sessionData;

  if (!token) return null;

  const hasVerifiedToken = token && (await verifyJwtToken(token));

  return hasVerifiedToken;
}

// TODO AuthGuard 不是实时查询的数据库，
// 而是直接取的 jwt payload 中的用户数据
// 看后期是否调整为通过 id 从数据库中读取 userinfo
// 守卫逻辑 jwt 合法 -> 用户存在 -> 非禁用 -> 角色正确

type AuthGuardOptions = {
  role?: Role;
};

export function withAuthGuard(
  handler: (req: ContextRequest, res: NextResponse) => Promise<Response>,
  options?: AuthGuardOptions
) {
  return async (req: ContextRequest, res: NextResponse) => {
    const hasVerifiedToken = await getVerifiedToken();

    if (!hasVerifiedToken) {
      return NextResponse.json(
        new ApiException("令牌无效", ApiCode.JWT_INVALID)
      );
    }

    // 若定义了所需角色，通过 RBAC0，简单处理下权限
    // 用户权限值 大于 所需权限值，则无权访问
    if (
      options?.role !== undefined &&
      hasVerifiedToken.user.role > options.role
    ) {
      return NextResponse.json(
        new ApiException("权限不足", ApiCode.PERMISSION_DENIED)
      );
    }

    req.auth = {
      user: hasVerifiedToken.user,
    };

    return handler(req, res);
  };
}
