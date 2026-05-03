"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/login" })}
      style={{ 
        width: '100%',
        textAlign: 'left',
        padding: '0.75rem 1rem', 
        borderRadius: 'var(--radius-sm)', 
        color: '#d32f2f', 
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: 600,
        marginTop: '0.5rem',
        display: 'block'
      }}
    >
      🚪 Logout
    </button>
  );
}
