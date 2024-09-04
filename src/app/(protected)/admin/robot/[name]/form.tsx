import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { usePermissionDenied } from "@/libs/hooks";
import request from "@/libs/request";
import { ApiException } from "@/libs/utils";
import { Role } from "@/types/enum";
import { PrismaModels } from "@/types/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type Robot = Omit<
  PrismaModels["RobotDingDing"] & PrismaModels["RobotWorkWeixin"],
  "id"
>;

interface RobotFormProps {
  name: "dingding" | "workweixin";
  initialData?: Robot;
}

const formSchema = z.object({
  webhook: z.string().url("webhook 不合法"),
  secret: z.string().optional(),
});

type FormValue = z.infer<typeof formSchema>;

export default function RobotForm({ name, initialData }: RobotFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { denied } = usePermissionDenied(Role.DEVELOPER);

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      webhook: "",
      secret: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      const { webhook, secret } = initialData;

      form.reset({
        webhook,
        secret: secret || "",
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: FormValue) => {
    try {
      setLoading(true);

      const { message } = await request.put(`/api/robots/${name}`, {
        params: data,
      });

      setLoading(false);

      toast({ description: message });
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
          name="webhook"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WEBHOOK</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="secret"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SECRET</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
