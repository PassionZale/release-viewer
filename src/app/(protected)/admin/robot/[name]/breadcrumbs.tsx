import { BreadcrumbsProps } from "@/components/Breadcrumbs";

export const breadcrumbs: {
  dingding: BreadcrumbsProps["items"];
  workweixin: BreadcrumbsProps["items"];
} = {
  dingding: [
    { title: "首页", link: "/admin" },
    { title: "钉钉机器人", link: "/admin/robot/dingding" },
  ],
  workweixin: [
    { title: "首页", link: "/admin" },
    { title: "企微机器人", link: "/admin/robot/workweixin" },
  ],
};
