import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, subtitle, content, imageUrl, sectionType, displayOrder, isActive } = await request.json();

    await prisma.$executeRaw`
      INSERT INTO HomeSection (title, subtitle, content, imageUrl, sectionType, displayOrder, isActive)
      VALUES (${title}, ${subtitle}, ${content}, ${imageUrl}, ${sectionType}, ${displayOrder}, ${isActive})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
