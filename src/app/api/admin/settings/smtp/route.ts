import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { smtpHost, smtpPort, smtpUsername, smtpPassword, smtpEncryption, senderEmail, senderName, otpSubject, otpTemplate } = data;

    // We use $queryRaw because the table might not be in the Prisma schema yet
    // or we can use $executeRaw
    
    const existing = await prisma.sMTPSettings.findFirst();
    
    const settingsData = {
      smtpHost,
      smtpPort,
      smtpUsername,
      smtpPassword,
      smtpEncryption,
      senderEmail,
      senderName,
      otpSubject,
      otpTemplate
    };

    if (existing) {
      await prisma.sMTPSettings.update({
        where: { id: existing.id },
        data: settingsData
      });
    } else {
      await prisma.sMTPSettings.create({
        data: settingsData
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SMTP Save Error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
