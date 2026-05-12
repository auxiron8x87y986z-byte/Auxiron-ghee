import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendMail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if email already exists in AdminUser
    const existingAdmin = await prisma.$queryRaw`SELECT id FROM adminuser WHERE email = ${email} LIMIT 1` as any[];
    if (existingAdmin.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Check if user already exists and is verified
    const existingUser = await prisma.$queryRaw`SELECT id, isVerified FROM user WHERE email = ${email} LIMIT 1` as any[];
    
    if (existingUser.length > 0 && existingUser[0].isVerified) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    if (existingUser.length > 0) {
      // Update existing unverified user
      await prisma.$executeRaw`
        UPDATE user 
        SET name = ${name}, password = ${hashedPassword}, otp = ${otp}, otp_expiry = ${otpExpiry} 
        WHERE id = ${existingUser[0].id}
      `;
    } else {
      // Create new unverified user
      await prisma.$executeRaw`
        INSERT INTO user (name, email, password, isVerified, otp, otp_expiry) 
        VALUES (${name}, ${email}, ${hashedPassword}, 0, ${otp}, ${otpExpiry})
      `;
    }

    // Fetch SMTP Settings for Signup OTP
    const smtpRes = await prisma.$queryRaw`SELECT otpSubject, otpTemplate, senderName FROM smtpsettings LIMIT 1` as any[];
    const smtp = smtpRes[0] || {};
    
    const subject = smtp.otpSubject || "Verify Your Account - Auxiron";
    const template = smtp.otpTemplate || `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
        <h2 style="color: #c4a484; text-align: center;">Welcome to Auxiron!</h2>
        <p>Hello <strong>{{name}}</strong>,</p>
        <p>Thank you for signing up. To complete your registration, please use the following One-Time Password (OTP):</p>
        <div style="font-size: 32px; font-weight: bold; color: #c4a484; letter-spacing: 8px; margin: 30px 0; text-align: center; background: #fdfaf7; padding: 15px; border-radius: 5px;">
          {{otp}}
        </div>
        <p style="font-size: 0.9rem; color: #666;">This OTP is valid for 15 minutes. If you didn't request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 0.8rem; color: #999; text-align: center;">© 2026 Auxiron Ghee. All rights reserved.</p>
      </div>
    `;

    const body = template.replace("{{otp}}", otp).replace("{{name}}", name);

    await sendMail({
      to: email,
      subject,
      body
    });

    return NextResponse.json({ success: true, message: "OTP sent to your email" });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: error.message || "Failed to process signup" }, { status: 500 });
  }
}
