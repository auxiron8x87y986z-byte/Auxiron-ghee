import { dbFetch, prisma } from "@/lib/prisma";
import ProductClient from "./ProductClient";

export const dynamic = "force-dynamic";

export default async function ProductPage() {
  const productsRaw = await dbFetch(
    () => prisma.product.findMany({ orderBy: { volume: 'asc' } }),
    []
  );

  const products = productsRaw.map(p => ({
    ...p,
    images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || []
  }));

  return <ProductClient variants={products} />;
}
