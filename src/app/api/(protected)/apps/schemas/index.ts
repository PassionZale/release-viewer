import { z } from "zod";

export const AppCreateSchema = z.object({
  name: z.string({ required_error: "应用名称不能为空" }),
  desc: z.string().optional(),
  subscribers: z.string().optional(),
  robotDingDingStatus: z.number().optional(),
  robotWorkWeixinStatus: z.number().optional(),
  systemValue: z.string({ required_error: "应用所属系统不能为空" }),
  platformValue: z.string({ required_error: "应用所属系统不能为空" }),
});
