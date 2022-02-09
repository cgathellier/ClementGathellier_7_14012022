import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'Groupomania',
      email: 'admin@groupomania.com',
      password: 'admin123',
      admin: true,
    },
  });

  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });
  console.dir(allUsers, { depth: null });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
