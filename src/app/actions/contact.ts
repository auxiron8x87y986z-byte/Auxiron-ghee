"use server";

import nodemailer from "nodemailer";
import { getContactSettings } from "./settings";

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const { name, email, subject, message } = data;

    if (!name || !email || !subject || !message) {
      return { success: false, error: "All fields are required" };
    }

    // Fetch dynamic email receiver
    const { settings } = await getContactSettings();
    if (!settings) {
      return { success: false, error: "System configuration missing. Please try again later." };
    }

    const adminEmail = settings.contactEmail;

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // If SMTP credentials aren't fully set, log a warning but pretend success for local testing
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("SMTP credentials not set. Simulated email sending:", data);
      return { success: true, simulated: true };
    }

    // Send the email
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: adminEmail,
      subject: `New Contact Request: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Failed to send contact email:", error);
    return { success: false, error: error.message || "Failed to send message." };
  }
}
