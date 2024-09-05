import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@@/tailwind.config";
import { useCallback, useEffect, useState } from "react";
import useUserStore from "@/stores/user";
import { Role } from "@/types/enum";
import { useToast } from "@/components/ui/use-toast";

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

type CopyFn = (text: string) => Promise<boolean>;

type CopiedValue = string | null;

export function useCopyToClipboard(): [CopyFn, CopiedValue] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);
  const { toast } = useToast();

  const copy: CopyFn = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "浏览器不支持 Clipboard",
      });
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      toast({
        description: "复制成功",
      });
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: (error as Error).message,
      });
      setCopiedText(null);
      return false;
    }
  }, []);

  return [copy, copiedText];
}
