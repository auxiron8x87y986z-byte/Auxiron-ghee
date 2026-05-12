import nodemailer from "nodemailer";
import { prisma } from "./prisma";

export async function sendMail({ to, subject, body }: { to: string; subject: string; body: string }) {
  try {
    const settings = await prisma.$queryRaw`SELECT * FROM smtpsettings LIMIT 1` as any[];
    
    if (settings.length === 0) {
      throw new Error("SMTP settings not configured");
    }

    const smtp = settings[0];

    const transporter = nodemailer.createTransport({
      host: smtp.smtpHost,
      port: parseInt(smtp.smtpPort),
      secure: smtp.smtpEncryption === "ssl", // true for 465, false for other ports
      auth: {
        user: smtp.smtpUsername,
        pass: smtp.smtpPassword,
      },
    });

    await transporter.sendMail({
      from: `"${smtp.senderName}" <${smtp.senderEmail}>`,
      to,
      subject,
      html: body,
    });

    return { success: true };
  } catch (error) {
    console.error("Mail Send Error:", error);
    return { success: false, error };
  }
}
