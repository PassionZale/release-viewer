import { z } from "zod";
import { zfd } from "zod-form-data";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const UploadImageInputSchema = zfd.formData({
  file: z
    .unknown()
    .transform((value) => value as File | null | undefined)
    .refine((file) => file && file.size > 0, "图片不能为空")
    .refine(
      (file) => file && ACCEPTED_IMAGE_TYPES.includes(file.type),
      "图片只支持 .jpeg/.jpg/.png/.webp/.gif 格式"
    )
    .refine(
      (file) => file && file.size <= MAX_FILE_SIZE,
      `图片大小不能超过 10MB`
    ),
});
