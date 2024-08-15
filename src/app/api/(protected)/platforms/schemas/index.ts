import { z } from "zod";

export const PlatformIdSchema = z.coerce.number();

export const PlatformInputSchema = z.object({
  label: z.string({ required_error: "平台名称不能为空" }),
  value: z.string({ required_error: "平台编码不能为空" }),
});
