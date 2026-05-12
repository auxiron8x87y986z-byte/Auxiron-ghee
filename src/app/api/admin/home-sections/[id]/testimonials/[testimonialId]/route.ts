import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string, testimonialId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const testimonialId = parseInt(resolvedParams.testimonialId);
    const { name, location, review, rating, displayOrder, isActive } = await request.json();

    await prisma.$executeRaw`
      UPDATE Testimonial 
      SET name = ${name}, 
          location = ${location}, 
          review = ${review}, 
          rating = ${rating}, 
          displayOrder = ${displayOrder}, 
          isActive = ${isActive}
      WHERE id = ${testimonialId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string, testimonialId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const testimonialId = parseInt(resolvedParams.testimonialId);
    await prisma.$executeRaw`DELETE FROM Testimonial WHERE id = ${testimonialId}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
