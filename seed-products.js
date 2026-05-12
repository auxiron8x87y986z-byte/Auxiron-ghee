const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mariadb = require('mariadb');

const connectionString = process.env.DATABASE_URL || 'mysql://root@localhost:3306/auxiron_ghee';
const adapter = new PrismaMariaDb(connectionString);
const prisma = new PrismaClient({ adapter });

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
        updatedAt: new Date()
      }
    });
  }
  console.log('Seeded default products');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
