import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const sectionId = parseInt(resolvedParams.id);
    const { name, location, review, rating, displayOrder, isActive } = await request.json();

    await prisma.$executeRaw`
      INSERT INTO Testimonial (sectionId, name, location, review, rating, displayOrder, isActive)
      VALUES (${sectionId}, ${name}, ${location}, ${review}, ${rating}, ${displayOrder}, ${isActive})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
