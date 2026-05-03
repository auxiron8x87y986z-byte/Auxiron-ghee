const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

function generateSecret() {
  return crypto.randomBytes(32).toString('base64');
}

const envTemplate = `# Fresh Production Environment Template
# Generated on: ${new Date().toISOString()}

# Database Configuration
# Replace with your production database credentials
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"

# NextAuth Configuration
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="${generateSecret()}"

# App Branding
NEXT_PUBLIC_APP_NAME="Auxiron Ghee"

# Payment Gateways (Configure these in the Admin Panel or here)
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Email Configuration (Nodemailer)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM="noreply@your-domain.com"

# Optional: Add any other production-specific variables below
`;

const outputPath = path.join(process.cwd(), '.env.fresh');
fs.writeFileSync(outputPath, envTemplate);

console.log('---------------------------------------------------------');
console.log('SUCCESS: Fresh environment template generated!');
console.log('File created: .env.fresh');
console.log('---------------------------------------------------------');
console.log('INSTRUCTIONS:');
console.log('1. Copy .env.fresh to .env on your new hosting server.');
console.log('2. Update DATABASE_URL and NEXTAUTH_URL with your production values.');
console.log('3. Your NEXTAUTH_SECRET has been automatically regenerated.');
console.log('4. Run "npx prisma db push" on the new host to initialize the database.');
console.log('5. Run "node seed-admin.js" to create the initial admin user.');
console.log('---------------------------------------------------------');
