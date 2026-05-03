"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getContactSettings() {
  try {
    let settings = await prisma.settings.findFirst();
    
    // Create default if none exists
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          contactEmail: "contact@auxiron.com",
          whatsappNumber: "910000000000",
          supportEmail: "support@auxiron.com",
          location: "Jaipur & Jodhpur",
        }
      });
    }

    return { success: true, settings };
  } catch (error: any) {
    console.error("Failed to fetch settings:", error);
    return { success: false, error: "Failed to load settings" };
  }
}

export async function updateContactSettings(data: {
  contactEmail: string;
  whatsappNumber: string;
  supportEmail: string;
  location: string;
}) {
  try {
    if (!data.contactEmail || !data.whatsappNumber) {
      return { success: false, error: "Contact Email and WhatsApp Number are required" };
    }

    const settings = await prisma.settings.findFirst();

    if (settings) {
      await prisma.settings.update({
        where: { id: settings.id },
        data,
      });
    } else {
      await prisma.settings.create({
        data,
      });
    }

    // Revalidate paths that use these settings
    revalidatePath("/contact");
    revalidatePath("/");
    revalidatePath("/admin/settings/contact");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to update settings:", error);
    return { success: false, error: error.message || "Failed to update settings" };
  }
}
