import { withAuthGuard } from "@/libs/guards";
import { ApiException, ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";
import { writeFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { UploadImageInputSchema } from "../schemas";

export const dynamic = "force-dynamic";

export const POST = withAuthGuard(
  async (request) => {
    const formData = await request.formData();

    const { success, error, data } = UploadImageInputSchema.safeParse(formData);

    if (success) {
      try {
        const { file } = data;

        const arrayBuffer = await file!.arrayBuffer();

        const buffer = new Uint8Array(arrayBuffer);

        const filePath = `/uploads/${Date.now()}_${file!.name}`;

        const uploadPath = "./public" + filePath;

        await writeFile(uploadPath, buffer);

        return NextResponse.json(new ApiResponse(filePath));
      } catch (error) {
        return NextResponse.json(new ApiException((error as Error).message));
      }
    }

    const { issues } = error;

    return NextResponse.json(new ApiException(issues));
  },
  { role: Role.ADMIN }
);
