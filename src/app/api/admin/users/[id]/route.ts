import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const currentUserId = parseInt((session.user as any).id);
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    if (currentUserId !== 1 && currentUserId !== id) {
      return NextResponse.json({ error: "Only Super Admin can edit other users" }, { status: 403 });
    }

    const { name, email, password } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const updateData: any = { name, email };

    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Check if email belongs to someone else
    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "Email is already in use by another user" }, { status: 400 });
    }

    const updatedUser = await prisma.adminUser.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const currentUserId = parseInt((session.user as any).id);
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    
    if (id === 1) {
      return NextResponse.json({ error: "Super Admin cannot be deleted" }, { status: 403 });
    }

    if (currentUserId !== 1 && currentUserId !== id) {
      return NextResponse.json({ error: "You are not authorized to delete this user" }, { status: 403 });
    }
    
    await prisma.adminUser.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
