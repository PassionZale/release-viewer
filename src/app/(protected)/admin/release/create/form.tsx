"use client";

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
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import request from "@/libs/request";
import { useToast } from "@/components/ui/use-toast";
import { ApiException } from "@/libs/utils";
import { useRouter } from "next/navigation";
import { PrismaModels } from "@/types/interface";

type App = PrismaModels["App"] & { pipelines?: PrismaModels["Pipeline"][] };

const formSchema = z.object({
  appPipeline: z.coerce.string({ required_error: "必填" }),
  version: z
    .string()
    .regex(
      /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(\.(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(\+[0-9a-zA-Z-]+(\.[0-9a-zA-Z-]+)*)?$/,
      "版本号必须符合 Semantic versioning，例如：1.1.0"
    ),
  buildId: z
    .string()
    .or(z.literal(""))
    .refine(
      (buildId) => {
        return !buildId || /^[1-9]\d*$/.test(buildId);
      },
      {
        message: "构建号必须为大于 0 的正整数，例如：66",
      }
    )
    .optional(),
  desc: z.string({ required_error: "必填" }).min(1, "必填"),
  previewUrl: z.string().url("预览地址不合法").or(z.literal("")).optional(),
});

type FormValue = z.infer<typeof formSchema>;

export default function ReleaseForm() {
  const [loading, setLoading] = useState(false);
  const [apps, setApps] = useState<App[]>([]);
  const [appPipelineName, setAppPipelineName] = useState<string>();

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appPipeline: "",
      version: "",
      buildId: "",
      desc: "",
      previewUrl: "",
    },
  });

  const appPipelineValue = form.watch("appPipeline");

  useEffect(() => {
    request
      .get<App[]>("/api/apps", {
        params: {
          page: 1,
          pageSize: 100, // 取100个应用...应该够用了吧
          populate: ["pipelines"],
        },
      })
      .then(({ data }) => {
        setApps(data);
      });
  }, []);

  useEffect(() => {
    if (apps.length && appPipelineValue) {
      const [appId, pipelineId] = appPipelineValue.split("-");

      const app = apps.find((app) => app.id === Number(appId))!;

      const pipeline = app.pipelines!.find(
        (pipeline) => pipeline.id === Number(pipelineId)
      )!;

      setAppPipelineName(`${app.name}(${pipeline.name})`);
    } else {
      setAppPipelineName(undefined);
    }
  }, [apps, appPipelineValue]);

  const onChange = (appPipelineValue: string) => {
    if (appPipelineValue) {
      const [appId, pipelineId] = appPipelineValue.split("-");

      const app = apps.find((app) => app.id === Number(appId))!;

      const pipeline = app.pipelines!.find(
        (pipeline) => pipeline.id === Number(pipelineId)
      )!;

      setAppPipelineName(`${app.name}(${pipeline.name})`);
    } else {
      setAppPipelineName(undefined);
    }

    form.setValue("appPipeline", appPipelineValue);
  };

  const onSubmit = async (data: FormValue) => {
    try {
      setLoading(true);

      const { message } = await request.post(`/api/releases`, {
        params: data,
      });

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
          name="appPipeline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>应用流水线</FormLabel>
              <Select onValueChange={onChange} value={`${field.value}`}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      aria-label={field.value}
                      placeholder="选择应用流水线"
                    >
                      {appPipelineName}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {apps.map((app) => (
                    <SelectGroup key={app.id}>
                      <SelectLabel>{app.name}</SelectLabel>
                      {app.pipelines?.length ? (
                        app.pipelines.map((pipeline) => (
                          <SelectItem
                            key={pipeline.id}
                            value={`${app.id}-${pipeline.id}`}
                          >
                            {pipeline.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="-1" disabled>
                          暂无流水线
                        </SelectItem>
                      )}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="version"
          render={({ field }) => (
            <FormItem>
              <FormLabel>版本号</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="buildId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>构建号</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>更新说明</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="previewUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>预览地址</FormLabel>
              <FormControl>
                <Input {...field} />
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
