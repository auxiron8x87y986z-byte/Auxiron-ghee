"use client";

import { useState } from "react";
import { createBlogPost, updateBlogPost, deleteBlogPost } from "./actions";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  imageAlt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  published: boolean;
  createdAt: Date;
};

export default function BlogManager({ posts }: { posts: BlogPost[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenModal = (post: BlogPost | null = null) => {
    setEditingPost(post);
    setSelectedFile(null);
    setPreviewUrl(post?.imageUrl || null);
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingPost(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image must be smaller than 2MB");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Only JPG, PNG, and WebP are supported");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (editingPost) {
      setEditingPost({ ...editingPost, imageUrl: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setUploadError(null);
    
    try {
      const formData = new FormData(e.currentTarget);
      
      // Handle file upload first if a new file was selected
      let finalImageUrl = editingPost?.imageUrl || null;
      
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });
        
        const uploadResult = await uploadRes.json();
        
        if (!uploadRes.ok) {
          throw new Error(uploadResult.error || "Failed to upload image");
        }
        
        finalImageUrl = uploadResult.url;
      } else if (previewUrl === null) {
        // User explicitly removed the image
        finalImageUrl = null;
      }
      
      // Remove the dummy file input from form data to prevent issues
      formData.delete("imageFile");
      
      // Append the final URL to be saved in the database
      if (finalImageUrl) {
        formData.set("imageUrl", finalImageUrl);
      } else {
        formData.delete("imageUrl"); // ensure it's null
      }
      
      if (editingPost) {
        await updateBlogPost(editingPost.id, formData);
      } else {
        await createBlogPost(formData);
      }
      
      window.location.reload();
    } catch (error: any) {
      setUploadError(error.message || "An unexpected error occurred");
      setIsSaving(false);
    }
  };

  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    console.log("Delete button clicked for blog ID:", id);
    setPostToDelete(id);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    console.log("Confirming delete for blog ID:", postToDelete);

    try {
      console.log("Calling Server Action: deleteBlogPost(" + postToDelete + ")");
      const result = await deleteBlogPost(postToDelete);
      console.log("Server Action Result:", result);
      
      if (result && result.success) {
        window.location.reload();
      } else {
        alert(result?.error || "Failed to delete blog post");
        setPostToDelete(null);
      }
    } catch (error: any) {
      console.error("Server Action Error during delete:", error);
      alert(error.message || "An unexpected error occurred while deleting");
      setPostToDelete(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--color-secondary-dark)' }}>Blog Management</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>Create New Post</button>
      </div>
      
      <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-light)' }}>
              <th style={{ padding: '1rem 0' }}>Title</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem 0', fontWeight: 500 }}>{p.title}</td>
                <td>/{p.slug}</td>
                <td>
                  <span style={{ padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', backgroundColor: p.published ? 'rgba(56, 142, 60, 0.1)' : 'rgba(212, 175, 55, 0.1)', color: p.published ? 'var(--color-success)' : 'var(--color-primary-dark)', fontSize: '0.85rem' }}>
                    {p.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>{new Date(p.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="button" onClick={() => handleOpenModal(p)} style={{ background: 'none', border: 'none', color: 'var(--color-primary-dark)', cursor: 'pointer', fontWeight: 500 }}>Edit</button>
                    <button type="button" onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', fontWeight: 500 }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '2rem 0', textAlign: 'center' }}>No blog posts found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {postToDelete !== null && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#d32f2f' }}>Confirm Deletion</h2>
            <p style={{ marginBottom: '2rem', color: '#555' }}>Are you sure you want to delete this blog post? This action cannot be undone and will delete the associated image.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" onClick={() => setPostToDelete(null)} style={{ flex: 1, padding: '0.8rem', background: '#f5f5f5', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
              <button type="button" onClick={confirmDelete} style={{ flex: 1, padding: '0.8rem', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Yes, Delete Post</button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, overflowY: 'auto', padding: '2rem' }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: 'var(--radius-md)', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingPost ? 'Edit Blog Post' : 'Create Blog Post'}</h2>
            
            {uploadError && (
              <div style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '8px' }}>
                {uploadError}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Title</label>
                  <input type="text" name="title" className="input" defaultValue={editingPost?.title || ''} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>URL Slug</label>
                  <input type="text" name="slug" className="input" defaultValue={editingPost?.slug || ''} required placeholder="e.g. benefits-of-bilona-ghee" />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Content (HTML/Text)</label>
                <textarea name="content" className="textarea" defaultValue={editingPost?.content || ''} required rows={10}></textarea>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', paddingBottom: '0.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Blog Featured Image</label>
                
                {previewUrl ? (
                  <div style={{ marginBottom: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1rem', display: 'inline-block' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Preview" style={{ maxWidth: '300px', maxHeight: '200px', objectFit: 'contain', display: 'block', marginBottom: '1rem' }} />
                    <button type="button" onClick={handleRemoveImage} style={{ color: '#d32f2f', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem' }}>
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div style={{ marginBottom: '1rem' }}>
                    <input 
                      type="file" 
                      name="imageFile" 
                      accept="image/jpeg, image/png, image/webp" 
                      onChange={handleFileChange}
                      style={{ padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', width: '100%' }}
                    />
                    <small style={{ color: 'var(--color-text-light)', display: 'block', marginTop: '0.5rem' }}>Max size: 2MB. Supported formats: JPG, PNG, WebP.</small>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Image Alt Text (SEO)</label>
                  <input type="text" name="imageAlt" className="input" defaultValue={editingPost?.imageAlt || ''} placeholder="Describe the image..." />
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: 'var(--color-secondary)' }}>SEO Settings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Meta Title</label>
                    <input type="text" name="metaTitle" className="input" defaultValue={editingPost?.metaTitle || ''} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Meta Description</label>
                    <textarea name="metaDescription" className="textarea" defaultValue={editingPost?.metaDescription || ''} rows={2}></textarea>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                  <input type="checkbox" name="published" value="true" defaultChecked={editingPost?.published} style={{ width: '1.2rem', height: '1.2rem' }} />
                  Publish immediately
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ flex: 1 }}>
                  {isSaving ? 'Saving...' : 'Save Post'}
                </button>
                <button type="button" disabled={isSaving} className="btn btn-outline" style={{ flex: 1 }} onClick={handleCloseModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
