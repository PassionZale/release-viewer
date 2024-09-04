import { parseJwtPayload } from "@/libs/jwt";
import prisma from "@/libs/prisma";
import { ApiResponse } from "@/libs/utils";
import { Status } from "@/types/enum";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const jwtPayload = await parseJwtPayload();

    if (!jwtPayload) {
      return NextResponse.json(new ApiResponse());
    }

    const { userId } = jwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user && user.status !== Status.OFF) {
      const { hashedPassword, ...profile } = user;

      return NextResponse.json(new ApiResponse(profile));
    } else {
      return NextResponse.json(new ApiResponse());
    }
  } catch (error) {
    return NextResponse.json(new ApiResponse());
  }
}
