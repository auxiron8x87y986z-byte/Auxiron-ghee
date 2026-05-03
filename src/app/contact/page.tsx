import { getContactSettings } from "@/app/actions/settings";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us | Auxiron",
  description: "Get in touch with Auxiron for any queries regarding our pure Bilona Ghee.",
};

export default async function ContactPage() {
  const { settings } = await getContactSettings();

  return (
    <div className="contact-page">
      <section className="section" style={{ minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-secondary-dark)' }}>Contact Us</h1>
            <p style={{ color: 'var(--color-text-light)', fontSize: '1.2rem' }}>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>

          <div style={{ backgroundColor: 'var(--color-surface)', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
            <ContactForm />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem', marginTop: '4rem', textAlign: 'center' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-secondary-dark)' }}>Email</h3>
              <p style={{ color: 'var(--color-text-light)' }}>{settings?.supportEmail || "support@auxiron.com"}</p>
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-secondary-dark)' }}>WhatsApp Support</h3>
              <p style={{ color: 'var(--color-text-light)' }}>+{settings?.whatsappNumber || "910000000000"}</p>
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-secondary-dark)' }}>Locations</h3>
              <p style={{ color: 'var(--color-text-light)' }}>{settings?.location || "Jaipur & Jodhpur"}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
