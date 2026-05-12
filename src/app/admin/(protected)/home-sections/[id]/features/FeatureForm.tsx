"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FeatureForm({ sectionId, initialData }: { sectionId: number, initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    icon: initialData?.icon || "✨",
    description: initialData?.description || "",
    displayOrder: initialData?.displayOrder || 0,
    isActive: initialData ? (initialData.isActive === 1 || initialData.isActive === true) : true,
    sectionId: sectionId
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = initialData 
      ? `/api/admin/home-sections/${sectionId}/features/${initialData.id}` 
      : `/api/admin/home-sections/${sectionId}/features`;
    const method = initialData ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push(`/admin/home-sections/${sectionId}/features`);
        router.refresh();
      } else {
        alert("Failed to save feature box");
      }
    } catch (err) {
      alert("Error saving feature box");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this feature box?")) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/home-sections/${sectionId}/features/${initialData.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push(`/admin/home-sections/${sectionId}/features`);
        router.refresh();
      } else {
        alert("Failed to delete feature box");
      }
    } catch (err) {
      alert("Error deleting feature box");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #eee', maxWidth: '600px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem' }}>ICON/EMOJI</label>
          <input 
            type="text" 
            required 
            value={formData.icon} 
            onChange={e => setFormData({...formData, icon: e.target.value})}
            style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center', fontSize: '1.5rem' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem' }}>BOX TITLE</label>
          <input 
            type="text" 
            required 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})}
            style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem' }}>DESCRIPTION / CONTENT</label>
        <textarea 
          required 
          rows={4}
          value={formData.description} 
          onChange={e => setFormData({...formData, description: e.target.value})}
          style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', lineHeight: 1.5 }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem' }}>DISPLAY ORDER</label>
          <input 
            type="number" 
            value={formData.displayOrder} 
            onChange={e => setFormData({...formData, displayOrder: parseInt(e.target.value)})}
            style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={formData.isActive} 
              onChange={e => setFormData({...formData, isActive: e.target.checked})}
            />
            Active
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary" 
          style={{ padding: '0.8rem 2rem' }}
        >
          {loading ? "Saving..." : "Save Box"}
        </button>
        {initialData && (
          <button 
            type="button" 
            onClick={handleDelete}
            disabled={loading}
            className="btn btn-secondary" 
            style={{ backgroundColor: '#fee2e2', color: '#b91c1c', border: 'none', padding: '0.8rem 2rem' }}
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
