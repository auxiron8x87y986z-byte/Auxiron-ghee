const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const gateways = ['Razorpay', 'Stripe', 'Paytm'];
  for (const name of gateways) {
    await prisma.paymentGateway.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }
  console.log('Seeded Payment Gateways');
}

main().catch(console.error).finally(() => process.exit(0));
