import { ApiResponse } from "@/libs/utils";
import { COOKIE_JWT_KEY } from "@/types/constant";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {

	const response = NextResponse.json(new ApiResponse())

  response.cookies.delete(COOKIE_JWT_KEY);

  return response;
}
