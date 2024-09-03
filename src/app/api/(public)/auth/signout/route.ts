import { COOKIE_JWT_KEY } from "@/types/constant";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL(`/login`, request.url));

  response.cookies.delete(COOKIE_JWT_KEY);

  return response;
}
