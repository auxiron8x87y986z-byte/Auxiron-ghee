"use client";

import { useState } from "react";
import { saveGeneralSettings } from "./actions";

export default function GeneralSettingsForm({ initialLogo, initialTagline, initialHeroBg, initialHeroBgMobile }: { initialLogo: string, initialTagline: string, initialHeroBg: string, initialHeroBgMobile: string }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialLogo || null);
  
  const [selectedHeroBgFile, setSelectedHeroBgFile] = useState<File | null>(null);
  const [heroBgPreviewUrl, setHeroBgPreviewUrl] = useState<string | null>(initialHeroBg || null);

  const [selectedHeroBgMobileFile, setSelectedHeroBgMobileFile] = useState<File | null>(null);
  const [heroBgMobilePreviewUrl, setHeroBgMobilePreviewUrl] = useState<string | null>(initialHeroBgMobile || null);

  const [tagline, setTagline] = useState(initialTagline);
  
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    setSuccessMsg(false);

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image must be smaller than 2MB");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Only JPG, PNG, WebP, and SVG are supported for logos");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setSuccessMsg(false);
  };

  const handleHeroBgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    setSuccessMsg(false);

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image must be smaller than 2MB");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Only JPG, PNG, and WebP are supported for backgrounds");
      return;
    }

    setSelectedHeroBgFile(file);
    setHeroBgPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveHeroBg = () => {
    setSelectedHeroBgFile(null);
    setHeroBgPreviewUrl(null);
    setSuccessMsg(false);
  };

  const handleHeroBgMobileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    setSuccessMsg(false);

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image must be smaller than 2MB");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Only JPG, PNG, and WebP are supported for backgrounds");
      return;
    }

    setSelectedHeroBgMobileFile(file);
    setHeroBgMobilePreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveHeroBgMobile = () => {
    setSelectedHeroBgMobileFile(null);
    setHeroBgMobilePreviewUrl(null);
    setSuccessMsg(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setUploadError(null);
    setSuccessMsg(false);

      try {
        let finalImageUrl = initialLogo;
        let finalHeroBgUrl = initialHeroBg;

        if (selectedFile) {
          const uploadData = new FormData();
          uploadData.append("file", selectedFile);
          const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadData });
          const uploadResult = await uploadRes.json();
          if (!uploadRes.ok) throw new Error(uploadResult.error || "Failed to upload logo");
          finalImageUrl = uploadResult.url;
        } else if (previewUrl === null) {
          finalImageUrl = "";
        }

        if (selectedHeroBgFile) {
          const uploadDataBg = new FormData();
          uploadDataBg.append("file", selectedHeroBgFile);
          const uploadResBg = await fetch("/api/upload", { method: "POST", body: uploadDataBg });
          const uploadResultBg = await uploadResBg.json();
          if (!uploadResBg.ok) throw new Error(uploadResultBg.error || "Failed to upload hero background");
          finalHeroBgUrl = uploadResultBg.url;
        } else if (heroBgPreviewUrl === null) {
          finalHeroBgUrl = "";
        }

        let finalHeroBgMobileUrl = initialHeroBgMobile;
        if (selectedHeroBgMobileFile) {
          const uploadDataBgMob = new FormData();
          uploadDataBgMob.append("file", selectedHeroBgMobileFile);
          const uploadResBgMob = await fetch("/api/upload", { method: "POST", body: uploadDataBgMob });
          const uploadResultBgMob = await uploadResBgMob.json();
          if (!uploadResBgMob.ok) throw new Error(uploadResultBgMob.error || "Failed to upload mobile background");
          finalHeroBgMobileUrl = uploadResultBgMob.url;
        } else if (heroBgMobilePreviewUrl === null) {
          finalHeroBgMobileUrl = "";
        }

        const formData = new FormData();
        formData.append("site_logo", finalImageUrl.replace(/^public\//, "/"));
        formData.append("site_tagline", tagline);
        formData.append("hero_background", finalHeroBgUrl.replace(/^public\//, "/"));
        formData.append("hero_background_mobile", finalHeroBgMobileUrl.replace(/^public\//, "/"));

      await saveGeneralSettings(formData);
      setSuccessMsg(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (error: any) {
      setUploadError(error.message || "An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', maxWidth: '800px' }}>
      
      {uploadError && (
        <div style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '8px' }}>
          {uploadError}
        </div>
      )}
      
      {successMsg && (
        <div style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '8px' }}>
          Settings saved successfully! Changes will reflect across the website immediately.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Logo Section */}
        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Site Logo</h2>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            This logo will appear in the main navigation bar and footer. If removed, the site will default to displaying the text "Auxiron".
          </p>
          
          {previewUrl ? (
            <div style={{ marginBottom: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1.5rem', display: 'inline-block', backgroundColor: '#fafafa' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Site Logo Preview" style={{ maxWidth: '200px', maxHeight: '80px', objectFit: 'contain', display: 'block', marginBottom: '1rem' }} />
              <button type="button" onClick={handleRemoveImage} style={{ color: '#d32f2f', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem' }}>
                Remove Logo
              </button>
            </div>
          ) : (
            <div style={{ marginBottom: '1rem' }}>
              <input 
                type="file" 
                accept="image/jpeg, image/png, image/webp, image/svg+xml" 
                onChange={handleFileChange}
                style={{ padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', width: '100%', maxWidth: '400px' }}
              />
              <small style={{ color: 'var(--color-text-light)', display: 'block', marginTop: '0.5rem' }}>Max size: 2MB. Recommended format: Transparent PNG or SVG.</small>
            </div>
          )}
        </div>

        {/* Hero Background Section */}
        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Hero Background (Desktop/Tablet)</h2>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            This background image will be used for Desktop and Tablet screens.
          </p>
          
          {heroBgPreviewUrl ? (
            <div style={{ marginBottom: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1.5rem', display: 'inline-block', backgroundColor: '#fafafa', width: '100%' }}>
              <div style={{ position: 'relative', width: '100%', height: '150px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroBgPreviewUrl} alt="Hero Background Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <button type="button" onClick={handleRemoveHeroBg} style={{ color: '#d32f2f', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem' }}>
                Remove Background
              </button>
            </div>
          ) : (
            <div style={{ marginBottom: '1rem' }}>
              <input 
                type="file" 
                accept="image/jpeg, image/png, image/webp" 
                onChange={handleHeroBgFileChange}
                style={{ padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', width: '100%', maxWidth: '400px' }}
              />
              <small style={{ color: 'var(--color-text-light)', display: 'block', marginTop: '0.5rem' }}>Max size: 2MB. Recommended: 1920x1080px.</small>
            </div>
          )}
        </div>

        {/* Hero Background Mobile Section */}
        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Hero Background (Mobile)</h2>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Optional: Set a different background image for mobile devices (screens smaller than 768px).
          </p>
          
          {heroBgMobilePreviewUrl ? (
            <div style={{ marginBottom: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1.5rem', display: 'inline-block', backgroundColor: '#fafafa', width: '100%' }}>
              <div style={{ position: 'relative', width: '150px', height: '200px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem', margin: '0 auto' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroBgMobilePreviewUrl} alt="Hero Mobile Background Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <button type="button" onClick={handleRemoveHeroBgMobile} style={{ color: '#d32f2f', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem' }}>
                Remove Mobile Background
              </button>
            </div>
          ) : (
            <div style={{ marginBottom: '1rem' }}>
              <input 
                type="file" 
                accept="image/jpeg, image/png, image/webp" 
                onChange={handleHeroBgMobileFileChange}
                style={{ padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', width: '100%', maxWidth: '400px' }}
              />
              <small style={{ color: 'var(--color-text-light)', display: 'block', marginTop: '0.5rem' }}>Max size: 2MB. Recommended: 800x1200px (Portrait).</small>
            </div>
          )}
        </div>

        {/* Tagline Section */}
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Site Tagline</h2>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            A short description of your brand that appears in the footer and SEO metadata.
          </p>
          <input 
            type="text" 
            value={tagline}
            onChange={(e) => { setTagline(e.target.value); setSuccessMsg(false); }}
            placeholder="e.g. Identity of Purity"
            style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '1rem' }}
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </form>
    </div>
  );
}
