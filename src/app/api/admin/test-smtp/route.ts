import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendMail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Target email is required" }, { status: 400 });
    }

    const res = await sendMail({
      to: email,
      subject: "SMTP Test Connection - Auxiron",
      body: "<h1>Success!</h1><p>Your SMTP settings are correctly configured and working.</p>"
    });

    if (res.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: (res.error as any)?.message || "Failed to send test email" }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
