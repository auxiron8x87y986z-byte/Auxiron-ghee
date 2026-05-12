"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function upsertContentBlock(formData: FormData) {
  const key = formData.get("key") as string;
  const value = formData.get("value") as string;
  const page = formData.get("page") as string;

  await prisma.contentBlock.upsert({
    where: { key },
    update: { value, page },
    create: { key, value, page },
  });

  revalidatePath("/");
  revalidatePath("/admin/content");
  return { success: true };
}
