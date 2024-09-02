import { z } from "zod";
import { zfd } from "zod-form-data";

export const ReleaseIdSchema = z.coerce.number();

export const ReleaseInputSchema = z.object({
  appId: z.coerce.number({
    required_error: "所属应用不能为空",
    invalid_type_error: "所属应用不存在",
  }),
  pipelineId: z.coerce.number({
    required_error: "所属流水线不能为空",
    invalid_type_error: "所属流水线不存在",
  }),
  version: z
    .string()
    .regex(
      /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(\.(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(\+[0-9a-zA-Z-]+(\.[0-9a-zA-Z-]+)*)?$/,
      "版本号必须符合 Semantic versioning，例如：1.1.0"
    ),
  buildId: z.coerce
    .number()
    .refine(
      (buildId) => {
        return !buildId || /^[1-9]\d*$/.test(`${buildId}`);
      },
      {
        message: "构建号必须为大于 0 的正整数，例如：66",
      }
    )
    .optional(),
  desc: z
    .string({ required_error: "更新说明不能为空" })
    .min(1, "更新说明不能为空"),
  previewUrl: z.string().url("previewUrl 不合法").or(z.literal("")).optional(),
});

const MAX_FILE_SIZE = 208 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "application/zip",
  "application/vnd.android.package-archive",
  "application/iphone-package-archive",
];

export const UploadInputSchema = zfd.formData({
  file: z
    .unknown()
    .transform((value) => value as File | null | undefined)
    .refine((file) => file && file.size > 0, "文件不能为空")
    .refine(
      (file) => file && ACCEPTED_IMAGE_TYPES.includes(file.type),
      "文件只支持 .zip/.apk/.ipa 格式"
    )
    .refine(
      (file) => file && file.size <= MAX_FILE_SIZE,
      `文件大小不能超过 208MB`
    ),
});
