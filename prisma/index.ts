import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      firstName: 'Alice',
      lastName: 'Tagliatelle',
      email: 'alice@prisma.io',
      password: 'test',
      posts: {
        create: { text: 'Hello World' },
      },
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
