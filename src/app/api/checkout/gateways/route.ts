import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const gateways = await prisma.PaymentGateway.findMany({
      where: { enabled: true },
      select: { name: true } // Only select the name, DO NOT expose keys
    });
    return NextResponse.json(gateways.map(g => g.name));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch gateways" }, { status: 500 });
  }
}
