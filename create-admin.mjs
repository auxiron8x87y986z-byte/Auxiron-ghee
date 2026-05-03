import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);
  const user = await prisma.adminUser.upsert({
    where: { email: 'admin@auxiron.com' },
    update: { password },
    create: {
      email: 'admin@auxiron.com',
      password,
    },
  });
  console.log('Admin created/updated:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
