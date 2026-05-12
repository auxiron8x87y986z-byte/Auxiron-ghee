"use client";

import { useState } from "react";
import FAQForm from "@/components/admin/FAQForm";
import { deleteFAQ, reorderFAQs } from "@/app/actions/faq";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  order: number | null;
}

export default function FAQClient({ initialFaqs }: { initialFaqs: FAQ[] }) {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      const res = await deleteFAQ(id);
      if (res.success) {
        setFaqs(faqs.filter(f => f.id !== id));
      } else {
        alert(res.error || "Failed to delete FAQ");
      }
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const newFaqs = [...faqs];
    const temp = newFaqs[index - 1];
    newFaqs[index - 1] = newFaqs[index];
    newFaqs[index] = temp;
    
    setFaqs(newFaqs);
    await reorderFAQs(newFaqs.map(f => f.id));
  };

  const moveDown = async (index: number) => {
    if (index === faqs.length - 1) return;
    const newFaqs = [...faqs];
    const temp = newFaqs[index + 1];
    newFaqs[index + 1] = newFaqs[index];
    newFaqs[index] = temp;
    
    setFaqs(newFaqs);
    await reorderFAQs(newFaqs.map(f => f.id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--color-secondary-dark)', marginBottom: '0.5rem' }}>Manage FAQs</h1>
          <p style={{ color: 'var(--color-text-light)' }}>Add, edit, or reorder Frequently Asked Questions.</p>
        </div>
        {!isAdding && (
          <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
            + Add New FAQ
          </button>
        )}
      </div>

      {isAdding && (
        <div style={{ marginBottom: '2rem' }}>
          <FAQForm 
            onCancel={() => setIsAdding(false)} 
            onSuccess={() => window.location.reload()} 
          />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {faqs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
            <p style={{ color: 'var(--color-text-light)' }}>No FAQs found. Add your first one!</p>
          </div>
        ) : (
          faqs.map((faq, index) => (
            <div key={faq.id} style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              {editingId === faq.id ? (
                <FAQForm 
                  faq={faq} 
                  onCancel={() => setEditingId(null)} 
                  onSuccess={() => window.location.reload()} 
                />
              ) : (
                <div style={{ display: 'flex', padding: '1.5rem', gap: '1.5rem', alignItems: 'flex-start' }}>
                  {/* Ordering Controls */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button 
                      onClick={() => moveUp(index)} 
                      disabled={index === 0}
                      style={{ background: 'none', border: 'none', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1, fontSize: '1.2rem' }}
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button 
                      onClick={() => moveDown(index)} 
                      disabled={index === faqs.length - 1}
                      style={{ background: 'none', border: 'none', cursor: index === faqs.length - 1 ? 'not-allowed' : 'pointer', opacity: index === faqs.length - 1 ? 0.3 : 1, fontSize: '1.2rem' }}
                      title="Move Down"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--color-text)' }}>{faq.question}</h3>
                    <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', lineHeight: 1.5 }}>{faq.answer}</p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={() => setEditingId(faq.id)}>Edit</button>
                    <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', color: 'var(--color-error)', borderColor: 'var(--color-error)' }} onClick={() => handleDelete(faq.id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
