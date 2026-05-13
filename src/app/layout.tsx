import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { dbFetch, prisma } from "@/lib/prisma";
import AuthProvider from "@/components/AuthProvider";
import WhatsAppButton from "@/components/WhatsAppButton";
import { normalizeImageUrl } from "@/lib/image-utils";
import { unstable_noStore as noStore } from "next/cache";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = 'force-no-store';

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
  noStore();
  headers();
  const settings = await dbFetch(
    () => prisma.siteSettings.findFirst(),
    null
  );

  const logoUrl = normalizeImageUrl(settings?.logoUrl || "");
  const tagline = settings?.siteTagline || "Identity of Purity. Premium Shuddh Deshi Bilona Ghee delivered directly to you in Jaipur & Jodhpur.";

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning>
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
