const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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
  });
