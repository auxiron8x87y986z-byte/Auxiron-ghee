import { dbFetch, prisma } from "@/lib/prisma";
import ProductManager from "./ProductManager";

export default async function AdminProducts() {
  const productsRaw = await dbFetch(
    () => prisma.product.findMany({ orderBy: { volume: 'asc' } }),
    []
  );

  // Safely parse images field for each product
  const products = productsRaw.map(p => ({
    ...p,
    images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || []
  }));

  return <ProductManager initialProducts={products as any} />;
}
