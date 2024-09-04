import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@@/tailwind.config";
import { useEffect, useState } from "react";
import useUserStore from "@/stores/user";
import { Role } from "@/types/enum";

const fullConfig = resolveConfig(tailwindConfig);
const {
  theme: { screens },
} = fullConfig;

export function useTailwindBreakpoint(query: keyof typeof screens): boolean {
  const [isMatch, setMatch] = useState<boolean>(false);

  const onChange = (e: MediaQueryListEvent) => setMatch(e.matches);

  useEffect(() => {
    const mediaQuery = `(min-width: ${screens[query]})`;

    const matchQueryList = window.matchMedia(mediaQuery);

    setMatch(matchQueryList.matches);

    matchQueryList.addEventListener("change", onChange);

    return () => matchQueryList.removeEventListener("change", onChange);
  }, [query]);

  return isMatch;
}

export function usePermissionDenied(role?: Role): {
  denied: boolean;
  reason?: string;
} {
  const { user } = useUserStore();

  if (role !== undefined && user?.role && user.role > role) {
    let reason: string = "";

    switch (role) {
      case Role.ADMIN:
        reason = "需要管理员角色才可操作此数据，操作按钮已禁用。";
        break;

      case Role.DEVELOPER:
        reason = "需要开发者角色才可操作此数据，操作按钮已禁用。";

      default:
        break;
    }

    return { denied: true, reason };
  }

  return { denied: false };
}
