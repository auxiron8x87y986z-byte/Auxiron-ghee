import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const gateways = await prisma.paymentGateway.findMany();
    return NextResponse.json(gateways);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch gateways" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate data structure
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    // Process updates in transaction
    const updates = data.map((gw: any) => 
      prisma.paymentGateway.upsert({
        where: { name: gw.name },
        update: {
          enabled: gw.enabled,
          mode: gw.mode,
          testApiKey: gw.testApiKey,
          testSecret: gw.testSecret,
          liveApiKey: gw.liveApiKey,
          liveSecret: gw.liveSecret,
        },
        create: {
          name: gw.name,
          enabled: gw.enabled,
          mode: gw.mode,
          testApiKey: gw.testApiKey,
          testSecret: gw.testSecret,
          liveApiKey: gw.liveApiKey,
          liveSecret: gw.liveSecret,
        }
      })
    );

    await prisma.$transaction(updates);

    return NextResponse.json({ success: true, message: "Payment settings updated" });
  } catch (error) {
    console.error("Payment Gateway Update Error:", error);
    return NextResponse.json({ error: "Failed to update gateways" }, { status: 500 });
  }
}
