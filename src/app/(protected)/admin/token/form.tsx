"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ApiException, cn } from "@/libs/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconCalendar, IconCopy, IconRestore } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import request from "@/libs/request";
import { useCopyToClipboard, usePermissionDenied } from "@/libs/hooks";
import { Role } from "@/types/enum";

const formSchema = z.object({
  name: z.string({ required_error: "名称不能为空" }).min(1, "名称不能为空"),
  expiresAt: z.coerce
    .date({ required_error: "过期日期格式必须为 YYYY-MM-DD" })
    .optional(),
});

type FormValue = z.infer<typeof formSchema>;

export default function TokenForm(props: { onSuccess?: () => void }) {
  const { toast } = useToast();

  const [copy] = useCopyToClipboard();

  const { denied } = usePermissionDenied(Role.DEVELOPER);

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const [accessKey, setAccessKey] = useState<string>();
  const [loading, setLoading] = useState(false);

  const encryptAccessKey = useMemo(() => {
    if (accessKey) {
      const prefix = accessKey.slice(0, 4);
      const suffix = accessKey.slice(-4);

      return `${prefix}****${suffix}`;
    }

    return undefined;
  }, [accessKey]);

  const onSubmit = async (data: FormValue) => {
    try {
      setLoading(true);

      const { data: accessKey } = await request.post<string>("/api/tokens", {
        params: data,
      });

      setLoading(false);
      setAccessKey(accessKey);
      form.reset();
      props.onSuccess?.();
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
      <div
        className={cn(
          !encryptAccessKey && "hidden",
          "w-full sm:w-[400px] space-y-2 border rounded-lg shadow-inner p-4"
        )}
      >
        <Label>你的新访问令牌</Label>
        <Button
          onClick={() => copy(accessKey!)}
          variant={"outline"}
          className={cn(
            "w-full pl-3 text-left font-normal",
            !accessKey && "text-muted-foreground"
          )}
        >
          {encryptAccessKey ?? "访问令牌"}
          <IconCopy className="ml-auto block h-4 w-4 opacity-50" />
        </Button>
        <p className="text-sm text-muted-foreground">
          请确保妥善保存它，你无法再次访问它的内容。
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full sm:w-[400px] space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>名称</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expiresAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>到期时间（可选）</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "yyyy-MM-dd")
                      ) : (
                        <span>YYYY-MM-DD</span>
                      )}
                      <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    locale={zhCN}
                    footer={
                      <div
                        className="pt-3 text-right"
                        onClick={() => field.onChange(undefined)}
                      >
                        <Button variant="ghost" className="h-8 px-2 lg:px-3">
                          重置
                          <IconRestore className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>若不设置，将永久有效。</FormDescription>
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
          创建访问令牌
        </Button>
      </form>
    </Form>
  );
}
