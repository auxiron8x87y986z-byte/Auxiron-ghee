import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, location, review, rating, displayOrder, isActive } = await request.json();

    await prisma.$executeRaw`
      INSERT INTO Testimonial (name, location, review, rating, displayOrder, isActive)
      VALUES (${name}, ${location}, ${review}, ${rating}, ${displayOrder}, ${isActive})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
