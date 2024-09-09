import { Metadata } from "next";
import Image from "next/image";
import LoginForm from "./form";
import { Suspense } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GuideSteps, Step } from "@/components/GuideSteps";
import {
  IconBrandNextjs,
  IconBrandTailwind,
  IconBrandVercel,
  IconBrandVue,
} from "@tabler/icons-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "登录",
};

export default function Page() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <GuideSteps>
        <p className="text-xl font-bold text-white relative z-20">嗨, 欢迎~ 👋</p>

        <div className="text-neutral-200 mt-4 relative z-20">
          <ul className="list-none mt-2">
            <Step
              title="Release Viewer 是我在 Vercel 上部署的第 10 个应用；"
              icon={<IconBrandVercel className="h-4 w-4 mt-1 flex-shrink-0" />}
            />
            <Step
              title="Release Viewer 通过 Tailwind CSS 所构建；"
              icon={
                <IconBrandTailwind className="h-4 w-4 mt-1 flex-shrink-0" />
              }
            />
            <Step
              title="Release Viewer 是基于 Next.js 所构建的全栈应用；"
              icon={<IconBrandNextjs className="h-4 w-4 mt-1 flex-shrink-0" />}
            />
          </ul>
        </div>

        <p className="text-neutral-300 mt-4 text-sm relative z-20 ">
          我还部署了一些更好玩的应用！
        </p>

        <div className="text-neutral-200 mt-4 relative z-20">
          <ul className="list-none mt-2">
            <Step
              title={
                <Link
                  className="underline"
                  href={"https://www.lovchun.com"}
                  target="_blank"
                >
                  我的博客，基于 `Astro`
                </Link>
              }
              icon={
                <Image
                  src="/images/lei-zhang-blog.png"
                  alt="lovchun.com"
                  height="24"
                  width="24"
                  className="h-4 w-4 mt-1 flex-shrink-0"
                />
              }
            />

            <Step
              title={
                <Link
                  className="underline"
                  href={"https://geist-design.lovchun.com"}
                  target="_blank"
                >
                  我的组件库，基于 `Vuejs`
                </Link>
              }
              icon={
                <IconBrandVue className="text-green-600 h-4 w-4 mt-1 flex-shrink-0" />
              }
            />

            <Step
              title={
                <Link
                  className="underline"
                  href={"https://tsch.lovchun.com"}
                  target="_blank"
                >
                  我的 TS 类型体操
                </Link>
              }
              icon={
                <Image
                  src="/images/lei-zhang-tsch.svg"
                  alt="tsch"
                  height="24"
                  width="24"
                  className="h-4 w-4 mt-1 flex-shrink-0"
                />
              }
            />
          </ul>
        </div>
      </GuideSteps>

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
