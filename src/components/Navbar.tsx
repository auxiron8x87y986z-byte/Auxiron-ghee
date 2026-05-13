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
            {/* Brand/Logo */}
            <Link href="/" className="logo-container" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              textDecoration: 'none',
              height: '2.8rem' // Fixed height to align logo with text
            }}>
              {logoUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={logoUrl} alt="Auxiron Logo" style={{ height: '100%', width: 'auto', objectFit: 'contain' }} />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                <span style={{ fontSize: 'clamp(1.55rem, 4vw, 1.8rem)', fontFamily: 'var(--font-playfair)', fontWeight: 700, lineHeight: 1 }}>
                  Auxiron
                </span>
                {tagline && (
                  <span style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)', color: 'var(--color-primary-dark)', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    {tagline}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" style={{
            display: 'flex',
            gap: '1.25rem',
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
          <div className="nav-actions" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', zIndex: 51 }}>
            <div className="hide-on-mobile" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: '0.75rem', alignItems: 'center' }}>
              <Link href="/checkout" className="btn btn-outline header-action-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>🛒</span> 
                <span>Cart ({totalItems})</span>
              </Link>
              
              {status === 'authenticated' ? (
                <Link href={(session?.user as any)?.role === 'admin' ? '/admin' : '/account'} className="btn btn-outline header-action-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>👤</span> 
                  <span>Account</span>
                </Link>
              ) : (
                <Link href="/login" className="btn btn-primary header-action-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>👤</span> 
                  <span>Login</span>
                </Link>
              )}
            </div>

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
            
            <div style={{ margin: '1rem 0', height: '1px', backgroundColor: 'var(--color-border)' }}></div>
            
            <Link href="/checkout" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span>🛒</span> Shopping Cart ({totalItems})
            </Link>
            
            {status === 'authenticated' ? (
              <Link href={(session?.user as any)?.role === 'admin' ? '/admin' : '/account'} onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span>👤</span> My Account
              </Link>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span>👤</span> Login / Register
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
