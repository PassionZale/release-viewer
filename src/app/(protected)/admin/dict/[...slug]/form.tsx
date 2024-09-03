"use client";

import { z } from "zod";
import { Dict, DictType } from "./page";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import request from "@/libs/request";
import { ApiException } from "@/libs/utils";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

interface DictFormProps {
  initialData?: Dict;
  dictType?: DictType;
}

const formSchema = z.object({
  id: z.number().or(z.literal("")),
  dictType: z.enum(["systems", "platforms"], {
    required_error: "必填",
  }),
  label: z.string({ required_error: "必填" }).min(1, "必填"),
  value: z.string({ required_error: "必填" }).min(1, "必填"),
});

type FormValue = z.infer<typeof formSchema>;

export default function DictForm({ initialData, dictType }: DictFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const readOnly = Boolean(initialData?.id);

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      dictType: "systems",
      label: "",
      value: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      const { id, label, value } = initialData;

      form.reset({
        id,
        dictType: dictType ?? "systems",
        label,
        value,
      });
    }
  }, [initialData, dictType, form]);

  const onSubmit = async (data: FormValue) => {
    try {
      setLoading(true);

      const { dictType, ...rest } = data;

      const _request = initialData?.id
        ? () =>
            request.put(`/api/${dictType}/${initialData.id}`, { params: rest })
        : () => request.post(`/api/${dictType}`, { params: rest });

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
          name="dictType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>TYPE</FormLabel>
              <FormControl>
                <RadioGroup
                  disabled={readOnly}
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex space-x-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="systems" />
                    </FormControl>
                    <FormLabel className="font-normal">系统</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="platforms" />
                    </FormControl>
                    <FormLabel className="font-normal">平台</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormDescription>一旦创建，类型无法更改</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LABEL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VALUE</FormLabel>
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
