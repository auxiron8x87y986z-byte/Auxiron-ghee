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
    
    const existing = await prisma.$queryRaw`SELECT id FROM smtpsettings LIMIT 1` as any[];
    
    if (existing.length > 0) {
      await prisma.$executeRaw`
        UPDATE smtpsettings 
        SET smtpHost = ${smtpHost}, 
            smtpPort = ${smtpPort}, 
            smtpUsername = ${smtpUsername}, 
            smtpPassword = ${smtpPassword}, 
            smtpEncryption = ${smtpEncryption}, 
            senderEmail = ${senderEmail}, 
            senderName = ${senderName},
            otpSubject = ${otpSubject},
            otpTemplate = ${otpTemplate}
        WHERE id = ${existing[0].id}
      `;
    } else {
      await prisma.$executeRaw`
        INSERT INTO smtpsettings (smtpHost, smtpPort, smtpUsername, smtpPassword, smtpEncryption, senderEmail, senderName, otpSubject, otpTemplate)
        VALUES (${smtpHost}, ${smtpPort}, ${smtpUsername}, ${smtpPassword}, ${smtpEncryption}, ${senderEmail}, ${senderName}, ${otpSubject}, ${otpTemplate})
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SMTP Save Error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
