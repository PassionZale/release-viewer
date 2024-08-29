import { NextResponse } from "next/server";
import fse from "fs-extra";
import dayjs from "dayjs";
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

        const uuid = uuidv4();

        const UPLOAD_ROOT_FOLDER_PATH =
          process.env.UPLOAD_ROOT_FOLDER_PATH || "./public";
        const UPLOAD_BASE_FOLDER_PATH =
          process.env.UPLOAD_BASE_FOLDER_PATH || "/uploads";
        const UPLOAD_FILE_FOLDER_PATH = `/${dayjs().format("YYYY-MM")}`;

        await fse.ensureDir(
          UPLOAD_ROOT_FOLDER_PATH +
            UPLOAD_BASE_FOLDER_PATH +
            UPLOAD_FILE_FOLDER_PATH,
          0o2775
        );

        const fileName = `${uuid}~${file!.name}`;

        await fse.writeFile(
          UPLOAD_ROOT_FOLDER_PATH +
            UPLOAD_BASE_FOLDER_PATH +
            UPLOAD_FILE_FOLDER_PATH +
            `/${fileName}`,
          buffer
        );

        return NextResponse.json(
          new ApiResponse(
            UPLOAD_BASE_FOLDER_PATH + UPLOAD_FILE_FOLDER_PATH + `/${fileName}`
          )
        );
      } catch (error) {
        return NextResponse.json(new ApiException((error as Error).message));
      }
    }

    const { issues } = error;

    return NextResponse.json(new ApiException(issues));
  },
  { role: Role.ADMIN }
);
