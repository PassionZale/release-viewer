import { jwtVerify } from "jose";
import { PrismaModels } from "@/types/interface";

export type SessionData = {
  user: Omit<PrismaModels["User"], "hashedPassword">;
};

export function getJwtSecretKey() {
  const secret = process.env.DASHBOARD_JWT_SECRET;

  if (!secret) {
    throw new Error("JWT Secret key is not matched");
  }

  return new TextEncoder().encode(secret);
}

export async function verifyJwtToken(token: string) {
  try {
    const { payload } = await jwtVerify<SessionData>(token, getJwtSecretKey());

    return payload;
  } catch (error) {
    return null;
  }
}
