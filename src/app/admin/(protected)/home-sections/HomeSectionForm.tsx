"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeSectionForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    content: initialData?.content || "",
    imageUrl: initialData?.imageUrl || "",
    sectionType: initialData?.sectionType || "custom",
    displayOrder: initialData?.displayOrder || 0,
    isActive: initialData ? (initialData.isActive === 1 || initialData.isActive === true) : true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = initialData 
      ? `/api/admin/home-sections/${initialData.id}` 
      : "/api/admin/home-sections";
    const method = initialData ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/home-sections");
        router.refresh();
      } else {
        alert("Failed to save section");
      }
    } catch (err) {
      alert("Error saving section");
    } finally {
      setLoading(false);
    }
  };

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleDelete = async () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      setTimeout(() => setConfirmingDelete(false), 3000);
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/home-sections/${initialData.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/admin/home-sections");
        router.refresh();
      } else {
        alert("Failed to delete section");
        setConfirmingDelete(false);
      }
    } catch (err) {
      alert("Error deleting section");
      setConfirmingDelete(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {initialData && (
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button 
            type="button" 
            onClick={() => {
              const subPath = formData.sectionType === 'testimonials' ? 'testimonials' : 'features';
              router.push(`/admin/home-sections/${initialData.id}/${subPath}`);
            }}
            className="btn btn-secondary" 
            style={{ padding: '0.8rem 1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {formData.sectionType === 'testimonials' ? '💬 Manage Testimonials' : '📦 Manage Content Boxes'}
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #eee', maxWidth: '800px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#444', marginBottom: '0.5rem' }}>SECTION TITLE</label>
        <input 
          type="text" 
          required 
          value={formData.title} 
          onChange={e => setFormData({...formData, title: e.target.value})}
          style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#444', marginBottom: '0.5rem' }}>SUBTITLE / TAGLINE</label>
        <input 
          type="text" 
          value={formData.subtitle} 
          onChange={e => setFormData({...formData, subtitle: e.target.value})}
          style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#444', marginBottom: '0.5rem' }}>SECTION TYPE</label>
          <select 
            value={formData.sectionType} 
            onChange={e => setFormData({...formData, sectionType: e.target.value})}
            style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
          >
            <option value="custom">Custom Section</option>
            <option value="features">Features / Why Us</option>
            <option value="testimonials">Testimonials Carousel</option>
            <option value="hero">Hero Section Replacement</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#444', marginBottom: '0.5rem' }}>DISPLAY ORDER</label>
          <input 
            type="number" 
            value={formData.displayOrder} 
            onChange={e => setFormData({...formData, displayOrder: parseInt(e.target.value)})}
            style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#444', marginBottom: '0.5rem' }}>SECTION CONTENT / DESCRIPTION</label>
        <textarea 
          rows={6}
          value={formData.content} 
          onChange={e => setFormData({...formData, content: e.target.value})}
          style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', lineHeight: 1.6 }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#444', marginBottom: '0.5rem' }}>IMAGE URL (Optional)</label>
        <input 
          type="text" 
          value={formData.imageUrl} 
          onChange={e => setFormData({...formData, imageUrl: e.target.value})}
          placeholder="/images/your-image.png"
          style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={formData.isActive} 
            onChange={e => setFormData({...formData, isActive: e.target.checked})}
          />
          Active (Visible on website)
        </label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary" 
          style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}
        >
          {loading ? "Saving..." : "Save Section"}
        </button>
        {!initialData && (
          <p style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
            * Once saved, you can add Boxes/Testimonials to this section.
          </p>
        )}
        {initialData && (
          <button 
            type="button" 
            onClick={handleDelete}
            disabled={loading}
            className="btn btn-secondary" 
            style={{ 
              backgroundColor: confirmingDelete ? '#ef4444' : '#fee2e2', 
              color: confirmingDelete ? '#fff' : '#b91c1c', 
              border: 'none', 
              padding: '0.8rem 2rem',
              fontWeight: 600,
              transition: 'all 0.3s'
            }}
          >
            {loading ? "..." : (confirmingDelete ? "CLICK AGAIN TO DELETE" : "Delete Section")}
          </button>
        )}
      </div>
      </form>
    </div>
  );
}
