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

    await prisma.$executeRaw`
      UPDATE homesection 
      SET title = ${title}, 
          subtitle = ${subtitle}, 
          content = ${content}, 
          imageUrl = ${imageUrl}, 
          sectionType = ${sectionType}, 
          displayOrder = ${displayOrder}, 
          isActive = ${isActive}
      WHERE id = ${id}
    `;

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

    // 1. Delete linked features
    await prisma.$executeRaw`DELETE FROM homefeature WHERE sectionId = ${id}`;
    
    // 2. Delete linked testimonials
    await prisma.$executeRaw`DELETE FROM testimonial WHERE sectionId = ${id}`;

    // 3. Delete the section
    await prisma.$executeRaw`DELETE FROM homesection WHERE id = ${id}`;

    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
