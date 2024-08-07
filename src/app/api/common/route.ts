import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const systems = await prisma.system.findMany();
  const platforms = await prisma.platform.findMany();

  return Response.json({
    data: {
      systems,
      platforms,
    },
  });
}
