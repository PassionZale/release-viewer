import { withAuthGuard } from "@/libs/guards";
import { ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";
import { NextResponse } from "next/server";

export const GET = withAuthGuard(
  async (request) => {
    return NextResponse.json(new ApiResponse(request.auth?.user));
  },
  {
    role: Role.VISITOR,
  }
);
