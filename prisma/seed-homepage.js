const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Homepage Content...');

  // 1. Clear existing sections to avoid duplicates (optional but safer for "reset")
  // Or use upsert. We'll use upsert to be non-destructive.

  // --- WHY CHOOSE AUXIRON SECTION ---
  const whyChooseSection = await prisma.homeSection.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      title: "Why Choose Auxiron Ghee?",
      subtitle: "The gold standard of purity and health.",
      sectionType: "features",
      displayOrder: 1,
      isActive: true,
    }
  });

  const features = [
    { id: 7, title: "100% Pure & Organic", icon: "🌿", description: "Our ghee is free from any additives, preservatives, or artificial colors. Just pure golden goodness." },
    { id: 8, title: "Traditional Bilona", icon: "🪵", description: "Hand-churned using the ancient wooden bilona method to preserve nutrition and authentic aroma." },
    { id: 9, title: "A2 Indigenous Cows", icon: "🐄", description: "Made exclusively from the A2 milk of grass-fed indigenous cows from Rajasthan." },
    { id: 10, title: "Nutrient Rich", icon: "💎", description: "Packed with vitamins A, D, E, and K, and healthy fatty acids for overall well-being." },
    { id: 11, title: "Immunity Booster", icon: "🛡️", description: "Natural antioxidants help strengthen your immune system and improve digestion." },
    { id: 12, title: "Authentic Aroma", icon: "👃", description: "The rich, nutty aroma that brings back memories of grandma's kitchen." }
  ];

  for (const f of features) {
    await prisma.homeFeature.upsert({
      where: { id: f.id },
      update: {},
      create: {
        ...f,
        sectionId: whyChooseSection.id,
        isActive: true,
        displayOrder: f.id
      }
    });
  }

  // --- TESTIMONIALS SECTION ---
  const testimonialSection = await prisma.homeSection.upsert({
    where: { id: 5 },
    update: {},
    create: {
      id: 5,
      title: "What Our Customers Say",
      subtitle: "Trusted by families across Jaipur & Jodhpur.",
      sectionType: "testimonials",
      displayOrder: 2,
      isActive: true,
    }
  });

  const testimonials = [
    { id: 4, name: "Priya Sharma", location: "Jaipur", rating: 5, review: "The aroma takes me back to my childhood! You can really taste the difference of the Bilona method. Highly recommended for every kitchen." },
    { id: 5, name: "Rajesh Meena", location: "Jodhpur", rating: 5, review: "Finally found authentic ghee in Jaipur. The delivery was fast and the packaging is very premium. Great quality product!" },
    { id: 6, name: "Suman Devi", location: "Jaipur", rating: 5, review: "My kids love the taste of this ghee on their parathas. I feel safe knowing it's organic and pure. Keep up the good work!" },
    { id: 7, name: "Anita Verma", location: "Kota", rating: 5, review: "The best A2 ghee I have tried so far. It's grainy, aromatic, and perfectly yellow. Worth every rupee." },
    { id: 8, name: "Vikram Singh", location: "Jodhpur", rating: 5, review: "Ordered online and received it in Jodhpur. The texture is amazing (Danedar). It smells heavenly when added to hot dal. Truly an identity of purity." },
    { id: 9, name: "Anjali Gupta", location: "Jaipur", rating: 4, review: "I was looking for organic A2 ghee and found Auxiron. The quality is consistent and the taste is superior to any big brand in the market." }
  ];

  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: {},
      create: {
        ...t,
        sectionId: testimonialSection.id,
        isActive: true,
        displayOrder: t.id
      }
    });
  }

  // --- CONTENT BLOCKS (Logo, Tagline, About Text) ---
  const blocks = [
    { key: "site_name", value: "Auxiron Ghee", page: "global" },
    { key: "site_tagline", value: "Identity of Purity. Premium Shuddh Deshi Bilona Ghee delivered directly to you in Jaipur & Jodhpur.", page: "global" },
    { key: "about_heading", value: "The Identity of Purity", page: "about" },
    { key: "about_intro", value: "At Auxiron, we believe that true health comes from nature. Born in the vibrant lands of Rajasthan, we are on a mission to bring back the lost authenticity of Indian culinary traditions, starting with our golden elixir: Shuddh Deshi Bilona Ghee.", page: "about" },
    { key: "about_method_heading", value: "The Bilona Method", page: "about" },
    { key: "about_promise_heading", value: "Our Promise", page: "about" }
  ];

  for (const b of blocks) {
    await prisma.contentBlock.upsert({
      where: { key: b.key },
      update: {},
      create: b
    });
  }

  console.log('Homepage seeding completed successfully!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
