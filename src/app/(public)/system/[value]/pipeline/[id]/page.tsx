"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import dayjs from "@/libs/dayjs";
import request from "@/libs/request";
import { PrismaModels } from "@/types/interface";
import { IconLink, IconTerminal } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Pipeline = PrismaModels["Pipeline"] & {
  app?: PrismaModels["App"];
  releases?: PrismaModels["Release"][];
};

const PageSkeleton = () => {
  return (
    <Card>
      <CardHeader className="text-center mt-10">
        <Skeleton className="w-[100px] h-6 mx-auto mb-4" />
        <Skeleton className="w-[200px] h-4 mx-auto" />
      </CardHeader>

      <CardContent className="space-y-10 mb-10">
        <div className="flex flex-wrap gap-4 justify-center">
          <Skeleton className="w-[200px] h-4" />
          <Skeleton className="w-[200px] h-4" />
          <Skeleton className="w-[200px] h-4" />
        </div>

        <Skeleton className="w-[160px] h-[160px] mx-auto" />

        <div className="mx-auto space-y-4 w-full md:w-4/5">
          <Skeleton className="w-[200px] h-6" />

          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
        </div>
      </CardContent>
    </Card>
  );
};

const PipelinePreview = ({ pipeline }: { pipeline: Pipeline }) => {
  const { name, previewWebUrl, previewImgUrl, app } = pipeline;

  if (previewImgUrl) {
    return (
      <div className="space-y-4 text-center">
        <div>用手机扫描二维码安装</div>

        <Image
          className="block mx-auto border"
          priority
          src={previewImgUrl}
          alt={`${app?.name ?? "所属应用不存在"}(${name})`}
          width={160}
          height={160}
        />
      </div>
    );
  }

  if (previewWebUrl) {
    return (
      <div className="flex items-center justify-items-center space-x-2 w-full md:w-2/5 mx-auto">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="link" className="sr-only">
            链接
          </Label>
          <Input id="link" defaultValue={previewWebUrl} readOnly />
        </div>
        <Button
          type="submit"
          size="sm"
          className="px-3"
          onClick={() => window.open(previewWebUrl, "_blank")}
        >
          <span className="sr-only">打开链接</span>
          <IconLink className="h-4 w-4" />
        </Button>
      </div>
    );
  }
};

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pipeline, setPipeline] = useState<Pipeline>();

  useEffect(() => {
    if (id) {
      setLoading(true);

      request
        .get<Pipeline>(`/api/system/pipeline/${id}`)
        .then(({ data }) => {
          if (!data) {
            router.replace("/404");
          }

          setPipeline(data);
        })
        .catch()
        .finally(() => setLoading(false));
    }
  }, [id]);

  const latestRelease = useMemo(() => {
    if (pipeline && pipeline.releases?.length) {
      return pipeline.releases[0];
    }

    return null;
  }, [pipeline]);

  return (
    <>
      {loading ? (
        <PageSkeleton />
      ) : (
        pipeline && (
          <Card>
            <CardHeader className="text-center mt-10">
              <CardTitle>{pipeline.app?.name || "所属应用不存在"}</CardTitle>
              <CardDescription>{pipeline.app?.desc}</CardDescription>
            </CardHeader>

            <CardContent className="text-sm text-muted-foreground space-y-10 mb-10">
              <div className="flex flex-wrap gap-4 justify-center text-foreground">
                <Badge>{pipeline.name}</Badge>

                {latestRelease?.version && (
                  <div>
                    版本：{latestRelease?.version}
                    {latestRelease?.buildId
                      ? `(${latestRelease.buildId})`
                      : null}
                  </div>
                )}

                {latestRelease?.createdAt && (
                  <div>
                    更新时间：{dayjs(latestRelease.createdAt).fromNow()}
                  </div>
                )}
              </div>

              <PipelinePreview pipeline={pipeline} />

              <div className="mx-auto space-y-4 w-full md:w-4/5">
                <h4 className="scroll-m-20 text-xl text-foreground font-semibold tracking-tight">
                  发布历史
                </h4>

                <div className="w-full overflow-y-auto">
                  {pipeline.releases?.length ? (
                    <table className="w-full">
                      <tbody>
                        {pipeline.releases.map((release) => (
                          <tr
                            className="m-0 p-0 first:bg-muted"
                            key={release.id}
                          >
                            <td className="px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                              {release.version}
                              {release.buildId ? `(${release.buildId})` : null}
                            </td>
                            <td className="hidden md:block px-4 py-2 text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                              {release.desc || "---"}
                            </td>
                            <td className="px-4 py-2 text-right [&[align=center]]:text-center [&[align=right]]:text-right">
                              {dayjs(release.createdAt).format(
                                "YYYY-MM HH:mm:ss"
                              )}
                            </td>
                            <td className="px-4 py-2 text-right [&[align=center]]:text-center [&[align=right]]:text-right">
                              {release.attachment ? (
                                <Link href={release.attachment} download>
                                  下载附件
                                </Link>
                              ) : (
                                ""
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <Alert>
                      <IconTerminal className="h-4 w-4" />
                      <AlertTitle>暂无记录</AlertTitle>
                      <AlertDescription>
                        你可以提醒项目成员上报发布历史。
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      )}
    </>
  );
}
