import { Metadata } from "next";
import LoginForm from "./form";
import { Suspense } from "react";
import { IconGhost2 } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "登录",
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
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;基于 `Nextjs` 所实现的微平台，用于预览所有应用的发布日志。&rdquo;
            </p>
            <footer className="text-sm">Lei Zhang</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">登录</h1>
            <p className="text-sm text-muted-foreground">
              输入用户名和密码登录至管理后台
            </p>
          </div>

          <Suspense>
            <LoginForm />
          </Suspense>

          <p className="px-8 text-center text-sm text-muted-foreground">
            为了便于演示，自动使用访客账号（只读）填充了用户名和密码，你可以直接使用它登录。
          </p>
        </div>
      </div>
    </div>
  );
}
