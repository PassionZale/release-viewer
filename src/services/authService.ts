import prisma from "@/lib/prisma";
import { verify } from "@/lib/bcrypt";

export async function authenticate(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (user && user.status !== 1 && verify(password, user.hashedPassword)) {
    const { hashedPassword, ...rest } = user;

    return { user: rest };
  }
}
