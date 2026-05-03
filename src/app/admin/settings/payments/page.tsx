"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Gateway = {
  id?: number;
  name: string;
  enabled: boolean;
  mode: string;
  testApiKey: string;
  testSecret: string;
  liveApiKey: string;
  liveSecret: string;
};

export default function PaymentSettings() {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchGateways();
  }, []);

  const fetchGateways = async () => {
    try {
      const res = await fetch("/api/admin/payment-gateways");
      if (res.ok) {
        let data = await res.json();
        // Ensure defaults if empty
        if (data.length === 0) {
          data = [
            { name: "Razorpay", enabled: false, mode: "test", testApiKey: "", testSecret: "", liveApiKey: "", liveSecret: "" },
            { name: "Stripe", enabled: false, mode: "test", testApiKey: "", testSecret: "", liveApiKey: "", liveSecret: "" },
            { name: "Paytm", enabled: false, mode: "test", testApiKey: "", testSecret: "", liveApiKey: "", liveSecret: "" }
          ];
        }
        setGateways(data);
      }
    } catch (error) {
      console.error("Failed to load gateways", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/payment-gateways", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gateways)
      });
      if (res.ok) {
        alert("Payment Settings Saved Successfully!");
        router.refresh();
      } else {
        alert("Failed to save settings");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (index: number, field: keyof Gateway, value: any) => {
    const updated = [...gateways];
    (updated[index] as any)[field] = value;
    setGateways(updated);
  };

  if (loading) return <div>Loading payment settings...</div>;

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--color-secondary-dark)' }}>Payment Gateways</h1>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="btn btn-primary"
          style={{ padding: '0.8rem 2rem' }}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {gateways.map((gw, index) => (
          <div key={gw.name} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
            
            {/* Header: Name and Toggles */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {gw.name}
                <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '20px', backgroundColor: gw.enabled ? '#e8f5e9' : '#ffebee', color: gw.enabled ? '#2e7d32' : '#c62828' }}>
                  {gw.enabled ? 'Active' : 'Disabled'}
                </span>
              </h2>
              
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                  <input 
                    type="checkbox" 
                    checked={gw.enabled} 
                    onChange={(e) => handleChange(index, 'enabled', e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  Enable Gateway
                </label>
                
                <div style={{ display: 'flex', backgroundColor: '#f5f5f5', borderRadius: '8px', overflow: 'hidden' }}>
                  <button 
                    onClick={() => handleChange(index, 'mode', 'test')}
                    style={{ padding: '0.5rem 1rem', border: 'none', cursor: 'pointer', fontWeight: 600, backgroundColor: gw.mode === 'test' ? '#111' : 'transparent', color: gw.mode === 'test' ? '#fff' : '#666' }}
                  >
                    Test Mode
                  </button>
                  <button 
                    onClick={() => handleChange(index, 'mode', 'live')}
                    style={{ padding: '0.5rem 1rem', border: 'none', cursor: 'pointer', fontWeight: 600, backgroundColor: gw.mode === 'live' ? '#D32F2F' : 'transparent', color: gw.mode === 'live' ? '#fff' : '#666' }}
                  >
                    Live Mode
                  </button>
                </div>
              </div>
            </div>

            {/* API Keys Configuration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              
              {/* Test Keys */}
              <div style={{ opacity: gw.mode === 'test' ? 1 : 0.5, pointerEvents: gw.mode === 'test' ? 'auto' : 'none' }}>
                <h4 style={{ marginBottom: '1rem', color: '#555' }}>Test Credentials</h4>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#666' }}>API Key / Key ID</label>
                  <input 
                    type="text" 
                    value={gw.testApiKey || ''} 
                    onChange={(e) => handleChange(index, 'testApiKey', e.target.value)}
                    className="input-field"
                    placeholder="pk_test_..."
                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#666' }}>Secret Key</label>
                  <input 
                    type="password" 
                    value={gw.testSecret || ''} 
                    onChange={(e) => handleChange(index, 'testSecret', e.target.value)}
                    className="input-field"
                    placeholder="sk_test_..."
                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '8px' }}
                  />
                </div>
              </div>

              {/* Live Keys */}
              <div style={{ opacity: gw.mode === 'live' ? 1 : 0.5, pointerEvents: gw.mode === 'live' ? 'auto' : 'none' }}>
                <h4 style={{ marginBottom: '1rem', color: '#D32F2F' }}>Live Credentials</h4>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#666' }}>API Key / Key ID</label>
                  <input 
                    type="text" 
                    value={gw.liveApiKey || ''} 
                    onChange={(e) => handleChange(index, 'liveApiKey', e.target.value)}
                    className="input-field"
                    placeholder="pk_live_..."
                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#666' }}>Secret Key</label>
                  <input 
                    type="password" 
                    value={gw.liveSecret || ''} 
                    onChange={(e) => handleChange(index, 'liveSecret', e.target.value)}
                    className="input-field"
                    placeholder="sk_live_..."
                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '8px' }}
                  />
                </div>
              </div>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
