"use client";

import { useState } from "react";
import { createFAQ, updateFAQ } from "@/app/actions/faq";
import { useRouter } from "next/navigation";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  order: number | null;
}

interface FAQFormProps {
  faq?: FAQ | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function FAQForm({ faq, onSuccess, onCancel }: FAQFormProps) {
  const [question, setQuestion] = useState(faq?.question || "");
  const [answer, setAnswer] = useState(faq?.answer || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer) {
      setError("Both question and answer are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = faq
        ? await updateFAQ(faq.id, { question, answer, order: faq.order || undefined })
        : await createFAQ({ question, answer });

      if (res.success) {
        if (onSuccess) onSuccess();
        else router.refresh(); // Fallback if no onSuccess provided
      } else {
        setError(res.error || "Something went wrong.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
      <h3 style={{ fontSize: '1.25rem', color: 'var(--color-secondary-dark)', marginBottom: '0.5rem' }}>
        {faq ? "Edit FAQ" : "Add New FAQ"}
      </h3>
      
      {error && (
        <div style={{ padding: '0.75rem', backgroundColor: 'rgba(211, 47, 47, 0.1)', color: 'var(--color-error)', borderRadius: 'var(--radius-sm)' }}>
          {error}
        </div>
      )}

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Question</label>
        <input
          type="text"
          className="input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What is Bilona Ghee?"
          required
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Answer</label>
        <textarea
          className="input"
          rows={5}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Detailed answer..."
          required
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save FAQ"}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
