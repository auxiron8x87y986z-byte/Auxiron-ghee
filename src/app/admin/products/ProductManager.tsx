"use client";

import { useState } from "react";
import { createProduct, updateProduct, deleteProduct } from "./actions";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  volume: string;
  imageUrl: string | null;
  images: any; // json array of strings
  stock: number;
  healthBenefits: string | null;
  howToUse: string | null;
};

export default function ProductManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  // Form states
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Array of image URLs (already uploaded)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  // Array of File objects (to be uploaded)
  const [newFiles, setNewFiles] = useState<File[]>([]);
  // Array of local blob URLs for previewing newFiles
  const [newFilePreviews, setNewFilePreviews] = useState<string[]>([]);

  const handleOpenModal = (product: Product | null = null) => {
    setEditingProduct(product);
    
    // Parse existing images
    let imgs: string[] = [];
    if (product) {
      if (product.images && Array.isArray(product.images)) {
        imgs = product.images;
      } else if (product.imageUrl) {
        imgs = [product.imageUrl];
      }
    }
    setExistingImages(imgs);
    setNewFiles([]);
    setNewFilePreviews([]);
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
    setExistingImages([]);
    setNewFiles([]);
    setNewFilePreviews([]);
    setIsModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    
    const totalCurrentImages = existingImages.length + newFiles.length;
    if (totalCurrentImages + files.length > 4) {
      setUploadError("You can only have up to 4 images per product.");
      return;
    }

    const validFiles: File[] = [];
    const validPreviews: string[] = [];

    for (const file of files) {
      if (file.size > 2 * 1024 * 1024) {
        setUploadError(`File ${file.name} exceeds 2MB limit.`);
        return;
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setUploadError(`File ${file.name} is not a supported format.`);
        return;
      }
      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    }

    setNewFiles([...newFiles, ...validFiles]);
    setNewFilePreviews([...newFilePreviews, ...validPreviews]);
    
    // Reset file input
    e.target.value = "";
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeNewFile = (index: number) => {
    setNewFiles(newFiles.filter((_, i) => i !== index));
    setNewFilePreviews(newFilePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setUploadError(null);
    
    try {
      const formData = new FormData(e.currentTarget);
      
      // 1. Upload new files one by one
      const uploadedUrls: string[] = [];
      for (const file of newFiles) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });
        
        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadResult.error || "Failed to upload image");
        uploadedUrls.push(uploadResult.url);
      }

      // 2. Combine existing and newly uploaded URLs
      const finalImages = [...existingImages, ...uploadedUrls];
      
      // 3. Set primary imageUrl (first image) and images array
      if (finalImages.length > 0) {
        formData.set("imageUrl", finalImages[0]);
        formData.set("images", JSON.stringify(finalImages));
      } else {
        formData.set("imageUrl", "");
        formData.set("images", JSON.stringify([]));
      }

      // 4. Save to DB
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await createProduct(formData);
      }
      
      window.location.reload(); 
    } catch (error: any) {
      setUploadError(error.message || "An unexpected error occurred");
      setIsSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    setProductToDelete(id);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const result = await deleteProduct(productToDelete);
      if (result && result.success) {
        setProducts(products.filter((p) => p.id !== productToDelete));
        setProductToDelete(null);
      } else {
        alert(result?.error || "Failed to delete product");
        setProductToDelete(null);
      }
    } catch (error: any) {
      alert(error.message || "An unexpected error occurred while deleting");
      setProductToDelete(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--color-secondary-dark)' }}>Products Management</h1>
        <button type="button" className="btn btn-primary" onClick={() => handleOpenModal()}>Add New Variant</button>
      </div>
      
      <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-light)' }}>
              <th style={{ padding: '1rem 0' }}>Product Name</th>
              <th>Volume</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem 0', fontWeight: 500 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {p.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain', backgroundColor: '#f5f5f5', borderRadius: '4px' }} />
                    )}
                    {p.name}
                  </div>
                </td>
                <td>{p.volume}</td>
                <td>₹{p.price.toLocaleString('en-IN')}</td>
                <td>
                  <span style={{ padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', backgroundColor: p.stock > 0 ? 'rgba(56, 142, 60, 0.1)' : 'rgba(211, 47, 47, 0.1)', color: p.stock > 0 ? 'var(--color-success)' : 'var(--color-error)', fontSize: '0.85rem' }}>
                    {p.stock} in stock
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="button" onClick={() => handleOpenModal(p)} style={{ background: 'none', border: 'none', color: 'var(--color-primary-dark)', cursor: 'pointer', fontWeight: 500 }}>Edit</button>
                    <button type="button" onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', fontWeight: 500 }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete !== null && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#d32f2f' }}>Confirm Deletion</h2>
            <p style={{ marginBottom: '2rem', color: '#555' }}>Are you sure you want to delete this product? This action cannot be undone and will permanently delete any associated product images.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" onClick={() => setProductToDelete(null)} style={{ flex: 1, padding: '0.8rem', background: '#f5f5f5', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
              <button type="button" onClick={confirmDelete} style={{ flex: 1, padding: '0.8rem', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Yes, Delete Product</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '2rem' }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: 'var(--radius-md)', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-secondary-dark)' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            
            {uploadError && (
              <div style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '8px' }}>
                {uploadError}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Image Uploader */}
              <div style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', border: '1px solid #eee' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Product Images (Up to 4)</h3>
                
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {/* Render Existing Images */}
                  {existingImages.map((url, idx) => (
                    <div key={`exist-${idx}`} style={{ position: 'relative', width: '100px', height: '100px', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button type="button" onClick={() => removeExistingImage(idx)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(255,0,0,0.8)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                    </div>
                  ))}
                  
                  {/* Render New File Previews */}
                  {newFilePreviews.map((url, idx) => (
                    <div key={`new-${idx}`} style={{ position: 'relative', width: '100px', height: '100px', border: '1px dashed #2196f3', borderRadius: '8px', overflow: 'hidden' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`New Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                      <button type="button" onClick={() => removeNewFile(idx)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(255,0,0,0.8)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                    </div>
                  ))}

                  {/* Upload Button */}
                  {(existingImages.length + newFiles.length) < 4 && (
                    <label style={{ width: '100px', height: '100px', border: '2px dashed #ccc', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#888', backgroundColor: '#fff' }}>
                      <span style={{ fontSize: '1.5rem' }}>+</span>
                      <span style={{ fontSize: '0.8rem' }}>Add Image</span>
                      <input type="file" multiple accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>
                <small style={{ color: '#888' }}>Supported formats: JPG, PNG, WebP. First image is the main hero image.</small>
              </div>

              {/* Basic Details */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Product Name</label>
                  <input type="text" name="name" className="input" defaultValue={editingProduct?.name || ''} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Volume (e.g., 1L)</label>
                  <input type="text" name="volume" className="input" defaultValue={editingProduct?.volume || ''} required />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Price (₹)</label>
                  <input type="number" name="price" className="input" defaultValue={editingProduct?.price || ''} required min="0" step="0.01" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Stock Quantity</label>
                  <input type="number" name="stock" className="input" defaultValue={editingProduct?.stock || 0} required min="0" />
                </div>
              </div>

              {/* Content Tabs */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
                <textarea name="description" className="textarea" defaultValue={editingProduct?.description || ''} required rows={3} placeholder="Main product description..."></textarea>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Health Benefits</label>
                <textarea name="healthBenefits" className="textarea" defaultValue={editingProduct?.healthBenefits || ''} rows={4} placeholder="E.g. Rich in A2 Protein..."></textarea>
                <small style={{ color: '#888', display: 'block', marginTop: '0.2rem' }}>Line breaks will be preserved on the frontend.</small>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>How to Use</label>
                <textarea name="howToUse" className="textarea" defaultValue={editingProduct?.howToUse || ''} rows={4} placeholder="E.g. Daily Cooking: Substitute cooking oil..."></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ flex: 1, padding: '1rem' }}>
                  {isSaving ? 'Uploading & Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                </button>
                <button type="button" disabled={isSaving} className="btn btn-outline" style={{ flex: 1, padding: '1rem' }} onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
