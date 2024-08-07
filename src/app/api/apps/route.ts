import prisma from "@/lib/prisma";

export async function GET(request: Request) {
	const apps = await prisma.app.findMany()

  return Response.json({ data: apps });
}
