import { dbFetch, prisma } from "@/lib/prisma";
import GeneralSettingsForm from "./GeneralSettingsForm";

export const dynamic = "force-dynamic";

export default async function GeneralSettingsPage() {
  const blocks = await dbFetch(
    () => prisma.$queryRaw`SELECT \`key\`, \`value\` FROM contentblock WHERE \`key\` IN ('site_logo', 'site_tagline', 'hero_background', 'hero_background_mobile')` as Promise<Array<{ key: string; value: string }>>,
    []
  );

  const logoBlock = blocks.find(b => b.key === "site_logo");
  const taglineBlock = blocks.find(b => b.key === "site_tagline");
  const heroBgBlock = blocks.find(b => b.key === "hero_background");
  const heroBgMobileBlock = blocks.find(b => b.key === "hero_background_mobile");

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--color-secondary-dark)' }}>Hero Section</h1>
      <GeneralSettingsForm 
        initialLogo={logoBlock?.value || ""} 
        initialTagline={taglineBlock?.value || ""} 
        initialHeroBg={heroBgBlock?.value || ""}
        initialHeroBgMobile={heroBgMobileBlock?.value || ""}
      />
    </div>
  );
}
