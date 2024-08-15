import { z } from "zod";

export const SystemIdSchema = z.coerce.number();

export const SystemInputSchema = z.object({
  label: z
    .string({ required_error: "系统名称不能为空" })
    .min(2, "系统名称至少2个字符"),
  value: z
    .string({ required_error: "系统编码不能为空" })
    .min(2, "系统编码至少2个字符"),
});
