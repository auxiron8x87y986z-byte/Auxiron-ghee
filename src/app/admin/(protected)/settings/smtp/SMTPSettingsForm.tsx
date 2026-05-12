"use client";

import { useState } from "react";

export default function SMTPSettingsForm({ initialData }: { initialData: any }) {
  const [formData, setFormData] = useState({
    smtpHost: initialData?.smtpHost || "",
    smtpPort: initialData?.smtpPort || "",
    smtpUsername: initialData?.smtpUsername || "",
    smtpPassword: initialData?.smtpPassword || "",
    smtpEncryption: initialData?.smtpEncryption || "tls",
    senderEmail: initialData?.senderEmail || "",
    senderName: initialData?.senderName || "Auxiron Ghee",
    otpSubject: initialData?.otpSubject || "Your OTP Code - Auxiron",
    otpTemplate: initialData?.otpTemplate || "<h2>Hello {{name}},</h2>\n<p>Your OTP for password reset is:</p>\n<h1 style='color: #c4a484; letter-spacing: 5px;'>{{otp}}</h1>\n<p>Valid for 15 minutes.</p>",
  });

  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState("");
  const [testEmail, setTestEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings/smtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage("✅ SMTP settings updated successfully!");
      } else {
        const error = await res.json();
        setMessage("❌ Error: " + (error.error || "Failed to update"));
      }
    } catch (err) {
      setMessage("❌ Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!testEmail) {
      alert("Please enter a test email address first");
      return;
    }
    setTesting(true);
    setMessage("⏳ Sending test email...");

    try {
      const res = await fetch("/api/admin/test-smtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Success! Test email sent successfully.");
      } else {
        setMessage("❌ Test Failed: " + (data.error || "Check your credentials"));
      }
    } catch (err) {
      setMessage("❌ Network error during test");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #eee', maxWidth: '800px' }}>
      {message && (
        <div style={{ padding: '1rem', marginBottom: '2rem', borderRadius: '8px', backgroundColor: message.includes('✅') ? '#e8f5e9' : '#ffebee', color: message.includes('✅') ? '#2e7d32' : '#c62828' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem' }}>SMTP HOST</label>
            <input 
              type="text" 
              required 
              value={formData.smtpHost} 
              onChange={e => setFormData({...formData, smtpHost: e.target.value})}
              placeholder="e.g. smtp.gmail.com"
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem' }}>SMTP PORT</label>
            <input 
              type="text" 
              required 
              value={formData.smtpPort} 
              onChange={e => setFormData({...formData, smtpPort: e.target.value})}
              placeholder="587 or 465"
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem' }}>SMTP USERNAME</label>
            <input 
              type="text" 
              required 
              value={formData.smtpUsername} 
              onChange={e => setFormData({...formData, smtpUsername: e.target.value})}
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem' }}>SMTP PASSWORD</label>
            <input 
              type="password" 
              required 
              value={formData.smtpPassword} 
              onChange={e => setFormData({...formData, smtpPassword: e.target.value})}
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem' }}>ENCRYPTION</label>
          <select 
            value={formData.smtpEncryption} 
            onChange={e => setFormData({...formData, smtpEncryption: e.target.value})}
            style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
          >
            <option value="tls">TLS (Port 587)</option>
            <option value="ssl">SSL (Port 465)</option>
            <option value="none">None</option>
          </select>
        </div>

        <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #eee' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem' }}>SENDER EMAIL</label>
            <input 
              type="email" 
              required 
              value={formData.senderEmail} 
              onChange={e => setFormData({...formData, senderEmail: e.target.value})}
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem' }}>SENDER NAME</label>
            <input 
              type="text" 
              required 
              value={formData.senderName} 
              onChange={e => setFormData({...formData, senderName: e.target.value})}
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
            />
          </div>
        </div>

        <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #eee' }} />

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem' }}>OTP EMAIL SUBJECT</label>
          <input 
            type="text" 
            required 
            value={formData.otpSubject} 
            onChange={e => setFormData({...formData, otpSubject: e.target.value})}
            style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem' }}>OTP EMAIL TEMPLATE (HTML)</label>
          <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>Use <strong>{"{{otp}}"}</strong> and <strong>{"{{name}}"}</strong> as placeholders.</p>
          <textarea 
            rows={6}
            value={formData.otpTemplate} 
            onChange={e => setFormData({...formData, otpTemplate: e.target.value})}
            style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'monospace' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary" 
          style={{ width: '200px', height: '45px', marginBottom: '2rem' }}
        >
          {loading ? "Saving..." : "Save Configuration"}
        </button>

        <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #eee' }} />

        <div style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Test Connection</h3>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>Enter an email address to send a test message using the saved settings.</p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem' }}>TEST EMAIL ADDRESS</label>
              <input 
                type="email" 
                placeholder="your-email@example.com"
                value={testEmail}
                onChange={e => setTestEmail(e.target.value)}
                style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
              />
            </div>
            <button 
              type="button" 
              onClick={handleTestConnection}
              disabled={testing}
              className="btn btn-secondary" 
              style={{ padding: '0 20px', height: '45px' }}
            >
              {testing ? "Testing..." : "Test Connection"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
