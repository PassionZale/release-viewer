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
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import request from "@/libs/request";
import { useToast } from "@/components/ui/use-toast";
import { ApiException } from "@/libs/utils";
import { PrismaModels } from "@/types/interface";
import { ToastAction } from "@/components/ui/toast";
import { usePermissionDenied } from "@/libs/hooks";
import { Role } from "@/types/enum";

const count = 200;
const defaults = {
  origin: { y: 0.7 },
};

function fire(particleRatio: number, opts?: confetti.Options) {
  return confetti({
    ...defaults,
    ...opts,
    particleCount: Math.floor(count * particleRatio),
  });
}

function triggerConfetti() {
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  return fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

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
  attachment: z
    .unknown()
    .transform((value) => value as File | null | undefined)
    .refine((file) => file && file.size > 0, "附件不能为空")
    .refine(
      (file) =>
        file &&
        [
          "application/zip",
          "application/vnd.android.package-archive",
          "application/iphone-package-archive",
        ].includes(file.type),
      "附件只支持 apk,ipa,zip 格式"
    )
    .refine((file) => file && file.size < 208 * 1024 * 1024, {
      message: "附件必须小于 208MB.",
    })
    .optional(),
});

type FormValue = z.infer<typeof formSchema>;

export default function ReleaseForm() {
  const [loading, setLoading] = useState(false);
  const [apps, setApps] = useState<App[]>([]);
  const [appPipelineName, setAppPipelineName] = useState<string>();
  const { denied } = usePermissionDenied(Role.DEVELOPER);
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appPipeline: "",
      version: "",
      buildId: "",
      desc: "",
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

  const onView = (release: PrismaModels["Release"]) => {
    const { appId, pipelineId } = release;

    const app = apps.find((app) => app.id === appId);

    if (app?.systemValue && pipelineId) {
      router.push(`/system/${app.systemValue}/pipeline/${pipelineId}`);
    }
  };

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

      const { appPipeline, attachment, ...rest } = data;

      const [appId, pipelineId] = appPipeline.split("-");

      let uploadPath: string | undefined = undefined;

      if (attachment) {
        const formData = new FormData();

        formData.append("file", attachment);

        const { data } = await request.post<string>(`/api/releases/upload`, {
          params: formData,
        });

        uploadPath = data;
      }

      const { data: release } = await request.post<PrismaModels["Release"]>(
        `/api/releases`,
        {
          params: {
            appId,
            pipelineId,
            attachment: uploadPath,
            ...rest,
          },
        }
      );

      setLoading(false);

      triggerConfetti();

      toast({
        title: "发布成功！",
        description: "应用版本已更新。",
        action: (
          <ToastAction altText="查看" onClick={() => onView(release)}>
            查看
          </ToastAction>
        ),
      });

      form.reset();
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
              <FormLabel>构建号（可选）</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                如果发布的应用为 Android 或 IOS，可以通过它自定义构建号。
              </FormDescription>
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
          name="attachment"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>附件（可选）</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".apk,.ipa,.zip"
                  onChange={(e) =>
                    onChange(e.target.files && e.target.files[0])
                  }
                  {...fieldProps}
                />
              </FormControl>
              <FormDescription>
                支持 .apk,.ipa,.zip 三种文件格式，最大 208MB。
              </FormDescription>
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
