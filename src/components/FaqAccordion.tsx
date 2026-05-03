"use client";

import { useState } from "react";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export default function FaqAccordion({ faqs }: { faqs: FAQ[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (faqs.length === 0) {
    return <p style={{ textAlign: 'center', color: 'var(--color-text-light)' }}>No FAQs available at the moment.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {faqs.map((faq, index) => {
        const isActive = activeIndex === index;
        return (
          <div 
            key={faq.id} 
            style={{ 
              backgroundColor: 'var(--color-surface)', 
              borderRadius: 'var(--radius-md)', 
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
          >
            <button 
              onClick={() => toggleAccordion(index)}
              style={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '1.5rem', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <h3 style={{ 
                margin: 0, 
                color: isActive ? 'var(--color-primary-dark)' : 'var(--color-text)', 
                fontSize: '1.2rem',
                fontWeight: 600,
                transition: 'color 0.3s ease'
              }}>
                {faq.question}
              </h3>
              <span style={{ 
                fontSize: '1.5rem', 
                color: isActive ? 'var(--color-primary-dark)' : 'var(--color-text-light)',
                transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease, color 0.3s ease'
              }}>
                ▼
              </span>
            </button>
            <div style={{ 
              maxHeight: isActive ? '1000px' : '0', 
              opacity: isActive ? 1 : 0,
              padding: isActive ? '0 1.5rem 1.5rem 1.5rem' : '0 1.5rem',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}>
              <p style={{ margin: 0, color: 'var(--color-text-light)', lineHeight: 1.6 }}>{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
