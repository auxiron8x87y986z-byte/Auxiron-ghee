"use server";

import { prisma } from "@/lib/prisma";

export async function processCheckout(data: {
  customerName: string;
  customerPhone: string;
  address: string;
  city: string;
  totalAmount: number;
  paymentMethod: string;
  items: any[];
}) {
  const order = await prisma.order.create({
    data: {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      address: data.address,
      city: data.city,
      totalAmount: data.totalAmount,
      paymentMethod: data.paymentMethod,
      items: JSON.stringify(data.items), // Store as JSON string in the DB if the schema uses Json type, or Prisma handles object to Json translation directly. Prisma handles arbitrary objects for Json fields.
      status: "PENDING",
    }
  });

  return { success: true, orderId: order.id };
}
