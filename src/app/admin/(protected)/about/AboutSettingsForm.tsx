"use client";

import { useState } from "react";
import { saveAboutSettings } from "./actions";

type ExtraSection = {
  heading: string;
  content: string;
  imageUrl: string;
};

export default function AboutSettingsForm({ 
  initialHeading, 
  initialIntro, 
  initialHeroImage,
  initialMethodHeading,
  initialMethod, 
  initialFarmImage, 
  initialPromiseHeading,
  initialPurityImage,
  initialPromises,
  initialExtraSections
}: { 
  initialHeading: string, 
  initialIntro: string, 
  initialHeroImage: string,
  initialMethodHeading: string,
  initialMethod: string, 
  initialFarmImage: string, 
  initialPromiseHeading: string,
  initialPurityImage: string,
  initialPromises: string,
  initialExtraSections: string
}) {
  // Main Top Section
  const [heading, setHeading] = useState(initialHeading);
  const [intro, setIntro] = useState(initialIntro);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(initialHeroImage || null);

  // Method Section
  const [methodHeading, setMethodHeading] = useState(initialMethodHeading);
  const [methodText, setMethodText] = useState(initialMethod);
  const [farmImageFile, setFarmImageFile] = useState<File | null>(null);
  const [farmImagePreview, setFarmImagePreview] = useState<string | null>(initialFarmImage || null);
  
  // Promise Section
  const [promiseHeading, setPromiseHeading] = useState(initialPromiseHeading);
  const [promises, setPromises] = useState<string[]>(() => {
    try { return JSON.parse(initialPromises); } catch { return []; }
  });
  const [purityImageFile, setPurityImageFile] = useState<File | null>(null);
  const [purityImagePreview, setPurityImagePreview] = useState<string | null>(initialPurityImage || null);

  // Extra Sections
  const [extraSections, setExtraSections] = useState<ExtraSection[]>(() => {
    try { return JSON.parse(initialExtraSections); } catch { return []; }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: any, setPreview: any) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    setSuccessMsg(false);

    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image must be smaller than 2MB");
      return;
    }

    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = (setFile: any, setPreview: any) => {
    setFile(null);
    setPreview(null);
    setSuccessMsg(false);
  };

  const uploadInstant = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) throw new Error("Image must be smaller than 2MB");
    const uploadData = new FormData();
    uploadData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: uploadData });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to upload image");
    return result.url;
  };

  const handleExtraSectionImage = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadError(null);
      const url = await uploadInstant(file);
      const newSections = [...extraSections];
      newSections[index].imageUrl = url;
      setExtraSections(newSections);
    } catch (err: any) {
      setUploadError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setUploadError(null);
    setSuccessMsg(false);

    try {
      let finalHeroImageUrl = initialHeroImage;
      let finalFarmImageUrl = initialFarmImage;
      let finalPurityImageUrl = initialPurityImage;

      if (heroImageFile) finalHeroImageUrl = await uploadInstant(heroImageFile);
      else if (heroImagePreview === null) finalHeroImageUrl = "";

      if (farmImageFile) finalFarmImageUrl = await uploadInstant(farmImageFile);
      else if (farmImagePreview === null) finalFarmImageUrl = "";

      if (purityImageFile) finalPurityImageUrl = await uploadInstant(purityImageFile);
      else if (purityImagePreview === null) finalPurityImageUrl = "";

      const formData = new FormData();
      formData.append("about_heading", heading);
      formData.append("about_intro", intro);
      formData.append("about_hero_image", finalHeroImageUrl);

      formData.append("about_method_heading", methodHeading);
      formData.append("about_method_text", methodText);
      formData.append("about_farm_image", finalFarmImageUrl);

      formData.append("about_promise_heading", promiseHeading);
      formData.append("about_purity_image", finalPurityImageUrl);
      formData.append("about_promise_items", JSON.stringify(promises));
      
      formData.append("about_extra_sections", JSON.stringify(extraSections));

      await saveAboutSettings(formData);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (error: any) {
      setUploadError(error.message || "An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', maxWidth: '900px' }}>
      
      {uploadError && (
        <div style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '8px' }}>{uploadError}</div>
      )}
      
      {successMsg && (
        <div style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '8px' }}>About Us page settings saved successfully!</div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Section 1: Main Introduction */}
        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Section 1: Main Introduction</h2>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Main Heading</label>
            <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Introductory Paragraph</label>
            <textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={4} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Hero Image</label>
            {heroImagePreview ? (
              <div style={{ marginBottom: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1rem', display: 'inline-block' }}>
                <img src={heroImagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'contain', display: 'block', marginBottom: '1rem' }} />
                <button type="button" onClick={() => handleRemoveImage(setHeroImageFile, setHeroImagePreview)} style={{ color: '#d32f2f', border: 'none', background: 'none', cursor: 'pointer' }}>Remove Image</button>
              </div>
            ) : (
              <input type="file" accept="image/jpeg, image/png, image/webp" onChange={(e) => handleFileChange(e, setHeroImageFile, setHeroImagePreview)} />
            )}
          </div>
        </div>

        {/* Section 2: The Bilona Method */}
        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Section 2: Secondary Content</h2>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Section Heading</label>
            <input type="text" value={methodHeading} onChange={(e) => setMethodHeading(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Content</label>
            <textarea value={methodText} onChange={(e) => setMethodText(e.target.value)} rows={5} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Section Image (Left side)</label>
            {farmImagePreview ? (
              <div style={{ marginBottom: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1rem', display: 'inline-block' }}>
                <img src={farmImagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'contain', display: 'block', marginBottom: '1rem' }} />
                <button type="button" onClick={() => handleRemoveImage(setFarmImageFile, setFarmImagePreview)} style={{ color: '#d32f2f', border: 'none', background: 'none', cursor: 'pointer' }}>Remove Image</button>
              </div>
            ) : (
              <input type="file" accept="image/jpeg, image/png, image/webp" onChange={(e) => handleFileChange(e, setFarmImageFile, setFarmImagePreview)} />
            )}
          </div>
        </div>

        {/* Section 3: Our Promise Array */}
        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Section 3: Feature List</h2>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Section Heading</label>
            <input type="text" value={promiseHeading} onChange={(e) => setPromiseHeading(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
          </div>
          
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>List Items</label>
          {promises.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <input type="text" value={p} onChange={(e) => { const n = [...promises]; n[i] = e.target.value; setPromises(n); }} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
              <button type="button" onClick={() => setPromises(promises.filter((_, idx) => idx !== i))} style={{ padding: '0.8rem', backgroundColor: '#ffebee', color: '#c62828', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => setPromises([...promises, ""])} className="btn btn-outline" style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>+ Add Item</button>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Section Image (Right side)</label>
            {purityImagePreview ? (
              <div style={{ marginBottom: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1rem', display: 'inline-block' }}>
                <img src={purityImagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'contain', display: 'block', marginBottom: '1rem' }} />
                <button type="button" onClick={() => handleRemoveImage(setPurityImageFile, setPurityImagePreview)} style={{ color: '#d32f2f', border: 'none', background: 'none', cursor: 'pointer' }}>Remove Image</button>
              </div>
            ) : (
              <input type="file" accept="image/jpeg, image/png, image/webp" onChange={(e) => handleFileChange(e, setPurityImageFile, setPurityImagePreview)} />
            )}
          </div>
        </div>

        {/* Extra Dynamic Sections */}
        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Additional Sections</h2>
          {extraSections.map((sec, i) => (
            <div key={i} style={{ border: '1px solid var(--color-border)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', backgroundColor: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem' }}>Section {i + 4}</h3>
                <button type="button" onClick={() => setExtraSections(extraSections.filter((_, idx) => idx !== i))} style={{ color: '#c62828', background: 'none', border: 'none', cursor: 'pointer' }}>Remove Section</button>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Heading</label>
                <input type="text" value={sec.heading} onChange={(e) => { const n = [...extraSections]; n[i].heading = e.target.value; setExtraSections(n); }} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Content</label>
                <textarea value={sec.content} onChange={(e) => { const n = [...extraSections]; n[i].content = e.target.value; setExtraSections(n); }} rows={4} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Image (Optional)</label>
                {sec.imageUrl ? (
                  <div style={{ marginBottom: '1rem' }}>
                    <img src={sec.imageUrl} alt="Section image" style={{ maxHeight: '100px', display: 'block', marginBottom: '0.5rem' }} />
                    <button type="button" onClick={() => { const n = [...extraSections]; n[i].imageUrl = ""; setExtraSections(n); }} style={{ color: '#c62828', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>Remove Image</button>
                  </div>
                ) : (
                  <input type="file" accept="image/jpeg, image/png, image/webp" onChange={(e) => handleExtraSectionImage(e, i)} />
                )}
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setExtraSections([...extraSections, { heading: '', content: '', imageUrl: '' }])} className="btn btn-outline" style={{ marginTop: '0.5rem' }}>+ Add Custom Section</button>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>{isSaving ? 'Saving...' : 'Save Settings'}</button>
        </div>
      </form>
    </div>
  );
}
