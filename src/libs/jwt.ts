import { jwtVerify } from "jose";
import { PrismaModels } from "@/types/interface";

type PayloadType = Omit<PrismaModels["User"], "hashedPassword"> & {
  token: string;
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
    const { payload } = await jwtVerify<PayloadType>(token, getJwtSecretKey());

    return payload;
  } catch (error) {
    return null;
  }
}
