"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createBlogPost(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const imageUrl = formData.get("imageUrl") as string || null;
  const imageAlt = formData.get("imageAlt") as string || null;
  const metaTitle = formData.get("metaTitle") as string || null;
  const metaDescription = formData.get("metaDescription") as string || null;
  const published = formData.get("published") === "true";

  await prisma.blogPost.create({
    data: { title, slug, content, imageUrl, imageAlt, metaTitle, metaDescription, published }
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}

export async function updateBlogPost(id: number, formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const imageUrl = formData.get("imageUrl") as string || null;
  const imageAlt = formData.get("imageAlt") as string || null;
  const metaTitle = formData.get("metaTitle") as string || null;
  const metaDescription = formData.get("metaDescription") as string || null;
  const published = formData.get("published") === "true";

  await prisma.blogPost.update({
    where: { id },
    data: { title, slug, content, imageUrl, imageAlt, metaTitle, metaDescription, published }
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  return { success: true };
}

import { unlink } from "fs/promises";
import path from "path";

export async function deleteBlogPost(id: number) {
  try {
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) return { success: false, error: "Post not found" };

    // Delete associated image if it exists in public/uploads
    if (post.imageUrl && post.imageUrl.startsWith("/uploads/")) {
      try {
        const fileName = post.imageUrl.replace("/uploads/", "");
        const filePath = path.join(process.cwd(), "public", "uploads", fileName);
        await unlink(filePath);
      } catch (err) {
        console.error("Failed to delete local image file:", err);
      }
    }

    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    return { success: false, error: "Failed to delete blog post from database" };
  }
}
