const { prisma } = require('./src/lib/prisma');
const bcrypt = require('bcryptjs');

async function test() {
  try {
    const user = await prisma.adminUser.findUnique({
      where: { email: 'admin@auxiron.com' }
    });
    console.log("User found:", !!user);
    if (user) {
      console.log("Password matches:", await bcrypt.compare('admin123', user.password));
    }
  } catch(e) {
    console.error("Prisma error:", e);
  }
}
test().then(() => process.exit(0));
