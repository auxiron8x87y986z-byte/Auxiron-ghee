import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string, featureId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const featureId = parseInt(resolvedParams.featureId);
    const { title, icon, description, displayOrder, isActive } = await request.json();

    await prisma.$executeRaw`
      UPDATE homefeature 
      SET title = ${title}, 
          icon = ${icon}, 
          description = ${description}, 
          displayOrder = ${displayOrder}, 
          isActive = ${isActive}
      WHERE id = ${featureId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string, featureId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const featureId = parseInt(resolvedParams.featureId);
    await prisma.$executeRaw`DELETE FROM HomeFeature WHERE id = ${featureId}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
