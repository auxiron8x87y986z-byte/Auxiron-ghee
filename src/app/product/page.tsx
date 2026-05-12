import { dbFetch, prisma } from "@/lib/prisma";
import ProductClient from "./ProductClient";

export const dynamic = "force-dynamic";

export default async function ProductPage() {
  const products = await dbFetch(
    () => prisma.product.findMany({ orderBy: { volume: 'asc' } }),
    []
  );

  return <ProductClient variants={products} />;
}
