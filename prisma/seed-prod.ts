import { PrismaClient } from "@prisma/client";
import { Role } from "../src/types/enum";
import { encrypt } from "../src/libs/bcrypt";

const prisma = new PrismaClient();

const systems = [
  {
    label: "演示项目",
    value: "sample",
  },
  {
    label: "购物中心",
    value: "mall",
  },
  {
    label: "品牌百货",
    value: "store",
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

const users = [
  // admin user
  {
    nickname: "张磊",
    username: "zhanglei",
    hashedPassword: encrypt("zhanglei@2024"),
    role: Role.ADMIN,
  },
  // invite user
  {
    nickname: "叶俊纯",
    username: "yejunchun",
    hashedPassword: encrypt("yejunchun"),
    role: Role.ADMIN,
  },
  {
    nickname: "金财牛皮",
    username: "wangjincai",
    hashedPassword: encrypt("wangjincai"),
    role: Role.ADMIN,
  },
  // api user
  {
    nickname: "API",
    username: "API",
    hashedPassword: "Special API user and can never be logged in :)",
    role: Role.DEVELOPER,
  },
	{
		nickname: "紫薯布丁",
		username: "haha",
		hashedPassword: encrypt("haha"),
		role: Role.ADMIN
	},
  // visitor user
  {
    nickname: "visitor",
    username: "visitor",
    hashedPassword: encrypt("visitor"),
    role: Role.VISITOR,
  },
];

const apps = [
  {
    // 1
    name: "lovchun.com-next",
    desc: "Articles & happiness I want to share",
    systemValue: "sample",
    platformValue: "web",
  },
  {
    // 2
    name: "geist-design",
    desc: "Vue3 Component library @whouu/geist-design",
    systemValue: "sample",
    platformValue: "web",
  },
  {
    // 3
    name: "type-challenges",
    desc: "TS 类型体操",
    systemValue: "sample",
    platformValue: "web",
  },
  {
    // 4
    name: "天虹小程序",
    desc: "天虹购物中心 小程序",
    systemValue: "mall",
    platformValue: "miniprogram",
  },
  {
    // 5
    name: "天虹 Android APP",
    desc: "天虹购物中心 APP",
    systemValue: "mall",
    platformValue: "android",
  },
  {
    // 6
    name: "天虹 IOS APP",
    desc: "天虹购物中心 APP",
    systemValue: "mall",
    platformValue: "ios",
  },
  {
    // 7
    name: "灵智数字店",
    desc: "包含顾客/导购端",
    systemValue: "store",
    platformValue: "miniprogram",
  },
  {
    // 8
    name: "俊纯专卖店",
    desc: "金财牛皮",
    systemValue: "store",
    platformValue: "miniprogram",
  },
  {
    // 9
    name: "金财直营店",
    desc: "《金财不卖假货店》的租户后台",
    systemValue: "store",
    platformValue: "web",
  },
];

const pipelines = [
  {
		// 1
    appId: 1,
    name: "预览地址",
    previewWebUrl: "https://www.lovchun.com",
  },
  {
		// 2
    appId: 1,
    name: "仓库地址",
    previewWebUrl: "https://github.com/PassionZale/lovchun.com-next",
  },
  {
		// 3
    appId: 2,
    name: "预览地址",
    previewWebUrl: "https://geist-design.lovchun.com",
  },
  {
		// 4
    appId: 2,
    name: "仓库地址",
    previewWebUrl: "https://github.com/PassionZale/geist-design",
  },
  {
		// 5
    appId: 3,
    name: "预览地址",
    previewWebUrl: "https://tsch.lovchun.com",
  },
  {
		// 6
    appId: 3,
    name: "仓库地址",
    previewWebUrl: "https://github.com/PassionZale/type-challenges",
  },
  {
		// 7
    appId: 4,
    name: "开发环境",
    previewImgUrl: "/images/default-qrcode.png",
  },
  {
		// 8
    appId: 4,
    name: "测试环境",
    previewImgUrl: "/images/default-qrcode.png",
  },
  {
		// 9
    appId: 4,
    name: "预发布环境",
    previewImgUrl: "/images/default-qrcode.png",
  },
  {
		// 10
    appId: 4,
    name: "生产环境",
    previewImgUrl: "/images/default-qrcode.png",
  },
  {
		// 11
    appId: 5,
    name: "开发环境",
    previewImgUrl: "/images/default-qrcode.png",
  },
  {
		// 12
    appId: 5,
    name: "测试环境",
    previewImgUrl: "/images/default-qrcode.png",
  },
  {
		// 13
    appId: 5,
    name: "预发布环境",
    previewImgUrl: "/images/default-qrcode.png",
  },
  {
		// 14
    appId: 5,
    name: "生产环境",
    previewImgUrl: "/images/default-qrcode.png",
  },
  {
		// 15
    appId: 6,
    name: "开发环境",
    previewImgUrl: "/images/default-qrcode.png",
  },
  {
		// 16
    appId: 6,
    name: "测试环境",
    previewImgUrl: "/images/default-qrcode.png",
  },
  {
		// 17
    appId: 6,
    name: "预发布环境",
    previewImgUrl: "/images/default-qrcode.png",
  },
  {
		// 18
    appId: 6,
    name: "生产环境",
    previewImgUrl: "/images/default-qrcode.png",
  },
  {
		// 19
    appId: 7,
    name: "开发环境",
    previewImgUrl: "/images/default-qrcode.png",
  },
  {
		// 20
    appId: 7,
    name: "测试环境",
    previewImgUrl: "/images/default-qrcode.png",
  },
  {
		// 21
    appId: 7,
    name: "预发布环境",
    previewImgUrl: "/images/default-qrcode.png",
  },
  {
		// 22
    appId: 7,
    name: "生产环境",
    previewImgUrl: "/images/default-qrcode.png",
  },
  {
		// 23
    appId: 8,
    name: "开发环境",
    previewImgUrl: "/images/default-qrcode.png",
  },
  {
		// 24
    appId: 8,
    name: "测试环境",
    previewImgUrl: "/images/default-qrcode.png",
  },
  {
		// 25
    appId: 8,
    name: "预发布环境",
    previewImgUrl: "/images/default-qrcode.png",
  },
  {
		// 26
    appId: 8,
    name: "生产环境",
    previewImgUrl: "/images/default-qrcode.png",
  },
  {
		// 27
    appId: 9,
    name: "开发环境",
    previewWebUrl: "https://www.lovchun.com",
  },
  {
		// 28
    appId: 9,
    name: "测试环境",
    previewWebUrl: "https://www.lovchun.com",
  },
  {
		// 29
    appId: 9,
    name: "预发布环境",
    previewWebUrl: "https://www.lovchun.com",
  },
  {
		// 30
    appId: 9,
    name: "生产环境",
    previewWebUrl: "https://www.lovchun.com",
  },
];

const releases = [
  {
    appId: 1,
    pipelineId: 1,
    userId: 1,
    version: "0.0.1",
    buildId: null,
    desc: "MDX support",
    attachment: "",
  },
  {
    appId: 1,
    pipelineId: 1,
    userId: 1,
    version: "1.0.0",
    buildId: null,
    desc: "nextjs mdx router & production deploye",
    attachment: "",
  },
  {
    appId: 1,
    pipelineId: 1,
    userId: 1,
    version: "1.2.0",
    buildId: null,
    desc: "使用 Astro 重构，终于上线 🥳🥳🥳",
    attachment: "",
  },
	{
    appId: 2,
    pipelineId: 3,
    userId: 1,
    version: "0.0.1",
    buildId: null,
    desc: "组件完成",
    attachment: "",
  },
	{
    appId: 2,
    pipelineId: 3,
    userId: 1,
    version: "0.0.2",
    buildId: null,
    desc: "vitepress docs",
    attachment: "",
  },
	{
    appId: 2,
    pipelineId: 3,
    userId: 1,
    version: "1.0.0",
    buildId: null,
    desc: "发布公服，部署文档。",
    attachment: "",
  },
	{
    appId: 3,
    pipelineId: 5,
    userId: 1,
    version: "1.0.0",
    buildId: null,
    desc: "完成 easy 难度的挑战",
    attachment: "",
  },
	{
    appId: 3,
    pipelineId: 5,
    userId: 1,
    version: "1.1.0",
    buildId: null,
    desc: "完成 medium 难度的挑战",
    attachment: "",
  },
	{
    appId: 3,
    pipelineId: 5,
    userId: 1,
    version: "1.2.0",
    buildId: null,
    desc: "完成所有难度的挑战",
    attachment: "",
  },
	{
    appId: 4,
    pipelineId: 7,
    userId: 2,
    version: "1.1.0",
    buildId: null,
    desc: "第一次 CV 代码",
    attachment: "",
  },
	{
    appId: 4,
    pipelineId: 7,
    userId: 2,
    version: "1.1.0",
    buildId: null,
    desc: "联调某个沙雕需求",
    attachment: "/images/default-attachment.zip",
  },
	{
    appId: 4,
    pipelineId: 8,
    userId: 2,
    version: "1.1.0",
    buildId: null,
    desc: "积分商城提测",
    attachment: "/images/default-attachment.zip",
  },
	{
    appId: 4,
    pipelineId: 9,
    userId: 2,
    version: "1.1.0",
    buildId: null,
    desc: "积分商城 UAT 发布",
    attachment: "/images/default-attachment.zip",
  },
	{
    appId: 4,
    pipelineId: 10,
    userId: 2,
    version: "1.1.0",
    buildId: null,
    desc: "积分商城",
    attachment: "/images/default-attachment.zip",
  },

	{
    appId: 5,
    pipelineId: 11,
    userId: 3,
    version: "1.1.0",
    buildId: null,
    desc: "第一次 CV 代码",
    attachment: "/images/default-attachment.zip",
  },
	{
    appId: 5,
    pipelineId: 11,
    userId: 3,
    version: "1.1.0",
    buildId: null,
    desc: "联调某个沙雕需求",
    attachment: "/images/default-attachment.zip",
  },
	{
    appId: 5,
    pipelineId: 12,
    userId: 3,
    version: "1.1.0",
    buildId: null,
    desc: "积分商城提测",
    attachment: "/images/default-attachment.zip",
  },
	{
    appId: 5,
    pipelineId: 13,
    userId: 3,
    version: "1.1.0",
    buildId: null,
    desc: "积分商城 UAT 发布",
    attachment: "/images/default-attachment.zip",
  },
	{
    appId: 5,
    pipelineId: 14,
    userId: 3,
    version: "1.1.0",
    buildId: null,
    desc: "积分商城",
    attachment: "/images/default-attachment.zip",
  },
	{
    appId: 6,
    pipelineId: 15,
    userId: 4,
    version: "1.1.0",
    buildId: null,
    desc: "紫薯布丁",
    attachment: "",
  },
	{
    appId: 6,
    pipelineId: 16,
    userId: 4,
    version: "1.1.0",
    buildId: null,
    desc: "紫薯布丁",
    attachment: "",
  },
	{
    appId: 6,
    pipelineId: 17,
    userId: 4,
    version: "1.1.0",
    buildId: null,
    desc: "紫薯布丁",
    attachment: "",
  },
	{
    appId: 6,
    pipelineId: 18,
    userId: 4,
    version: "1.1.0",
    buildId: null,
    desc: "紫薯布丁",
    attachment: "",
  },
	{
    appId: 7,
    pipelineId: 19,
    userId: 2,
    version: "1.1.0",
    buildId: null,
    desc: "紫薯布丁",
    attachment: "",
  },
	{
    appId: 7,
    pipelineId: 20,
    userId: 2,
    version: "1.1.0",
    buildId: null,
    desc: "紫薯布丁",
    attachment: "",
  },
	{
    appId: 7,
    pipelineId: 21,
    userId: 2,
    version: "1.1.0",
    buildId: null,
    desc: "紫薯布丁",
    attachment: "",
  },
	{
    appId: 7,
    pipelineId: 22,
    userId: 2,
    version: "1.1.0",
    buildId: null,
    desc: "紫薯布丁",
    attachment: "",
  },
	{
    appId: 8,
    pipelineId: 23,
    userId: 2,
    version: "1.1.0",
    buildId: null,
    desc: "紫薯布丁",
    attachment: "",
  },
	{
    appId: 8,
    pipelineId: 24,
    userId: 2,
    version: "1.1.0",
    buildId: null,
    desc: "紫薯布丁",
    attachment: "",
  },
	{
    appId: 8,
    pipelineId: 25,
    userId: 2,
    version: "1.1.0",
    buildId: null,
    desc: "紫薯布丁",
    attachment: "",
  },
	{
    appId: 8,
    pipelineId: 26,
    userId: 2,
    version: "1.1.0",
    buildId: null,
    desc: "紫薯布丁",
    attachment: "",
  },
	{
    appId: 9,
    pipelineId: 27,
    userId: 3,
    version: "1.1.0",
    buildId: null,
    desc: "紫薯布丁",
    attachment: "",
  },
	{
    appId: 9,
    pipelineId: 28,
    userId: 3,
    version: "1.1.0",
    buildId: null,
    desc: "紫薯布丁",
    attachment: "",
  },
	{
    appId: 9,
    pipelineId: 29,
    userId: 3,
    version: "1.1.0",
    buildId: null,
    desc: "紫薯布丁",
    attachment: "",
  },
	{
    appId: 9,
    pipelineId: 30,
    userId: 3,
    version: "1.1.0",
    buildId: null,
    desc: "紫薯布丁",
    attachment: "",
  },
];

async function main() {
  console.log(`Start seeding ...`);

  for (const u of users) {
    const user = await prisma.user.create({ data: u });
    console.log(`Created user with id: ${user.id}`);
  }

  for (const s of systems) {
    const system = await prisma.system.create({
      data: s,
    });
    console.log(`Created system with id: ${system.id}`);
  }

  for (const p of platforms) {
    const platform = await prisma.platform.create({
      data: p,
    });
    console.log(`Created platform with id: ${platform.id}`);
  }

  for (const a of apps) {
    const app = await prisma.app.create({
      data: a,
    });
    console.log(`Created app with id: ${app.id}`);
  }

  for (const p of pipelines) {
    const pipeline = await prisma.pipeline.create({
      data: p,
    });
    console.log(`Created pipeline with id: ${pipeline.id}`);
  }

	for (const r of releases) {
		const release = await prisma.release.create({
			data: r
		})

    console.log(`Created release with id: ${release.id}`);
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
