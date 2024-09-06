import { Metadata } from "next";
import RegisterForm from "./form";
import { Suspense } from "react";
import { IconGhost2 } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "注册管理员",
};

export default function Page() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <IconGhost2 className="mr-2 h-6 w-6" />
          Release Viewer
        </div>
        {/* https://ui.aceternity.com/components/card-spotlight */}
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;基于 `Nextjs`
              所实现的微平台，用于预览所有应用的发布日志。&rdquo;
            </p>
            <footer className="text-sm">Lei Zhang</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              注册管理员
            </h1>

            <p className="text-sm text-muted-foreground">
              注册成功后会自动登录至管理后台
            </p>
          </div>

          <Suspense>
            <RegisterForm />
          </Suspense>

          <p className="text-sm text-muted-foreground">
            由于你是系统上的第一位用户，你将被指定为管理员，其他用户需要被管理员所创建。
          </p>
        </div>
      </div>
    </div>
  );
}
