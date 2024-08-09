import { NextResponse } from "next/server";
import { ApiResponse } from "@/libs/utils";

export async function POST() {
  const res = NextResponse.json(new ApiResponse());

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  res.cookies.set("token", "", cookieOptions);

  return res;
}
