import { getContactSettings } from "@/app/actions/settings";
import ContactSettingsForm from "./ContactSettingsForm";

export const metadata = {
  title: "Contact Settings | Auxiron Admin",
};

export default async function ContactSettingsPage() {
  const { settings } = await getContactSettings();

  return (
    <div>
      <h1 style={{ fontSize: '2rem', color: 'var(--color-secondary-dark)', marginBottom: '0.5rem' }}>Contact Settings</h1>
      <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem' }}>
        Manage the email addresses and contact information displayed on the website.
      </p>

      <ContactSettingsForm initialSettings={settings} />
    </div>
  );
}
