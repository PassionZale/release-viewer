"use client";

import { PrismaModels } from "@/types/interface";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { z } from "zod";
import { Role, Status } from "@/types/enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import request from "@/libs/request";
import { useToast } from "@/components/ui/use-toast";
import { ApiException } from "@/libs/utils";
import { useRouter } from "next/navigation";
import { ImageUpload, ImageUploadProps } from "@/components/ImageUpload";
import { usePermissionDenied } from "@/libs/hooks";

interface UserFormProps {
  initialData?: PrismaModels["User"];
}

const formSchema = z
  .object({
    id: z.number().or(z.literal("")),
    nickname: z.string({ required_error: "必填" }).min(1, "必填"),
    avatar: z.string().optional(),
    username: z.string({ required_error: "必填" }).min(1, "必填"),
    password: z.string().or(z.literal("")),
    role: z.nativeEnum(Role, { message: "角色不存在" }).optional(),
    status: z.nativeEnum(Status, { message: "状态不存在" }).optional(),
  })
  .superRefine((values, ctx) => {
    if (!values.id && !values.password) {
      ctx.addIssue({
        message: "必填",
        code: z.ZodIssueCode.custom,
        path: ["password"],
      });
    }
  });

type FormValue = z.infer<typeof formSchema>;

export default function UserForm({ initialData }: UserFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { denied } = usePermissionDenied(Role.ADMIN);

  const readOnly = Boolean(initialData?.id);

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      nickname: "",
      avatar: "",
      username: "",
      password: "",
      role: Role.DEVELOPER,
      status: Status.ON,
    },
  });

  useEffect(() => {
    if (initialData) {
      const { id, nickname, avatar, username, role, status } = initialData;

      form.reset({
        id,
        nickname,
        avatar: avatar || "",
        username,
        role,
        status,
      });
    }
  }, [initialData, form]);

  const onUploadError: ImageUploadProps["onError"] = (error) => {
    form.setError("avatar", { type: "custom", message: error.message });
  };

  const onSubmit = async (data: FormValue) => {
    try {
      setLoading(true);

      const _request = initialData?.id
        ? () => request.put(`/api/users/${initialData.id}`, { params: data })
        : () => request.post(`/api/users`, { params: data });

      const { message } = await _request();

      setLoading(false);

      toast({ description: message });

      router.back();
    } catch (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: (error as ApiException).message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem hidden>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>头像（可选）</FormLabel>
              <FormControl>
                <ImageUpload
                  onChange={(value) => field.onChange(value?.[0])}
                  onError={onUploadError}
                  value={field.value ? [`${field.value}`] : []}
                />
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
                <Input {...field} disabled={readOnly} />
              </FormControl>
              <FormDescription>用户名一旦创建，则无法更改。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem hidden={readOnly}>
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
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={`${field.value}`}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={`${Role.ADMIN}`}>管理员</SelectItem>
                  <SelectItem value={`${Role.DEVELOPER}`}>开发者</SelectItem>
                  <SelectItem value={`${Role.VISITOR}`}>访客</SelectItem>
                </SelectContent>
              </Select>
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
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={`${field.value}`}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={`${Status.ON}`}>启用</SelectItem>
                  <SelectItem value={`${Status.OFF}`}>禁用</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="ml-auto w-full"
          type="submit"
          loading={loading}
          disabled={denied}
        >
          保存
        </Button>
      </form>
    </Form>
  );
}
