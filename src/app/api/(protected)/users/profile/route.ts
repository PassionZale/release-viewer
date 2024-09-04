import { withAuthGuard } from "@/libs/guards";
import { ApiException, ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";
import { NextResponse } from "next/server";
import { ProfileInputSchema } from "../schemas";
import prisma from "@/libs/prisma";
import { encrypt } from "@/libs/bcrypt";

export const GET = withAuthGuard(
  async (request) => {
    return NextResponse.json(new ApiResponse(request.auth?.user));
  },
  {
    role: Role.VISITOR,
  }
);

export const PUT = withAuthGuard(
  async (request) => {
    try {
      const { id } = request.auth!.user!;

      const schema = await request.json();

      const { success, data, error } = ProfileInputSchema.safeParse(schema);

      if (!success) {
        return NextResponse.json(new ApiException(error.issues));
      }

      const { password, ...rest } = data;

      const payload = !!password
        ? { hashedPassword: encrypt(password), ...rest }
        : rest;

      const nextUser = await prisma.user.update({
        where: { id },
        data: payload,
        omit: {
          hashedPassword: true,
        },
      });

      return NextResponse.json(new ApiResponse(nextUser));
    } catch (error) {
      return NextResponse.json(new ApiException((error as Error).message));
    }
  },
  {
    role: Role.VISITOR,
  }
);
