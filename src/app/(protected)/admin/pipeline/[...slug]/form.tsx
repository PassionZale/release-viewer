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

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import request from "@/libs/request";
import { useToast } from "@/components/ui/use-toast";
import { ApiException } from "@/libs/utils";
import { useRouter } from "next/navigation";
import { Pipeline } from "../columns";
import { PrismaModels } from "@/types/interface";
import { ImageUpload, ImageUploadProps } from "@/components/ImageUpload";

interface PipelineFormProps {
  initialData?: Pipeline;
}

const formSchema = z.object({
  id: z.number().or(z.literal("")),
  appId: z.coerce
    .number({ required_error: "必填" })
    .or(z.literal(""))
    .refine((value) => Boolean(value), { message: "必填" }),
  name: z.string({ required_error: "必填" }).min(1, "必填"),
  previewWebUrl: z
    .string()
    .url("previewWebUrl 不合法")
    .or(z.literal(""))
    .optional(),
  previewImgUrl: z
    .string()
    .url("previewImgUrl 不合法")
    .or(z.literal(""))
    .optional(),
});

type FormValue = z.infer<typeof formSchema>;

export default function PipelineForm({ initialData }: PipelineFormProps) {
  const [loading, setLoading] = useState(false);
  const [apps, setApps] = useState<PrismaModels["App"][]>([]);

  const { toast } = useToast();
  const router = useRouter();

  // TODO 权限
  const readOnly = Boolean(initialData?.id);

  useEffect(() => {
    request
      .get<PrismaModels["App"][]>("/api/apps", {
        params: {
          page: 1,
          pageSize: 100, // 取100个应用...应该够用了吧
        },
      })
      .then(({ data }) => {
        setApps(data);
      });
  }, []);

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      appId: "",
      name: "",
      previewWebUrl: "",
      previewImgUrl: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      const { id, appId, name, previewWebUrl, previewImgUrl } = initialData;

      form.reset({
        id,
        appId: appId || "",
        name,
        previewWebUrl: previewWebUrl || "",
        previewImgUrl: previewImgUrl || "",
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: FormValue) => {
    try {
      setLoading(true);

      const _request = initialData?.id
        ? () =>
            request.put(`/api/pipelines/${initialData.id}`, { params: data })
        : () => request.post(`/api/pipelines`, { params: data });

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

  const onUploadError: ImageUploadProps["onError"] = (error) => {
    form.setError("previewImgUrl", { type: "custom", message: error.message });
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
          name="appId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>所属应用</FormLabel>
              <Select onValueChange={field.onChange} value={`${field.value}`}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择应用" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {apps.map((item) => (
                    <SelectItem key={item.id} value={`${item.id}`}>
                      {item.name}
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>流水线名称</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="previewWebUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>访问地址</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="previewImgUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>图片地址</FormLabel>
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

        <Button className="ml-auto w-full" type="submit" loading={loading}>
          保存
        </Button>
      </form>
    </Form>
  );
}
