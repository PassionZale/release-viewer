import { cookies } from "next/headers";
import { COOKIE_JWT_KEY } from "@/types/constant";
import { verifyJwtToken } from "./jwt";
import { NextResponse } from "next/server";
import { ApiException } from "./utils";
import { ApiCode, Role } from "@/types/enum";

export async function getVerifiedToken() {
  const { value: token } = cookies().get(COOKIE_JWT_KEY) ?? { value: null };

  if (!token) return null;

  const hasVerifiedToken = token && (await verifyJwtToken(token));

  return hasVerifiedToken;
}

// TODO 这些 Guard 都不是实时查询的数据库，
// 而是直接取的 jwt payload 中的用户数据
// 看后期是否调整为通过 id 从数据库中读取 userinfo
// 守卫逻辑 jwt 合法 -> 用户存在 -> 非禁用 -> 角色正确

export async function JwtAuthGuard() {
  const hasVerifiedToken = await getVerifiedToken();

  if (!hasVerifiedToken) {
    return NextResponse.json(new ApiException("令牌无效", ApiCode.JWT_INVALID));
  }
}

export async function RoleAuthGuard(needRole: Role) {
  const hasVerifiedToken = await getVerifiedToken();

  if (!hasVerifiedToken) {
    return NextResponse.json(new ApiException("令牌无效", ApiCode.JWT_INVALID));
  }

  // 通过 RBAC0，简单处理下权限
  // 用户权限值 大于 所需权限值，则无权访问
  if (hasVerifiedToken.role > needRole) {
    return NextResponse.json(
      new ApiException("权限不足", ApiCode.PERMISSION_DENIED)
    );
  }
}
