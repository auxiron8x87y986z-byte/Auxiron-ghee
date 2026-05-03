import { prisma } from "@/lib/prisma";
import GeneralSettingsForm from "./GeneralSettingsForm";

export const dynamic = "force-dynamic";

export default async function GeneralSettingsPage() {
  const blocks = await prisma.contentBlock.findMany({
    where: { key: { in: ["site_logo", "site_tagline", "hero_background"] } }
  });

  const logoBlock = blocks.find(b => b.key === "site_logo");
  const taglineBlock = blocks.find(b => b.key === "site_tagline");
  const heroBgBlock = blocks.find(b => b.key === "hero_background");

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--color-secondary-dark)' }}>General Settings</h1>
      <GeneralSettingsForm 
        initialLogo={logoBlock?.value || ""} 
        initialTagline={taglineBlock?.value || ""} 
        initialHeroBg={heroBgBlock?.value || ""}
      />
    </div>
  );
}
