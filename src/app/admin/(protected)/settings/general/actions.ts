"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveGeneralSettings(formData: FormData) {
  try {
    const logoUrl = formData.get("site_logo") as string | null;
    const tagline = formData.get("site_tagline") as string | null;
    const heroBg = formData.get("hero_background") as string | null;
    const heroBgMobile = formData.get("hero_background_mobile") as string | null;

    const existing = await prisma.siteSettings.findFirst();

    const data: any = {};
    if (logoUrl !== null) data.logoUrl = logoUrl;
    if (tagline !== null) data.siteTagline = tagline;
    if (heroBg !== null) data.heroBgUrl = heroBg;
    if (heroBgMobile !== null) data.heroBgMobileUrl = heroBgMobile;

    if (existing) {
      await prisma.siteSettings.update({
        where: { id: existing.id },
        data
      });
    } else {
      await prisma.siteSettings.create({
        data
      });
    }

    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/admin/settings/general");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save general settings:", error);
    return { success: false, error: error.message || "Failed to save settings" };
  }
}
