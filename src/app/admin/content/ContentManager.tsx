"use client";

import { useState } from "react";
import { upsertContentBlock } from "./actions";

type ContentBlock = {
  id: number;
  key: string;
  value: string;
  page: string;
};

export default function ContentManager({ blocks }: { blocks: ContentBlock[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);

  const handleOpenModal = (block: ContentBlock | null = null) => {
    setEditingBlock(block);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingBlock(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await upsertContentBlock(formData);
    window.location.reload();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--color-secondary-dark)' }}>Content Management</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>Add New Block</button>
      </div>
      
      <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-light)' }}>
              <th style={{ padding: '1rem 0' }}>Key</th>
              <th>Page</th>
              <th>Value Snippet</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((b) => (
              <tr key={b.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem 0', fontWeight: 500 }}>{b.key}</td>
                <td>{b.page}</td>
                <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {b.value}
                </td>
                <td>
                  <button onClick={() => handleOpenModal(b)} style={{ background: 'none', border: 'none', color: 'var(--color-primary-dark)', cursor: 'pointer', fontWeight: 500 }}>Edit</button>
                </td>
              </tr>
            ))}
            {blocks.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '2rem 0', textAlign: 'center' }}>No content blocks created yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: 'var(--radius-md)', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingBlock ? 'Edit Content Block' : 'Add Content Block'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Block Key (e.g., home_hero_title)</label>
                <input type="text" name="key" className="input" defaultValue={editingBlock?.key || ''} required readOnly={!!editingBlock} style={{ backgroundColor: editingBlock ? '#f5f5f5' : '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Page</label>
                <input type="text" name="page" className="input" defaultValue={editingBlock?.page || 'home'} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Value (Text or Image URL)</label>
                <textarea name="value" className="textarea" defaultValue={editingBlock?.value || ''} required rows={5}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={handleCloseModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
