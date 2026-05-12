"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SectionTestimonialForm({ sectionId, initialData }: { sectionId: number, initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    location: initialData?.location || "",
    review: initialData?.review || "",
    rating: initialData?.rating || 5,
    displayOrder: initialData?.displayOrder || 0,
    isActive: initialData ? (initialData.isActive === 1 || initialData.isActive === true) : true,
    sectionId: sectionId
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = initialData 
      ? `/api/admin/home-sections/${sectionId}/testimonials/${initialData.id}` 
      : `/api/admin/home-sections/${sectionId}/testimonials`;
    const method = initialData ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push(`/admin/home-sections/${sectionId}/testimonials`);
        router.refresh();
      } else {
        alert("Failed to save testimonial");
      }
    } catch (err) {
      alert("Error saving testimonial");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/home-sections/${sectionId}/testimonials/${initialData.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push(`/admin/home-sections/${sectionId}/testimonials`);
        router.refresh();
      } else {
        alert("Failed to delete testimonial");
      }
    } catch (err) {
      alert("Error deleting testimonial");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #eee', maxWidth: '800px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#444', marginBottom: '0.5rem' }}>CUSTOMER NAME</label>
        <input 
          type="text" 
          required 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})}
          style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#444', marginBottom: '0.5rem' }}>LOCATION (e.g. Jaipur)</label>
        <input 
          type="text" 
          required 
          value={formData.location} 
          onChange={e => setFormData({...formData, location: e.target.value})}
          style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#444', marginBottom: '0.5rem' }}>RATING (1-5)</label>
          <select 
            value={formData.rating} 
            onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}
            style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px' }}
          >
            {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
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
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#444', marginBottom: '0.5rem' }}>REVIEW / FEEDBACK</label>
        <textarea 
          required 
          rows={5}
          value={formData.review} 
          onChange={e => setFormData({...formData, review: e.target.value})}
          style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', lineHeight: 1.6 }}
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={formData.isActive} 
            onChange={e => setFormData({...formData, isActive: e.target.checked})}
          />
          Active (Visible in this section)
        </label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary" 
          style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}
        >
          {loading ? "Saving..." : "Save Testimonial"}
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
