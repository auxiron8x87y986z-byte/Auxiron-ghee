"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveGeneralSettings(formData: FormData) {
  const logoUrl = formData.get("site_logo") as string | null;
  const tagline = formData.get("site_tagline") as string | null;

  if (logoUrl !== null) {
    await prisma.contentBlock.upsert({
      where: { key: "site_logo" },
      update: { value: logoUrl },
      create: { key: "site_logo", value: logoUrl, page: "global" }
    });
  }

  if (tagline !== null) {
    await prisma.contentBlock.upsert({
      where: { key: "site_tagline" },
      update: { value: tagline },
      create: { key: "site_tagline", value: tagline, page: "global" }
    });
  }

  const heroBg = formData.get("hero_background") as string | null;
  if (heroBg !== null) {
    await prisma.contentBlock.upsert({
      where: { key: "hero_background" },
      update: { value: heroBg },
      create: { key: "hero_background", value: heroBg, page: "home" }
    });
  }

  revalidatePath("/", "layout");
  return { success: true };
}
