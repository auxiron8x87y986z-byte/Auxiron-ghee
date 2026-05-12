"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: number, status: string) {
  await prisma.Order.update({
    where: { id: orderId },
    data: { status }
  });

  revalidatePath("/admin/orders");
}
