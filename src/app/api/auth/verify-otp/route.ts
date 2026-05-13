import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    // Try finding in User first
    const users = await prisma.$queryRaw`SELECT id, otp_expiry, isVerified FROM user WHERE email = ${email} AND otp = ${otp} LIMIT 1` as any[];
    
    let dbUser = users[0];
    let isAdmin = false;

    if (!dbUser) {
      const admins = await prisma.$queryRaw`SELECT id, otp_expiry FROM adminuser WHERE email = ${email} AND otp = ${otp} LIMIT 1` as any[];
      dbUser = admins[0];
      isAdmin = true;
    }
    
    if (!dbUser) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    const now = new Date();
    const expiry = dbUser.otp_expiry ? new Date(dbUser.otp_expiry) : new Date(0);

    if (expiry < now) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    // If it's a regular user, mark as verified
    if (!isAdmin && !dbUser.isVerified) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          isVerified: true,
          otp: null,
          otp_expiry: null
        }
      });
    } 
    // Note: We don't clear the OTP here for Admins or verified Users 
    // because this route is used as a preliminary check in the forgot-password flow.
    // The final password reset route will verify the OTP again and clear it.

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 });
  }
}
