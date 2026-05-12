import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Use Raw SQL to find user
    const users = await prisma.$queryRaw`SELECT id, name FROM user WHERE email = ${email} LIMIT 1` as any[];
    let user = users[0];
    let table = "user";

    if (!user) {
      const admins = await prisma.$queryRaw`SELECT id, name FROM adminuser WHERE email = ${email} LIMIT 1` as any[];
      user = admins[0];
      table = "adminuser";
    }

    if (!user) {
      return NextResponse.json({ error: "If an account exists with this email, you will receive an OTP." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Update user with OTP
    await prisma.$executeRawUnsafe(`UPDATE ${table} SET otp = ?, otp_expiry = ? WHERE id = ?`, otp, otpExpiry, user.id);

    // Fetch Template from DB
    const smtpRes = await prisma.$queryRaw`SELECT otpSubject, otpTemplate FROM smtpsettings LIMIT 1` as any[];
    const smtpSettings = smtpRes[0] || {};
    
    const subject = smtpSettings.otpSubject || "Reset Your Password - Auxiron";
    const template = smtpSettings.otpTemplate || `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #c4a484;">Password Reset Request</h2>
        <p>Hello {{name}},</p>
        <p>You requested to reset your password. Use the following OTP to proceed:</p>
        <div style="font-size: 24px; font-weight: bold; color: #c4a484; letter-spacing: 5px; margin: 20px 0;">
          {{otp}}
        </div>
        <p>This OTP is valid for 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

    const body = template.replace("{{otp}}", otp).replace("{{name}}", user.name || "Customer");

    // Send Mail
    const mailRes = await sendMail({
      to: email,
      subject,
      body
    });

    if (!mailRes.success) {
      return NextResponse.json({ error: "Failed to send email. Please try again later." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
