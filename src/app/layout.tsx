import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { prisma } from "@/lib/prisma";
import AuthProvider from "@/components/AuthProvider";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auxiron | Identity of Purity",
  description: "Premium Shuddh Deshi Bilona Ghee from Jaipur & Jodhpur. Organic, handmade, and pure.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch site-wide general settings
  const blocks = await prisma.contentBlock.findMany({
    where: { key: { in: ["site_logo", "site_tagline"] } }
  });

  const logoUrl = blocks.find(b => b.key === "site_logo")?.value || "";
  const tagline = blocks.find(b => b.key === "site_tagline")?.value || "Identity of Purity. Premium Shuddh Deshi Bilona Ghee delivered directly to you in Jaipur & Jodhpur.";

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar logoUrl={logoUrl} tagline={tagline} />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer logoUrl={logoUrl} tagline={tagline} />
            <WhatsAppButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
