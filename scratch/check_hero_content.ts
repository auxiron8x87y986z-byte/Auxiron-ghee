import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const blocks = await prisma.contentBlock.findMany();
  console.log(JSON.stringify(blocks, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
