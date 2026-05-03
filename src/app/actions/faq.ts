"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFAQs() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, faqs };
  } catch (error: any) {
    console.error("Failed to fetch FAQs:", error);
    return { success: false, error: "Failed to load FAQs" };
  }
}

export async function createFAQ(data: { question: string; answer: string; order?: number }) {
  try {
    if (!data.question || !data.answer) {
      return { success: false, error: "Question and answer are required" };
    }

    const currentCount = await prisma.fAQ.count();
    const order = data.order !== undefined ? data.order : currentCount + 1;

    const faq = await prisma.fAQ.create({
      data: {
        question: data.question,
        answer: data.answer,
        order,
      },
    });

    revalidatePath("/admin/faq");
    revalidatePath("/faq");
    return { success: true, faq };
  } catch (error: any) {
    console.error("Failed to create FAQ:", error);
    return { success: false, error: error.message || "Failed to create FAQ" };
  }
}

export async function updateFAQ(id: number, data: { question: string; answer: string; order?: number }) {
  try {
    if (!data.question || !data.answer) {
      return { success: false, error: "Question and answer are required" };
    }

    const faq = await prisma.fAQ.update({
      where: { id },
      data: {
        question: data.question,
        answer: data.answer,
        order: data.order,
      },
    });

    revalidatePath("/admin/faq");
    revalidatePath("/faq");
    return { success: true, faq };
  } catch (error: any) {
    console.error("Failed to update FAQ:", error);
    return { success: false, error: error.message || "Failed to update FAQ" };
  }
}

export async function deleteFAQ(id: number) {
  try {
    await prisma.fAQ.delete({
      where: { id },
    });

    revalidatePath("/admin/faq");
    revalidatePath("/faq");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete FAQ:", error);
    return { success: false, error: error.message || "Failed to delete FAQ" };
  }
}

export async function reorderFAQs(orderedIds: number[]) {
  try {
    // We update each FAQ with its new order
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.fAQ.update({
          where: { id },
          data: { order: index + 1 },
        })
      )
    );

    revalidatePath("/admin/faq");
    revalidatePath("/faq");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to reorder FAQs:", error);
    return { success: false, error: "Failed to reorder FAQs" };
  }
}
