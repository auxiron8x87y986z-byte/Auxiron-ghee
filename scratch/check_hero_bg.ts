
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const blocks = await prisma.contentBlock.findMany({
    where: {
      key: {
        in: ['hero_background', 'hero_background_mobile']
      }
    }
  });
  console.log(JSON.stringify(blocks, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
