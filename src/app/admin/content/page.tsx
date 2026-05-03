import { prisma } from "@/lib/prisma";
import ContentManager from "./ContentManager";

export const dynamic = "force-dynamic";

export default async function AdminContent() {
  const blocks = await prisma.contentBlock.findMany({
    orderBy: { page: 'asc' }
  });

  return <ContentManager blocks={blocks} />;
}
