import { encrypt } from "../src/lib/bcrypt";
import { PrismaClient } from "@prisma/client";

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
    label: "Others",
    value: "others",
  },
];

const AdminUser = {
  nickname: "admin",
  username: process.env.DASHBOARD_ADMIN_USERNAME || "admin",
  hashedPassword: encrypt(process.env.DASHBOARD_ADMIN_PASSWORD || "admin"),
  role: 1,
};

const ApiUser = {
  nickname: "API",
  username: "API",
  hashedPassword: "Special API user and can never be logged in :)",
  role: 2,
};

async function main() {
  console.log(`Start seeding ...`);

  await prisma.user.create({ data: AdminUser });
  console.log(`Created admin user`);

  await prisma.user.create({ data: ApiUser });
  console.log(`Created api user`);

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
