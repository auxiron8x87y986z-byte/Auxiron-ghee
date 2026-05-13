"use client";

import { useState } from "react";
import { restartPM2 } from "@/app/actions/pm2";

export default function PM2RestartButton() {
  const [loading, setLoading] = useState(false);

  const handleRestart = async () => {
    if (!confirm("Are you sure you want to restart the application? The site will be temporarily unavailable for a few seconds.")) {
      return;
    }

    setLoading(true);
    try {
      const result = await restartPM2();
      if (result.success) {
        alert("Restart command sent successfully. Please wait a few seconds and refresh the page.");
      } else {
        alert("Failed to restart: " + result.error);
      }
    } catch (err) {
      alert("Error triggering restart. The server might already be restarting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRestart}
      disabled={loading}
      style={{
        width: '100%',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: '#fee2e2',
        color: '#b91c1c',
        border: '1px solid #fecaca',
        fontWeight: 600,
        fontSize: '0.9rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        marginBottom: '0.75rem',
        transition: 'all 0.2s ease'
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
    >
      {loading ? "Restarting..." : "🔄 pm2 restart"}
    </button>
  );
}
