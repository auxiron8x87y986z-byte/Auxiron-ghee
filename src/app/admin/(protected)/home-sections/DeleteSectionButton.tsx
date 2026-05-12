"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteSectionButton({ id }: { id: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000); // Reset after 3 seconds
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/home-sections/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete section");
        setConfirming(false);
      }
    } catch (err) {
      alert("Error deleting section");
      setConfirming(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        handleDelete();
      }} 
      disabled={loading}
      style={{ 
        background: confirming ? '#fee2e2' : 'none', 
        border: confirming ? '1px solid #ef4444' : 'none', 
        color: '#ef4444', 
        cursor: 'pointer', 
        fontWeight: confirming ? 600 : 500,
        fontSize: '0.85rem',
        padding: confirming ? '2px 8px' : '0',
        borderRadius: '4px',
        transition: 'all 0.2s'
      }}
    >
      {loading ? "..." : (confirming ? "Confirm Delete?" : "Delete")}
    </button>
  );
}
