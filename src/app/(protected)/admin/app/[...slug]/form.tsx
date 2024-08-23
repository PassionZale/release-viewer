"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import { z } from "zod";
import { Status } from "@/types/enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import request from "@/libs/request";
import { useToast } from "@/components/ui/use-toast";
import { ApiException } from "@/libs/utils";
import { useRouter } from "next/navigation";
import { App } from "../columns";
import useDicStore from "@/stores/dict";

interface AppFormProps {
  initialData?: App;
}

const formSchema = z.object({
  id: z.number().or(z.literal("")),
  name: z.string({ required_error: "必填" }).min(1, "必填"),
  systemValue: z.string({ required_error: "应用所属系统不能为空" }),
  platformValue: z.string({ required_error: "应用所属系统不能为空" }),
  desc: z.string().optional(),
  subscribers: z.string().optional(),
  robotDingDingStatus: z
    .nativeEnum(Status, { message: "状态不存在" })
    .optional(),
  robotWorkWeixinStatus: z
    .nativeEnum(Status, { message: "状态不存在" })
    .optional(),
});

type FormValue = z.infer<typeof formSchema>;

export default function AppForm({ initialData }: AppFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const { systems, platforms } = useDicStore();

  // TODO 权限
  const readOnly = Boolean(initialData?.id);

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      systemValue: systems[0]?.value ?? "",
      platformValue: platforms[0]?.value ?? "",
      desc: "",
      subscribers: "",
      robotDingDingStatus: Status.OFF,
      robotWorkWeixinStatus: Status.OFF,
    },
  });

  useEffect(() => {
    if (initialData) {
      const {
        id,
        name,
        systemValue,
        platformValue,
        desc,
        subscribers,
        robotDingDingStatus,
        robotWorkWeixinStatus,
      } = initialData;

      form.reset({
        id,
        name,
        systemValue: systemValue!,
        platformValue: platformValue!,
        desc: desc || "",
        subscribers: subscribers || "",
        robotDingDingStatus,
        robotWorkWeixinStatus,
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: FormValue) => {
    try {
      setLoading(true);

      const _request = initialData?.id
        ? () => request.put(`/api/apps/${initialData.id}`, { params: data })
        : () => request.post(`/api/apps`, { params: data });

      const { message } = await _request();

      setLoading(false);

      toast({ description: message });

      router.back();
    } catch (error) {
			console.log(error)
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>应用名称</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="systemValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>所属系统</FormLabel>
              <Select onValueChange={field.onChange} value={`${field.value}`}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择系统" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {systems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="platformValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>所属平台</FormLabel>
							{/* TODO 编辑是否只读？ */}
              <Select onValueChange={field.onChange} value={`${field.value}`}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择平台" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {platforms.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>应用描述</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subscribers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>订阅者</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    "手机号，一行一个，例如：\n1234567890\n1234567890"
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="robotDingDingStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>钉钉机器人</FormLabel>
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

        <FormField
          control={form.control}
          name="robotWorkWeixinStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>企微机器人</FormLabel>
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

        <Button className="ml-auto w-full" type="submit" loading={loading}>
          保存
        </Button>
      </form>
    </Form>
  );
}
