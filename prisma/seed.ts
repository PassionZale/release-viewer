import { PrismaClient } from "@prisma/client";
import { Role } from "../src/types/enum";
import { encrypt } from "../src/libs/bcrypt";

const prisma = new PrismaClient();

const systems = [
  {
    label: "中台",
    value: "zhongtai",
  },
  {
    label: "C端",
    value: "2c",
  },
  {
    label: "B端",
    value: "2b",
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
    nickname: "admin",
    username: process.env.DASHBOARD_ADMIN_USERNAME || "admin",
    hashedPassword: encrypt(process.env.DASHBOARD_ADMIN_PASSWORD || "admin"),
    role: Role.ADMIN,
  },
  // api user
  {
    nickname: "API",
    username: "API",
    hashedPassword: "Special API user and can never be logged in :)",
    role: Role.DEVELOPER,
  },
  // visitor user
  {
    nickname: "visitor",
    username: "visitor",
    hashedPassword: encrypt("visitor"),
    role: Role.VISITOR,
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
