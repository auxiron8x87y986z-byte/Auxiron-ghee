import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("--- HOME SECTIONS ---");
  const sections = await prisma.homeSection.findMany();
  console.log(JSON.stringify(sections, null, 2));

  console.log("\n--- HOME FEATURES ---");
  const features = await prisma.homeFeature.findMany();
  console.log(JSON.stringify(features, null, 2));

  console.log("\n--- TESTIMONIALS ---");
  const testimonials = await prisma.testimonial.findMany();
  console.log(JSON.stringify(testimonials, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
