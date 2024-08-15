import { z } from "zod";

export const SystemIdSchema = z.coerce.number();

export const SystemInputSchema = z.object({
  label: z.string({ required_error: "系统名称不能为空" }),
  value: z.string({ required_error: "系统编码不能为空" }),
});
