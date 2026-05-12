import { dbFetch, prisma } from "@/lib/prisma";
import SMTPSettingsForm from "./SMTPSettingsForm";

export const dynamic = "force-dynamic";

export default async function SMTPSettingsPage() {
  const settings = await dbFetch(
    () => prisma.$queryRaw`SELECT * FROM SMTPSettings LIMIT 1`,
    []
  );

  const initialData = Array.isArray(settings) && settings.length > 0 ? settings[0] : null;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--color-secondary-dark)' }}>SMTP Configuration</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Configure the email server for system notifications, OTPs, and customer correspondence.</p>
      <SMTPSettingsForm initialData={initialData} />
    </div>
  );
}
