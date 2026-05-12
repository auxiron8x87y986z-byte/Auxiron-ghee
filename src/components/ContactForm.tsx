"use client";

import { useState } from "react";
import { sendContactEmail } from "@/app/actions/contact";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", text: "" });

    const res = await sendContactEmail({ name, email, subject, message });

    if (res.success) {
      setStatus({ type: "success", text: "Your message has been sent successfully! We will get back to you soon." });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } else {
      setStatus({ type: "error", text: res.error || "Failed to send message. Please try again." });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {status.text && (
        <div style={{ padding: '1rem', backgroundColor: status.type === "success" ? '#e8f5e9' : '#ffebee', color: status.type === "success" ? '#2e7d32' : '#c62828', borderRadius: '8px' }}>
          {status.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Name <span style={{ color: 'var(--color-error, red)' }}>*</span></label>
          <input 
            type="text" 
            className="input" 
            placeholder="Your Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email <span style={{ color: 'var(--color-error, red)' }}>*</span></label>
          <input 
            type="email" 
            className="input" 
            placeholder="your@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Subject <span style={{ color: 'var(--color-error, red)' }}>*</span></label>
        <input 
          type="text" 
          className="input" 
          placeholder="How can we help?" 
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Message <span style={{ color: 'var(--color-error, red)' }}>*</span></label>
        <textarea 
          className="textarea" 
          rows={6} 
          placeholder="Your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '1rem 2.5rem', fontSize: '1.1rem', marginTop: '1rem' }}>
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
