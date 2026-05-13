"use server";

import { prisma, useRemoteDb } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getContactSettings() {
  try {
    let settings = await prisma.siteSettings.findFirst();
    
    // Create default if none exists
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          contactEmail: "contact@auxiron.com",
          whatsappNumber: "910000000000",
          officeAddress: "Jaipur & Jodhpur",
        }
      });
    }

    return { 
      success: true, 
      settings: {
        id: settings.id,
        contactEmail: settings.contactEmail || "contact@auxiron.com",
        whatsappNumber: settings.whatsappNumber || "910000000000",
        supportEmail: settings.contactEmail || "contact@auxiron.com", // Fallback
        location: settings.officeAddress || "Jaipur & Jodhpur"
      }
    };
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
    const existing = await prisma.siteSettings.findFirst();

    if (existing) {
      await prisma.siteSettings.update({
        where: { id: existing.id },
        data: {
          contactEmail: data.contactEmail,
          whatsappNumber: data.whatsappNumber,
          officeAddress: data.location,
        },
      });
    } else {
      await prisma.siteSettings.create({
        data: {
          contactEmail: data.contactEmail,
          whatsappNumber: data.whatsappNumber,
          officeAddress: data.location,
        },
      });
    }

    revalidatePath("/contact");
    revalidatePath("/");
    revalidatePath("/admin/settings/contact");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to update settings:", error);
    return { success: false, error: error.message || "Failed to update settings" };
  }
}
