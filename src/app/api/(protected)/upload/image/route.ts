import { NextResponse } from "next/server";
import fse from "fs-extra";
import dayjs from "@/libs/dayjs";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { withAuthGuard } from "@/libs/guards";
import { ApiException, ApiResponse } from "@/libs/utils";
import { Role } from "@/types/enum";
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

        const fileName = `${uuidv4()}~${file!.name}`;

        const isDeployeOnVercel = process.env.DEPLOYE_PLATFORM === "vercel";

        const UPLOAD_ROOT_FOLDER_PATH = isDeployeOnVercel ? "/tmp" : "/public";
        const UPLOAD_BASE_FOLDER_PATH = "/uploads";
        const UPLOAD_FILE_FOLDER_PATH = `/${dayjs().format("YYYY-MM")}`;

        const uploadFinalPath = path.join(
          isDeployeOnVercel ? "" : process.cwd(),
          UPLOAD_ROOT_FOLDER_PATH,
          UPLOAD_BASE_FOLDER_PATH,
          UPLOAD_FILE_FOLDER_PATH
        );

        const fileFinalPath = path.join(uploadFinalPath, fileName);

        await fse.ensureDir(uploadFinalPath, 0o2775);

        await fse.writeFile(fileFinalPath, buffer);

        const responseFinalPath =
          UPLOAD_BASE_FOLDER_PATH + UPLOAD_FILE_FOLDER_PATH + `/${fileName}`;

        return NextResponse.json(
          new ApiResponse(
            isDeployeOnVercel
              ? UPLOAD_ROOT_FOLDER_PATH + responseFinalPath
              : responseFinalPath
          )
        );
      } catch (error) {
        return NextResponse.json(new ApiException((error as Error).message));
      }
    }

    const { issues } = error;

    return NextResponse.json(new ApiException(issues));
  },
  { role: Role.VISITOR }
);
