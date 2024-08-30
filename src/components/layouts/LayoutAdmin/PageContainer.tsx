"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { IconGhost2 } from "@tabler/icons-react";

export default function PageContainer({
  children,
  scrollable,
  loading,
}: {
  children: React.ReactNode;
  scrollable?: boolean;
  loading?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className="h-[calc(100dvh-52px)]">
          <div className="h-full p-4 md:px-8 relative">
            {children}

            {loading && (
              <div className="absolute flex items-center gap-x-2 top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 z-20 leading-none ">
                <IconGhost2 className={"h-6 w-6 animate-spin mx-auto"} />
                <span>waiting...</span>
              </div>
            )}
          </div>
        </ScrollArea>
      ) : (
        <div className="h-full p-4 md:px-8 relative">
          {children}

          {loading && (
            <div className="absolute flex items-center gap-x-2 top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 z-20 leading-none ">
              <IconGhost2 className={"h-6 w-6 animate-spin mx-auto"} />
              <span>page container waiting...</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
