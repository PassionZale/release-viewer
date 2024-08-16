import { z } from "zod";

export const PipelineIdSchema = z.coerce.number();

export const PipelineInputSchema = z.object({
  appId: z.coerce.number({
    required_error: "所属应用不能为空",
    invalid_type_error: "所属应用不能为空",
  }),
  name: z.coerce
    .string({ required_error: "流水线名称不能为空" })
    .min(1, "流水线名称不能为空"),
  previewWebUrl: z.string().url("previewWebUrl 不合法").optional(),
  previewImgUrl: z.string().url("previewImgUrl 不合法").optional(),
});
