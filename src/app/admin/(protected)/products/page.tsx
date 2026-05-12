import { dbFetch, prisma } from "@/lib/prisma";
import ProductManager from "./ProductManager";

export default async function AdminProducts() {
  const products = await dbFetch(
    () => prisma.product.findMany({ orderBy: { volume: 'asc' } }),
    []
  );

  return <ProductManager initialProducts={products} />;
}
