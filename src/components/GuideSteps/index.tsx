import { CardSpotlight } from "@/components/ui/card-spotlight";
import { IconBrandGithub, IconGhost2 } from "@tabler/icons-react";
import Link from "next/link";
import { PropsWithChildren } from "react";

export function GuideSteps(props: PropsWithChildren) {
  return (
    <CardSpotlight className="rounded-none hidden h-full flex-col text-white lg:flex dark:border-r">
      <div className="flex items-center text-lg font-medium relative z-20">
        <IconGhost2 className="mr-2 h-6 w-6" />
        Release Viewer
      </div>

      <div className="flex-1 flex items-center relative z-20 ">
        <div>{props.children}</div>
      </div>

      <div className="mt-auto relative z-20 ">
        <blockquote className="space-y-2">
          <p className="text-lg">
            &ldquo;基于 `Nextjs`
            所实现的微平台，用于预览所有应用的发布日志。&rdquo;
          </p>
          <footer className="text-sm">
            <Link
              className="mt-4 text-sm flex items-center gap-1"
              href={"https://github.com/PassionZale"}
              target="_blank"
            >
              <IconBrandGithub /> @PassionZale
            </Link>
          </footer>
        </blockquote>
      </div>
    </CardSpotlight>
  );
}

export const Step = ({
  title,
  icon,
}: {
  title: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <li className="flex gap-2 items-start">
      {icon}
      <p className="text-white">{title}</p>
    </li>
  );
};
