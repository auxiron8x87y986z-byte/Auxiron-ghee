import { prisma } from "@/lib/prisma";
import BlogManager from "./BlogManager";

export const dynamic = "force-dynamic";

export default async function AdminBlog() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return <BlogManager posts={posts} />;
}
