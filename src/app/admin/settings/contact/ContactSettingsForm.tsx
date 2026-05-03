"use client";

import { useState } from "react";
import { updateContactSettings } from "@/app/actions/settings";
import { useRouter } from "next/navigation";

export default function ContactSettingsForm({ initialSettings }: { initialSettings: any }) {
  const [contactEmail, setContactEmail] = useState(initialSettings?.contactEmail || "");
  const [whatsappNumber, setWhatsappNumber] = useState(initialSettings?.whatsappNumber || "");
  const [supportEmail, setSupportEmail] = useState(initialSettings?.supportEmail || "");
  const [location, setLocation] = useState(initialSettings?.location || "");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const res = await updateContactSettings({
      contactEmail,
      whatsappNumber,
      supportEmail,
      location,
    });

    if (res.success) {
      setMessage({ type: "success", text: "Contact settings saved successfully!" });
      router.refresh();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } else {
      setMessage({ type: "error", text: res.error || "Failed to save settings." });
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {message.text && (
        <div style={{ padding: '1rem', backgroundColor: message.type === "success" ? '#e8f5e9' : '#ffebee', color: message.type === "success" ? '#2e7d32' : '#c62828', borderRadius: '8px' }}>
          {message.text}
        </div>
      )}

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Contact Form Receiving Email</label>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>The email address where all contact form submissions will be sent.</p>
        <input
          type="email"
          className="input"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>WhatsApp Number</label>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Format: Country code without '+' (e.g., 919876543210)</p>
        <input
          type="text"
          className="input"
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))} // Only allow digits
          required
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Public Support Email</label>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>This email is displayed publicly on the contact page.</p>
        <input
          type="email"
          className="input"
          value={supportEmail}
          onChange={(e) => setSupportEmail(e.target.value)}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Physical Location</label>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Displayed on the contact page (e.g., "Jaipur & Jodhpur").</p>
        <input
          type="text"
          className="input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
