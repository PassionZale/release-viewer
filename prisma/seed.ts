import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const systems = [
  {
    label: "示例",
    value: "sample",
  },
];

const platforms = [
  {
    label: "WEB",
    value: "web",
  },
  {
    label: "IOS",
    value: "ios",
  },
  {
    label: "Android",
    value: "android",
  },
  {
    label: "Miniprogram",
    value: "miniprogram",
  },
  {
    label: "OTHERS",
    value: "others",
  },
];

const apps = [
  {
    name: "lovchun.com-next",
    desc: "Articles & happiness I want to share",
    systemValue: "sample",
    platformValue: "web",
  },
  {
    name: "geist-design",
    desc: "Vue3 Component library @whouu/geist-design",
    systemValue: "sample",
    platformValue: "web",
  },
  {
    name: "type-challenges",
    desc: "TS 类型体操",
    systemValue: "sample",
    platformValue: "web",
  },
];

const pipelines = [
  {
    appId: 1,
    name: "预览地址",
    previewWebUrl: "https://www.lovchun.com",
  },
  {
    appId: 1,
    name: "仓库地址",
    previewWebUrl: "https://github.com/PassionZale/lovchun.com-next",
  },
  {
    appId: 2,
    name: "预览地址",
    previewWebUrl: "https://geist-design.lovchun.com",
  },
  {
    appId: 2,
    name: "仓库地址",
    previewWebUrl: "https://github.com/PassionZale/geist-design",
  },
  {
    appId: 3,
    name: "预览地址",
    previewWebUrl: "https://tsch.lovchun.com",
  },
  {
    appId: 3,
    name: "仓库地址",
    previewWebUrl: "https://github.com/PassionZale/type-challenges",
  },
];

const releases = [
  {
    appId: 1,
    pipelineId: 1,
    version: "0.0.1",
    buildId: null,
    desc: "init repo",
    attachment: "",
  },
  {
    appId: 1,
    pipelineId: 1,
    version: "1.0.0",
    buildId: null,
    desc: "nextjs mdx router & production deploye",
    attachment: "",
  },
  {
    appId: 1,
    pipelineId: 1,
    version: "1.2.0",
    buildId: null,
    desc: "使用 Astro 重构，终于上线 🥳🥳🥳",
    attachment: "",
  },
  {
    appId: 2,
    pipelineId: 3,
    version: "0.0.1",
    buildId: null,
    desc: "组件完成",
    attachment: "",
  },
  {
    appId: 2,
    pipelineId: 3,
    version: "0.0.2",
    buildId: null,
    desc: "vitepress docs",
    attachment: "",
  },
  {
    appId: 2,
    pipelineId: 3,
    version: "1.0.0",
    buildId: null,
    desc: "发布公服，部署文档",
    attachment: "",
  },
  {
    appId: 3,
    pipelineId: 5,
    version: "1.0.0",
    buildId: null,
    desc: "完成 easy 难度的挑战",
    attachment: "",
  },
  {
    appId: 3,
    pipelineId: 5,
    version: "1.1.0",
    buildId: null,
    desc: "完成 medium 难度的挑战",
    attachment: "",
  },
  {
    appId: 3,
    pipelineId: 5,
    version: "1.2.0",
    buildId: null,
    desc: "完成所有难度的挑战",
    attachment: "",
  },
];

async function main() {
  console.log(`Start seeding ...`);

  for (const s of systems) {
    const system = await prisma.system.create({
      data: s,
    });
    console.log(`Created system: ${system.label}`);
  }

  for (const p of platforms) {
    const platform = await prisma.platform.create({
      data: p,
    });
    console.log(`Created platform: ${platform.label}`);
  }

  for (const a of apps) {
    const app = await prisma.app.create({
      data: a,
    });
    console.log(`Created app: ${app.name}`);
  }

  for (const p of pipelines) {
    const pipeline = await prisma.pipeline.create({
      data: p,
    });
    console.log(`Created pipeline: ${pipeline.name}`);
  }

	for (const r of releases) {
		const release = await prisma.release.create({
			data: r
		})

    console.log(`Created release: ${release.desc}`);
	}

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
