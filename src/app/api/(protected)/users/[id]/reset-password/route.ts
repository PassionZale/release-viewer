import { withAuthGuard } from "@/libs/guards";
import { Role } from "@/types/enum";
import { UserIdSchema, UserInputSchema } from "../../schemas";
import { NextResponse } from "next/server";
import { ApiException, ApiResponse } from "@/libs/utils";
import prisma from "@/libs/prisma";
import { encrypt } from "@/libs/bcrypt";

export const dynamic = "force-dynamic";

export const PUT = withAuthGuard<{ id: string }>(
  async (request, { params }) => {
    const paramsResult = UserIdSchema.safeParse(params.id);

    if (!paramsResult.success)
      return NextResponse.json(new ApiException("资源不存在"));

    try {
      const schema = await request.json();

      const bodyResult = UserInputSchema.pick({
        password: true,
      }).safeParse(schema);

      if (!bodyResult.success) {
        return NextResponse.json(new ApiException(bodyResult.error.issues));
      }

      const user = await prisma.user.findUnique({
        where: { id: paramsResult.data },
        omit: {
          username: true,
          hashedPassword: true,
        },
      });

      if (!user) return NextResponse.json(new ApiException("资源不存在"));

      await prisma.user.update({
        where: { id: paramsResult.data },
        data: {
          hashedPassword: encrypt(bodyResult.data.password),
        },
      });

      return NextResponse.json(new ApiResponse());
    } catch (error) {
      return NextResponse.json(new ApiException((error as Error).message));
    }
  },
  {
    role: Role.ADMIN,
  }
);
