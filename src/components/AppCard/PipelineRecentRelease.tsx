import { useParams, useRouter } from "next/navigation";
import { IconChevronRight } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import dayjs from "@/libs/dayjs";
import { Pipeline } from ".";

interface PipelineRecentReleaseProps {
  pipelines?: Pipeline[];
}

export const PipelineRecentRelease = ({
  pipelines,
}: PipelineRecentReleaseProps) => {
  const { value } = useParams();
  const router = useRouter();

  return (
    <>
      {pipelines?.map((pipeline) => (
        <div
          key={pipeline.id}
          className="border-b last:border-none py-4 px-2 flex flex-col space-y-2 cursor-pointer hover:bg-muted/50"
          onClick={() =>
            router.push(`/system/${value}/pipeline/${pipeline.id}`)
          }
        >
          <div className="flex flex-wrap items-center justify-between space-x-2">
            <div className="flex-1 flex items-center space-x-2">
              <Badge className="break-keep" variant={"secondary"}>
                {pipeline.name}
              </Badge>

              {pipeline?.releases?.[0] && (
                <div className="text-sm text-muted-foreground">
                  {pipeline.releases[0].user?.nickname ? (
                    <span className="text-foreground">
                      @{pipeline.releases[0].user.nickname}&nbsp;
                    </span>
                  ) : (
                    <span className="text-foreground">@api&nbsp;</span>
                  )}

                  {dayjs(pipeline.releases[0].createdAt).fromNow()}
                </div>
              )}
            </div>

            {pipeline?.releases?.[0] && (
              <div className="text-sm text-foreground">
                {pipeline.releases[0].version}
                {pipeline.releases[0].buildId
                  ? `(${pipeline.releases[0].buildId})`
                  : null}
              </div>
            )}

            <IconChevronRight className="text-sm" />
          </div>

          {pipeline?.releases?.[0]?.desc && (
            <div className="text-sm text-muted-foreground line-clamp-1">
              {pipeline.releases[0].desc}
            </div>
          )}
        </div>
      ))}
    </>
  );
};
