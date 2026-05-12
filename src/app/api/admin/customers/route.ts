import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session as any)?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use raw SQL to bypass Prisma Client sync issues
    const customers = await prisma.$queryRaw`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.createdAt as signupDate, 
        u.isVerified,
        (SELECT city FROM \`Order\` WHERE userId = u.id ORDER BY createdAt DESC LIMIT 1) as location,
        (SELECT COUNT(*) FROM \`Order\` WHERE userId = u.id) as orderCount
      FROM User u
      ORDER BY u.createdAt DESC
    ` as any[];

    const formattedCustomers = customers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      signupDate: user.signupDate,
      location: user.location || "N/A",
      orderCount: Number(user.orderCount),
      status: Number(user.orderCount) > 0 ? "Ordered" : "Signup Only",
      isVerified: Boolean(user.isVerified)
    }));

    return NextResponse.json(formattedCustomers);
  } catch (error: any) {
    console.error("Fetch customers error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch customers" }, { status: 500 });
  }
}
