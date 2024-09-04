import { Role, Status } from "@/types/enum";
import { z } from "zod";

export const UserIdSchema = z.coerce.number();

export const UserInputSchema = z.object({
  nickname: z
    .string({ required_error: "昵称不能为空" })
    .min(1, "昵称至少1个字符"),
  avatar: z.string().optional(),
  username: z
    .string({ required_error: "用户名不能为空" })
    .min(1, "用户名至少1个字符"),
  password: z
    .string({ required_error: "用户密码不能为空" })
    .min(6, "密码至少6个字符"),
  role: z.nativeEnum(Role, { message: "角色不存在" }).optional(),
  status: z.nativeEnum(Status, { message: "状态不存在" }).optional(),
});

export const ProfileInputSchema = z.object({
  nickname: z
    .string({ required_error: "昵称不能为空" })
    .min(1, "昵称至少1个字符"),
  avatar: z.string().optional(),
  password: z
    .string()
    .optional()
    .refine((value) => {
      if (!!value) {
        return value.length >= 6;
      }

      return true;
    }, "密码至少6个字符"),
});
