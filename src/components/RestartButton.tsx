'use client';

import { useState } from 'react';

export default function RestartButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRestart = async () => {
    if (!confirm('Are you sure you want to restart the production server? The site will be temporarily unavailable for a few seconds.')) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/system/restart', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Success! Server is restarting...');
        // Reload after a delay
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      } else {
        setMessage(`Error: ${data.error || 'Failed to restart'}`);
      }
    } catch (error) {
      setMessage('Network error. The server might already be restarting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 'auto', padding: '1rem 0' }}>
      <button
        onClick={handleRestart}
        disabled={loading}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#333',
          color: '#fff',
          border: '1px solid #444',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '0.9rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s',
          opacity: loading ? 0.7 : 1
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#444'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#333'}
      >
        <span>🔄</span> {loading ? 'Restarting...' : 'PM2 Restart'}
      </button>
      {message && (
        <p style={{ 
          fontSize: '0.75rem', 
          marginTop: '0.5rem', 
          color: message.startsWith('Error') ? 'var(--color-error)' : 'var(--color-success)',
          textAlign: 'center'
        }}>
          {message}
        </p>
      )}
    </div>
  );
}
