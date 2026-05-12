import { dbFetch, prisma } from "@/lib/prisma";
import OrderManager from "./OrderManager";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  const orders = await dbFetch(
    () => prisma.order.findMany({ orderBy: { createdAt: 'desc' } }),
    []
  );

  return <OrderManager orders={orders} />;
}
