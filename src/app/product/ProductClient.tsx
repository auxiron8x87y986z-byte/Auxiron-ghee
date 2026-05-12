"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  volume: string;
  imageUrl: string | null;
  images: any;
  stock: number;
  healthBenefits: string | null;
  howToUse: string | null;
};

export default function ProductClient({ variants }: { variants: Product[] }) {
  const [selectedVariant, setSelectedVariant] = useState<Product>(variants[0] || null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reset active image when variant changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedVariant]);

  if (!selectedVariant) return (
    <div className="container" style={{ padding: "4rem 0", textAlign: "center", minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <h2>No products available currently.</h2>
    </div>
  );

  const handleAddToCart = () => {
    addToCart({
      volume: selectedVariant.volume,
      price: selectedVariant.price,
      quantity: quantity,
    });
    setAdded(true);
    router.push("/checkout");
  };

  const images = (selectedVariant.images && Array.isArray(selectedVariant.images) && selectedVariant.images.length > 0)
    ? selectedVariant.images
    : (selectedVariant.imageUrl ? [selectedVariant.imageUrl] : ["/images/hero_ghee.png"]);

  return (
    <div className="product-page" style={{ 
      backgroundColor: '#FAFAF8', 
      minHeight: '100vh',
      paddingBottom: '4rem',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Premium Breadcrumb Header */}
      <div style={{ backgroundColor: '#111', padding: '1.5rem 0', borderBottom: '1px solid #333' }}>
        <div className="container">
          <p style={{ color: '#D4AF37', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            <span style={{ color: '#888' }}>Home / Shop /</span> {selectedVariant.name}
          </p>
        </div>
      </div>

      <section className="section" style={{ padding: '4rem 0' }}>
        <div className="container" style={{ display: 'flex', gap: '5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          {/* Left Column: Image Showcase */}
          <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              aspectRatio: '4/5', 
              borderRadius: '24px', 
              overflow: 'hidden', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
              backgroundColor: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}>
              {/* Subtle background radial gradient */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                height: '80%',
                background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, rgba(255,255,255,0) 70%)',
                zIndex: 0
              }} />
              
              <Image 
                src={images[activeImageIndex]} 
                alt={selectedVariant.name} 
                fill 
                style={{ objectFit: 'contain', padding: '2rem', zIndex: 1, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' }}
                className="product-hero-image"
              />
            </div>
            
            {/* Thumbnails Gallery */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', padding: '0.5rem 0' }}>
                {images.map((imgUrl: string, idx: number) => (
                  <button 
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    style={{ 
                      position: 'relative', 
                      width: '80px', 
                      height: '80px', 
                      flexShrink: 0,
                      borderRadius: '12px', 
                      border: activeImageIndex === idx ? '2px solid #D4AF37' : '1px solid #E0E0E0',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      backgroundColor: '#fff',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    <Image src={imgUrl} alt={`Thumbnail ${idx}`} fill style={{ objectFit: 'contain', padding: '0.5rem' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details */}
          <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ 
                backgroundColor: 'rgba(212, 175, 55, 0.1)', 
                color: '#B8860B', 
                padding: '0.4rem 1rem', 
                borderRadius: '30px', 
                fontSize: '0.8rem', 
                fontWeight: 600,
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                100% Pure & Organic
              </span>
              <span style={{ 
                color: selectedVariant.stock > 0 ? '#2E7D32' : '#D32F2F', 
                fontSize: '0.9rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: selectedVariant.stock > 0 ? '#2E7D32' : '#D32F2F' }} />
                {selectedVariant.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: '#111', fontWeight: 800, letterSpacing: '-1px' }}>
              {selectedVariant.name}
            </h1>
            
            <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Crafted using the ancient Vedic Bilona method from A2 cow milk. Experience the golden standard of purity, nutrition, and aroma.
            </p>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#D4AF37' }}>
                ₹{selectedVariant.price.toLocaleString('en-IN')}
              </span>
              <span style={{ color: '#888', textDecoration: 'line-through', fontSize: '1.2rem' }}>
                ₹{Math.round(selectedVariant.price * 1.2).toLocaleString('en-IN')}
              </span>
              <span style={{ color: '#2E7D32', fontWeight: 600, fontSize: '1rem' }}>
                Save 20%
              </span>
            </div>

            {/* Variant Selector */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', color: '#333', fontWeight: 600 }}>Select Volume</h3>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {variants.map((variant) => {
                  const isSelected = selectedVariant.volume === variant.volume;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      style={{
                        padding: '0.8rem 1.5rem',
                        border: `2px solid ${isSelected ? '#D4AF37' : '#E0E0E0'}`,
                        backgroundColor: isSelected ? '#FFFDF5' : '#FFF',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: isSelected ? '#D4AF37' : '#555',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? '0 4px 12px rgba(212,175,55,0.15)' : 'none',
                        opacity: variant.stock > 0 ? 1 : 0.5,
                        transform: isSelected ? 'translateY(-2px)' : 'none'
                      }}
                      disabled={variant.stock === 0}
                    >
                      {variant.volume}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add to Cart Area */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: '#FFF',
                border: '1px solid #E0E0E0', 
                borderRadius: '12px', 
                overflow: 'hidden',
                height: '56px'
              }}>
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '45px', height: '100%', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', color: '#555' }} disabled={selectedVariant.stock === 0}>-</button>
                <span style={{ width: '40px', textAlign: 'center', fontWeight: 600, fontSize: '1.1rem' }}>{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)} style={{ width: '45px', height: '100%', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', color: '#555' }} disabled={selectedVariant.stock === 0 || quantity >= selectedVariant.stock}>+</button>
              </div>
              
              <button 
                type="button"
                onClick={handleAddToCart} 
                style={{ 
                  flex: 1, 
                  height: '56px',
                  backgroundColor: added ? '#2E7D32' : '#111', 
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  cursor: selectedVariant.stock === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: added ? '0 10px 20px rgba(46,125,50,0.2)' : '0 10px 20px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }} 
                disabled={selectedVariant.stock === 0}
              >
                {selectedVariant.stock === 0 ? 'Out of Stock' : added ? (
                  <>✓ Added to Cart</>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* Trust Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', paddingTop: '2rem', borderTop: '1px solid #E0E0E0' }}>
              {[
                { icon: '🚚', title: 'Free Delivery', sub: 'Jaipur & Jodhpur' },
                { icon: '🌿', title: '100% Pure', sub: 'No Preservatives' },
                { icon: '🛡️', title: 'Secure Pay', sub: '100% Encrypted' }
              ].map((badge, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
                  <div style={{ fontSize: '1.8rem' }}>{badge.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#333' }}>{badge.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>{badge.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="container" style={{ marginTop: '2rem' }}>
        <div style={{ backgroundColor: '#FFF', borderRadius: '24px', padding: '3rem', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #E0E0E0', marginBottom: '2rem' }}>
            {[
              { id: 'description', label: 'Description' },
              { id: 'benefits', label: 'Health Benefits' },
              { id: 'usage', label: 'How to Use' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0 0 1rem 0',
                  fontSize: '1.1rem',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  color: activeTab === tab.id ? '#111' : '#888',
                  borderBottom: activeTab === tab.id ? '3px solid #D4AF37' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ color: '#555', lineHeight: 1.8, fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
            {activeTab === 'description' && (
              <div>
                <p>{selectedVariant.description}</p>
              </div>
            )}
            {activeTab === 'benefits' && (
              <div>
                {selectedVariant.healthBenefits ? (
                  selectedVariant.healthBenefits
                ) : (
                  <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <li><strong>Rich in A2 Protein:</strong> Easier to digest and promotes better gut health.</li>
                    <li><strong>Boosts Immunity:</strong> Packed with fat-soluble vitamins A, D, E, and K.</li>
                    <li><strong>Heart Healthy:</strong> Contains conjugated linoleic acid (CLA) which helps reduce bad cholesterol.</li>
                    <li><strong>Improves Digestion:</strong> Stimulates the secretion of stomach acids to help with digestion.</li>
                    <li><strong>Glowing Skin:</strong> Natural antioxidants help keep your skin healthy and glowing.</li>
                  </ul>
                )}
              </div>
            )}
            {activeTab === 'usage' && (
              <div>
                {selectedVariant.howToUse ? (
                  selectedVariant.howToUse
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p><strong>Daily Cooking:</strong> Substitute cooking oil with our Bilona ghee for a healthier, richer flavor in your curries, dals, and stir-fries.</p>
                    <p><strong>Baking:</strong> Use as a healthy fat alternative in your baking recipes.</p>
                    <p><strong>Direct Consumption:</strong> Consume 1 teaspoon daily on an empty stomach with warm water to lubricate joints and improve digestion.</p>
                    <p><strong>External Use:</strong> Excellent as a natural moisturizer for dry skin and chapped lips.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Adding a CSS animation style block */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .product-hero-image {
          animation: float 6s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
