const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mariadb = require('mariadb');

const rawConnectionString = process.env.DATABASE_URL || 'mysql://root@localhost:3306/auxiron_ghee';
const connectionString = rawConnectionString.replace('mysql://', 'mariadb://');
const pool = mariadb.createPool(connectionString);
const adapter = new PrismaMariaDb(pool);
const prisma = new PrismaClient({ adapter });


async function main() {
  const gateways = ['Razorpay', 'Stripe', 'Paytm'];
  for (const name of gateways) {
    await prisma.PaymentGateway.upsert({
      where: { name },
      update: {},
      create: { 
        name,
        updatedAt: new Date()
      }
    });
  }
  console.log('Seeded Payment Gateways');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
    process.exit(0);
  });
