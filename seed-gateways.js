const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const connectionString = process.env.DATABASE_URL || 'mysql://root@localhost:3306/auxiron_ghee';
const adapter = new PrismaMariaDb(connectionString);
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

main().catch(console.error).finally(() => process.exit(0));
