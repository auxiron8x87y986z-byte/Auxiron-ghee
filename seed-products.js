const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const products = [
    { name: 'Shuddh Deshi Bilona Ghee', description: 'Made with traditional bilona method', price: 3000, volume: '1L', stock: 50 },
    { name: 'Shuddh Deshi Bilona Ghee', description: 'Made with traditional bilona method', price: 6000, volume: '2L', stock: 50 },
    { name: 'Shuddh Deshi Bilona Ghee', description: 'Made with traditional bilona method', price: 9000, volume: '3L', stock: 50 },
    { name: 'Shuddh Deshi Bilona Ghee', description: 'Made with traditional bilona method', price: 11000, volume: '4L', stock: 50 },
    { name: 'Shuddh Deshi Bilona Ghee', description: 'Made with traditional bilona method', price: 13000, volume: '5L', stock: 50 }
  ];

  for (const product of products) {
    await prisma.Product.create({
      data: {
        ...product,
      }
    });
  }
  console.log('Seeded default products');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
