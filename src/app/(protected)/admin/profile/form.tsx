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

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import request from "@/libs/request";
import { useToast } from "@/components/ui/use-toast";
import { ApiException } from "@/libs/utils";
import { useRouter } from "next/navigation";
import { ImageUpload, ImageUploadProps } from "@/components/ImageUpload";
import useUserStore, { UserStore } from "@/stores/user";

export type User = Omit<
  PrismaModels["User"],
  "id" | "hashedPassword" | "role" | "status"
>;

interface UserFormProps {
  initialData?: User;
}

const formSchema = z.object({
  nickname: z.string({ required_error: "必填" }).min(1, "必填"),
  avatar: z.string().optional(),
  username: z.string({ required_error: "必填" }).min(1, "必填"),
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

type FormValue = z.infer<typeof formSchema>;

export default function ProfleForm({ initialData }: UserFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { init, reset } = useUserStore();

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: "",
      avatar: "",
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      const { nickname, avatar, username } = initialData;

      form.reset({
        nickname,
        avatar: avatar || "",
        username,
      });
    }
  }, [initialData, form]);

  const onUploadError: ImageUploadProps["onError"] = (error) => {
    form.setError("avatar", { type: "custom", message: error.message });
  };

  const onSubmit = async (data: FormValue) => {
    try {
      setLoading(true);

      const res = await request.put<UserStore["user"]>("/api/users/profile", {
        params: data,
      });

      setLoading(false);

      if (!!data.password) {
        await request.post("/api/auth/signout");

        reset();

        router.push("/login");

        toast({ description: "请重新登录" });
      } else {
        res.data && init(res.data);

        toast({ description: res.message });
      }
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
                  onChange={(value) => field.onChange(value?.[0] ?? "")}
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
                <Input {...field} disabled />
              </FormControl>
              <FormDescription>用户名无法更改。</FormDescription>
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
              <FormDescription>
                若填写密码，保存后需要重新登录。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="ml-auto w-full" type="submit" loading={loading}>
          保存
        </Button>
      </form>
    </Form>
  );
}
