import { Status } from "@/types/enum";
import { z } from "zod";

export const AppIdSchema = z.coerce.number();

export const AppInputSchema = z.object({
  name: z.coerce
    .string({ required_error: "应用名称不能为空" })
    .min(1, "应用名称不能为空"),
  desc: z.string().optional(),
  subscribers: z.string().optional(),
  robotDingDingStatus: z
    .nativeEnum(Status, { message: "状态不存在" })
    .optional(),
  robotWorkWeixinStatus: z
    .nativeEnum(Status, { message: "状态不存在" })
    .optional(),
  systemValue: z.string({ required_error: "应用所属系统不能为空" }),
  platformValue: z.string({ required_error: "应用所属系统不能为空" }),
});
