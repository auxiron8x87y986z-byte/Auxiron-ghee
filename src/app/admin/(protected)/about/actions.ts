"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveAboutSettings(formData: FormData) {
  const keys = ["about_heading", "about_intro", "about_hero_image", "about_method_heading", "about_method_text", "about_farm_image", "about_promise_heading", "about_purity_image", "about_promise_items", "about_extra_sections"];
  
  for (const key of keys) {
    const value = formData.get(key) as string;
    if (value !== null) {
      await prisma.contentBlock.upsert({
        where: { key },
        update: { value, page: 'about' },
        create: { key, value, page: 'about' }
      });
    }
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/about");
}
