import { COOKIE_JWT_KEY } from "@/types/constant";
import { jwtVerify, SignJWT } from "jose";
import { cookies, headers } from "next/headers";

export type JwtPayload = {
  userId: number;
};

export function getJwtSecretKey() {
  const secret = process.env.DASHBOARD_JWT_SECRET;

  if (!secret) {
    throw new Error("JWT Secret key is not matched");
  }

  return new TextEncoder().encode(secret);
}

export async function signJwtToken(payload: JwtPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getJwtSecretKey());

  return token;
}

export async function verifyJwtToken(token: string) {
  try {
    const { payload } = await jwtVerify<JwtPayload>(token, getJwtSecretKey());

    return payload;
  } catch (error) {
    return null;
  }
}

export async function parseJwtPayload() {
  const authorization = headers().get("authorization");

  const { value: jwtValue } = cookies().get(COOKIE_JWT_KEY) ?? {
    value: null,
  };

  // 解析 JWT，header 优先，cookie 其次
  const token = authorization ? authorization.split(" ")[1] : jwtValue;

  if (!token) return null;

  const payload = token && (await verifyJwtToken(token));

  return payload;
}
