"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const volume = formData.get("volume") as string;
    const stock = parseInt(formData.get("stock") as string, 10) || 0;
    const imageUrl = formData.get("imageUrl") as string || null;
    // Images is already a JSON string from the client
    const images = formData.get("images") as string || "[]";
    const healthBenefits = formData.get("healthBenefits") as string || null;
    const howToUse = formData.get("howToUse") as string || null;

    await prisma.product.create({
      data: { name, description, price, volume, stock, imageUrl, images, healthBenefits, howToUse }
    });

    revalidatePath("/admin/products");
    revalidatePath("/product");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return { success: false, error: error.message || "Failed to create product" };
  }
}

export async function updateProduct(id: number, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const volume = formData.get("volume") as string;
    const stock = parseInt(formData.get("stock") as string, 10) || 0;
    const imageUrl = formData.get("imageUrl") as string || null;
    // Images is already a JSON string from the client
    const images = formData.get("images") as string || "[]";
    const healthBenefits = formData.get("healthBenefits") as string || null;
    const howToUse = formData.get("howToUse") as string || null;

    await prisma.product.update({
      where: { id },
      data: { name, description, price, volume, stock, imageUrl, images, healthBenefits, howToUse }
    });

    revalidatePath("/admin/products");
    revalidatePath("/product");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return { success: false, error: error.message || "Failed to update product" };
  }
}

import { unlink } from "fs/promises";
import path from "path";

export async function deleteProduct(id: number) {
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return { success: false, error: "Product not found" };

    if (product.imageUrl && product.imageUrl.startsWith("/uploads/")) {
      try {
        const fileName = product.imageUrl.replace("/uploads/", "");
        const filePath = path.join(process.cwd(), "public", "uploads", fileName);
        await unlink(filePath);
      } catch (err) {
        console.error("Failed to delete local product image:", err);
      }
    }

    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath("/product");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product from database" };
  }
}
