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

async function main() {
  console.log(`Start seeding ...`);

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
