import { prisma } from "@/lib/prisma";
import ProductManager from "./ProductManager";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { volume: 'asc' }
  });

  return <ProductManager initialProducts={products} />;
}
