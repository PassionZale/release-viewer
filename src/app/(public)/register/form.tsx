"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import request from "@/libs/request";
import { ApiException } from "@/libs/utils";
import {
  IconApps,
  IconBook,
  IconHomeHand,
  IconKey,
  IconRocket,
  IconUsers,
  IconZeppelin,
} from "@tabler/icons-react";

const formSchema = z.object({
  nickname: z.string({ required_error: "必填" }).min(1, "必填"),
  username: z.string({ required_error: "必填" }).min(1, "必填"),
  password: z.string({ required_error: "必填" }).min(6, "密码至少6个字符"),
});

type RegisterFormValue = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterFormValue>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: RegisterFormValue) => {
    try {
      setLoading(true);

      await request.post("/api/auth/register", {
        params: data,
      });

      const nextUrl = searchParams.get("next");
      // @see: https://github.com/vercel/next.js/discussions/44149
      router.push(nextUrl ?? "/admin");
      router.refresh();
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
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>昵称</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="false" />
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
                  <Input
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button loading={loading} className="ml-auto w-full" type="submit">
            注册
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground flex items-center gap-x-2">
            <IconHomeHand />
            <IconBook />
            <IconUsers />
            <IconApps />
            <IconZeppelin />
            <IconRocket />
            <IconKey />
          </span>
        </div>
      </div>
    </>
  );
}
