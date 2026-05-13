import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const { title, subtitle, content, imageUrl, sectionType, displayOrder, isActive } = await request.json();

    await prisma.homeSection.update({
      where: { id },
      data: {
        title,
        subtitle,
        content,
        imageUrl,
        sectionType,
        displayOrder,
        isActive
      }
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    // We use a transaction to delete everything related
    await prisma.$transaction([
      prisma.homeFeature.deleteMany({ where: { sectionId: id } }),
      prisma.testimonial.deleteMany({ where: { sectionId: id } }),
      prisma.homeSection.delete({ where: { id } })
    ]);

    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
