import prisma from "@/libs/prisma";

export async function GET(request: Request) {
	const apps = await prisma.app.findMany()

  return Response.json({ data: apps });
}
