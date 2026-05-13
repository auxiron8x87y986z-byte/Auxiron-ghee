import { dbFetch, prisma } from "@/lib/prisma";
import GeneralSettingsForm from "./GeneralSettingsForm";

export const dynamic = "force-dynamic";

export default async function GeneralSettingsPage() {
  const settings = await dbFetch(
    () => prisma.siteSettings.findFirst(),
    null
  );

  const initialLogo = settings?.logoUrl || "";
  const initialTagline = settings?.siteTagline || "Identity of Purity";
  const initialHeroBg = settings?.heroBgUrl || "";
  const initialHeroBgMobile = settings?.heroBgMobileUrl || "";

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--color-secondary-dark)' }}>General Settings</h1>
      <GeneralSettingsForm 
        initialLogo={initialLogo}
        initialTagline={initialTagline}
        initialHeroBg={initialHeroBg}
        initialHeroBgMobile={initialHeroBgMobile}
      />
    </div>
  );
}
