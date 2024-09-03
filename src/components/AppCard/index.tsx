import { PrismaModels } from "@/types/interface";
import { Skeleton } from "@/components/ui/skeleton";
import { IconTimeline } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PlatformIcon from "@/components/PlatformIcon";
import { PipelineRecentRelease } from "./PipelineRecentRelease";

export type Release = PrismaModels["Release"] & {
  user?: { nickname: string };
};

export type Pipeline = PrismaModels["Pipeline"] & {
  releases?: [Release];
};

export type App = PrismaModels["App"] & {
  platform?: PrismaModels["Platform"];
  system?: PrismaModels["System"];
  pipelines?: Pipeline[];
};

export interface AppCardProps {
  app: App;
}

export const AppCardSkeleton = () => {
  return (
    <>
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>

      <div className="flex flex-col space-y-3 mb-4">
        <div className="flex space-x-3">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 flex-1" />
        </div>

        <div className="flex space-x-3">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 flex-1" />
        </div>

        <div className="flex space-x-3">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 flex-1" />
        </div>
      </div>
    </>
  );
};

export const AppCard = ({ app }: AppCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{app.name}</CardTitle>

        {app.platform && (
          <Badge variant="secondary">
            <PlatformIcon value={app.platformValue} />
            &nbsp;
            {app.platform.label}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">{app?.desc}</p>

        <div className="flex flex-col">
          <p className="flex items-center text-sm font-medium leading-none my-4">
            <IconTimeline />
            &nbsp; 最近更新
          </p>

          {app.pipelines?.length ? (
            <PipelineRecentRelease pipelines={app.pipelines} />
          ) : (
            <p className="text-sm text-muted-foreground">暂无数据</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
