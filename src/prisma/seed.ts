import { PrismaClient, RoleUser } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash(process.env.PASSWORD!, 10);

  await prisma.user.create({
    data: {
      fullname: process.env.FULLNAME!,
      phone: process.env.PHONE!,
      password: password,
      role: RoleUser.OWNER,
    },
  });

  console.log('Owner user created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
