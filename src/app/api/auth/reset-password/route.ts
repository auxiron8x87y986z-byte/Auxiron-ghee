import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, otp, password } = await request.json();

    let user = await prisma.$queryRaw`SELECT id, otp_expiry FROM user WHERE email = ${email} AND otp = ${otp}` as any[];
    let table = "user";

    if (user.length === 0) {
      user = await prisma.$queryRaw`SELECT id, otp_expiry FROM adminuser WHERE email = ${email} AND otp = ${otp}` as any[];
      table = "adminuser";
    }
    
    if (user.length === 0) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    const now = new Date();
    const expiry = user[0].otp_expiry ? new Date(user[0].otp_expiry) : new Date(0);

    if (expiry < now) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$executeRawUnsafe(`
      UPDATE ${table} 
      SET password = ?, 
          otp = NULL, 
          otp_expiry = NULL 
      WHERE id = ?
    `, hashedPassword, user[0].id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Reset failed" }, { status: 500 });
  }
}
