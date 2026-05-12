"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function Navbar({ logoUrl, tagline }: { logoUrl?: string, tagline?: string }) {
  const { totalItems } = useCart();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 253, 247, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '80px'
        }}>
          {/* Logo & Branding */}
          <div className="logo" style={{
            fontFamily: 'var(--font-playfair)',
            color: 'var(--color-secondary-dark)',
            zIndex: 51,
            display: 'flex',
            alignItems: 'center'
          }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}>
              {logoUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={logoUrl} alt="Auxiron Logo" style={{ maxHeight: '45px', width: 'auto', objectFit: 'contain' }} />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1 }}>Auxiron</span>
                {tagline && (
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-inter)', color: 'var(--color-text-light)', fontWeight: 500, marginTop: '2px', letterSpacing: '0.5px' }}>
                    {tagline}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" style={{
            display: 'flex',
            gap: '2rem',
            fontWeight: 500,
            color: 'var(--color-text)'
          }}>
            <Link href="/">Home</Link>
            <Link href="/about">About Us</Link>
            <Link href="/product">Product</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
          </nav>

          {/* Actions (Cart & Account) */}
          <div className="nav-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center', zIndex: 51 }}>
            <Link href="/checkout" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
              🛒 Cart ({totalItems})
            </Link>
            
            {status === 'authenticated' ? (
              <Link href={(session?.user as any)?.role === 'admin' ? '/admin' : '/account'} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                👤 Account
              </Link>
            ) : (
              <Link href="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                🔑 Login
              </Link>
            )}

            <button 
              className="mobile-menu-btn" 
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu Full Screen Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-overlay">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-secondary-dark)' }}>
              Menu
            </div>
            <button 
              className="mobile-menu-close-btn" 
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <nav className="mobile-nav-menu">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            <Link href="/product" onClick={() => setIsMobileMenuOpen(false)}>Product</Link>
            <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          </nav>
        </div>
      )}
    </>
  );
}
