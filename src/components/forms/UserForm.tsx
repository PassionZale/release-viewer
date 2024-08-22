"use client";

import { PrismaModels } from "@/types/interface";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Role, Status } from "@/types/enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import request from "@/libs/request";

interface UserFormProps {
  id?: string;
  initialData?: PrismaModels["User"];
}

const formSchema = z
  .object({
    id: z.number().optional(),
    nickname: z
      .string({ required_error: "昵称不能为空" })
      .min(1, "昵称至少1个字符"),
    avatar: z.string().optional(),
    username: z
      .string({ required_error: "用户名不能为空" })
      .min(1, "用户名至少1个字符"),
    password: z
      .string({ required_error: "用户密码不能为空" })
      .min(6, "密码至少6个字符")
      .optional(),
    role: z.nativeEnum(Role, { message: "角色不存在" }).optional(),
    status: z.nativeEnum(Status, { message: "状态不存在" }).optional(),
  })
  .superRefine((values, ctx) => {
    if (values.id && !values.password) {
      ctx.addIssue({
        message: "密码必填",
        code: z.ZodIssueCode.custom,
        path: ["password"],
      });
    }
  });

type FormValue = z.infer<typeof formSchema>;

export default function UserForm({ id, initialData }: UserFormProps) {
  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: Role.VISITOR,
      status: Status.ON,
    },
    values: initialData as FormValue,
  });

  const onSubmit = () => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>昵称</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>角色</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>状态</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="ml-auto w-full" type="submit">
          保存
        </Button>
      </form>
    </Form>
  );
}
