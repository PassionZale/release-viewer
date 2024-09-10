import { Status } from "@/types/enum";
import { PrismaModels } from "@/types/interface";
import prisma from "../prisma";
import DingdingRobotBot from "./dingding";
import WorkweixinChatBot from "./workweixin";
import dayjs from "../dayjs";

export async function triggerDingdingRobotPush(
  app: PrismaModels["App"],
  pipeline: PrismaModels["Pipeline"],
  release: PrismaModels["Release"] & { user: { nickname: string } | null }
) {
  try {
    if (app.robotDingDingStatus === Status.OFF) {
      return;
    }

    let at = undefined;
    let atMobilesText = "";
    if (app.subscribers) {
      try {
        const atMobiles = app.subscribers
          .split(/[(\r\n)\r\n]+/)
          .filter((item) => !!item);

        if (atMobiles.length) {
          at = {
            atMobiles,
          };

          atMobiles.map((mobile) => (atMobilesText += `@${mobile}`));
        }
      } catch (error) {
        // empty
        console.error("subscribers parsed error", error);
      }
    }

    const buildId = release.buildId ? `(${release.buildId})` : "";
    const releasedBy = release.user ? `@${release.user.nickname}` : `@api}`;

    const text = `
### ${app.name}
		
> *${releasedBy}* 发布于 ${dayjs(release.createdAt).format("HH:mm:ss")}
		
- 流水线：${pipeline.name}
- 版本号：v${release.version}${buildId}
- 更新说明：${release.desc}

${atMobilesText} [👉 前往查看](${process.env.NEXT_PUBLIC_API_BASEURL}/system/${
      app.systemValue
    }/pipeline/${pipeline.id})
`;

    const dingding = await prisma.robotDingDing.findFirst();

    if (!dingding) return;

    const dingdingRobot = new DingdingRobotBot({
      webhook: dingding.webhook,
      secret: dingding.secret,
    });

    dingdingRobot.markdown("新版本已发布", text, at);
  } catch (error) {
    // empty
    console.error("robot push error", error);
  }
}

export async function triggerWorkweixinRobotPush(
  app: PrismaModels["App"],
  pipeline: PrismaModels["Pipeline"],
  release: PrismaModels["Release"] & { user: { nickname: string } | null }
) {
  try {
    if (app.robotWorkWeixinStatus === Status.OFF) {
      return;
    }

    let atMobiles: string[] = [];

    if (app.subscribers) {
      try {
        atMobiles = app.subscribers
          .split(/[(\r\n)\r\n]+/)
          .filter((item) => !!item);
      } catch (error) {
        // empty
        console.error("subscribers parsed error", error);
      }
    }

    const buildId = release.buildId ? `(${release.buildId})` : "";

    const workweixin = await prisma.robotWorkWeixin.findFirst();

    if (!workweixin) return;

    const workweixinRobot = new WorkweixinChatBot(workweixin.webhook);

    workweixinRobot.text(
      `${app.name}(${pipeline.name}) 已更新 ，版本号：v${release.version}${buildId}，更新说明：${release.desc}。👉 前往查看：${process.env.NEXT_PUBLIC_API_BASEURL}/system/${app.systemValue}/pipeline/${pipeline.id}`,
      atMobiles
    );
  } catch (error) {
    // empty
    console.error("robot push error", error);
  }
}
