import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getFAQs } from "@/app/actions/faq";
import { getContactSettings } from "@/app/actions/settings";
import FaqAccordion from "@/components/FaqAccordion";
export default async function Home() {
  const blocks = await prisma.contentBlock.findMany({
    where: { key: { in: ["hero_background"] } }
  });
  const heroBg = blocks.find(b => b.key === "hero_background")?.value || "/images/auxiron_hero_premium.png";
  
  const { faqs } = await getFAQs();
  const { settings } = await getContactSettings();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section" style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        padding: '4rem 0',
        color: '#FFFFFF',
        background: '#1A1A1A'
      }}>
        {/* Background Image */}
        <Image 
          src={heroBg} 
          alt="Premium Auxiron Ghee Background" 
          fill 
          className="hero-bg-image"
          style={{ objectFit: 'cover', objectPosition: 'center right', zIndex: 0 }}
          priority
        />
        {/* Gradient Overlay (Dark on Left, Transparent on Right) */}
        <div className="hero-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to right, rgba(20,20,20,0.9) 0%, rgba(20,20,20,0.7) 45%, rgba(20,20,20,0) 100%)',
          zIndex: 1
        }} />

        {/* Content Container */}
        <div className="container hero-content-container" style={{ position: 'relative', zIndex: 2, display: 'flex', width: '100%' }}>
          <div style={{ flex: '0 1 650px' }}>
            {/* Top Line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ 
                color: 'var(--color-primary)', 
                fontWeight: 500, 
                fontSize: '1.1rem',
                letterSpacing: '0.5px'
              }}>Pure by Tradition. Trusted for Generations.</span>
              <div style={{ height: '1px', width: '50px', backgroundColor: 'var(--color-primary)' }}></div>
            </div>
            
            {/* Main Heading */}
            <h1 className="hero-title" style={{ 
              fontSize: 'clamp(3.5rem, 6vw, 5.5rem)', 
              lineHeight: 1.1, 
              marginBottom: '1.5rem',
              color: '#FFFFFF'
            }}>
              Shuddh Desi<br/>
              <span style={{ color: 'var(--color-primary)' }}>Bilona Ghee</span>
            </h1>
            
            {/* Short Description */}
            <p className="hero-desc" style={{ 
              fontSize: '1.2rem', 
              color: '#E0E0E0', 
              marginBottom: '2.5rem',
              lineHeight: 1.7,
              maxWidth: '550px'
            }}>
              Made with love using the traditional Bilona method, our ghee is 100% pure, organic and packed with the goodness of nature.
            </p>

            {/* Feature Icons Row */}
            <div className="hero-feature-icons" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              {[
                { icon: '🌿', label: '100% Pure' },
                { icon: '🪵', label: 'Bilona Method' },
                { icon: '🌱', label: 'Organic' },
                { icon: '🛡️', label: 'No Preservatives' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--color-primary)', fontSize: '1.2rem' }}>{item.icon}</span>
                  <span style={{ color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 500 }}>{item.label}</span>
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="hero-buttons" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <Link href="/product" className="btn" style={{ 
                backgroundColor: 'var(--color-primary)',
                color: '#1A1A1A',
                padding: '1rem 2.5rem', 
                fontSize: '1.1rem', 
                fontWeight: 600,
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                Shop Now <span>→</span>
              </Link>
              <Link href="/about" className="btn" style={{ 
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                border: '1px solid var(--color-primary)',
                padding: '1rem 2.5rem', 
                fontSize: '1.1rem',
                fontWeight: 500,
                borderRadius: '8px'
              }}>
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Info Bar (Below Hero) */}
      <section style={{ backgroundColor: '#FFFDF7', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', padding: '2rem 0', gap: '2rem' }}>
          {[
            { icon: '🚚', title: 'Free Delivery', desc: 'Jaipur & Jodhpur' },
            { icon: '🔒', title: 'Secure Payment', desc: 'Razorpay | Stripe | UPI | Bank Transfer' },
            { icon: '⭐', title: 'Premium Quality', desc: 'Made with Bilona Method' },
            { icon: '📅', title: 'Fast Delivery', desc: 'Up to 4 Days' }
          ].map((feature, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>{feature.icon}</div>
              <div>
                <h4 style={{ color: 'var(--color-secondary-dark)', fontWeight: 600, fontSize: '0.95rem' }}>{feature.title}</h4>
                <p style={{ color: 'var(--color-text-light)', fontSize: '0.85rem' }}>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Auxiron Section */}
      <section className="section" style={{ backgroundColor: '#FFFFFF', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-secondary-dark)', marginBottom: '1rem' }}>Why Choose Auxiron?</h2>
            <p style={{ color: 'var(--color-text-light)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              We bring you the purest form of health, deeply rooted in tradition and crafted with uncompromising quality.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { 
                icon: '🏺', 
                title: 'Traditional Bilona Method', 
                desc: 'Unlike modern machine-made ghee, our ghee is crafted from A2 cow milk curd, hand-churned using the age-old wooden Bilona to retain maximum nutrition.' 
              },
              { 
                icon: '🐄', 
                title: 'Pure A2 Cow Milk', 
                desc: 'We strictly use milk from indigenous, grass-fed cows. This ensures our ghee is rich in A2 protein, making it easier to digest and healthier for your heart.' 
              },
              { 
                icon: '✨', 
                title: '100% Organic & Pure', 
                desc: 'No preservatives, no artificial colors, no additives. Just pure, golden health in every spoonful, exactly as nature intended.' 
              },
              { 
                icon: '👨‍🌾', 
                title: 'Direct from Farm to Home', 
                desc: 'By eliminating middlemen, we ensure that the freshest batch of ghee reaches your doorstep directly from our local farms in Jaipur and Jodhpur.' 
              },
              {
                icon: '🤲',
                title: 'Small Batch Production',
                desc: 'We craft our ghee in small, carefully monitored batches. This meticulous attention to detail ensures superior quality and consistency in every jar.'
              },
              {
                icon: '💛',
                title: 'Rich Aroma & Granular Texture',
                desc: 'Experience the authentic, nutty aroma and perfect Danedar (granular) texture that only true, slow-cooked Bilona ghee can offer.'
              }
            ].map((feature, i) => (
              <div key={i} style={{ 
                padding: '2.5rem', 
                backgroundColor: '#FFFDF7', 
                borderRadius: 'var(--radius-lg)', 
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
                   {feature.icon}
                </div>
                <h3 style={{ marginBottom: '1rem', color: 'var(--color-secondary-dark)', fontSize: '1.25rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section" style={{ backgroundColor: '#FFFDF7', padding: '5rem 0', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: 'var(--color-primary)', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem', display: 'block', marginBottom: '1rem' }}>Our Happy Customers</span>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-secondary-dark)' }}>Trusted in Jaipur & Jodhpur</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            {[
              {
                name: 'Rahul Agarwal',
                location: 'Jaipur',
                text: 'The aroma takes me back to my childhood! Truly the most authentic bilona ghee I have tasted in years. The texture is perfectly granular.',
                rating: 5
              },
              {
                name: 'Priya Rathore',
                location: 'Jodhpur',
                text: 'I switched to Auxiron for my family\'s daily cooking and the difference in taste is remarkable. Premium quality and great packaging.',
                rating: 5
              },
              {
                name: 'Sanjay Sharma',
                location: 'Jaipur',
                text: 'Finally, a brand that delivers on its promise of purity. Fast delivery and the glass jar ensures the ghee stays fresh and healthy.',
                rating: 5
              }
            ].map((testimonial, i) => (
              <div key={i} style={{ 
                padding: '2.5rem', 
                backgroundColor: '#FFFFFF', 
                borderRadius: 'var(--radius-lg)', 
                boxShadow: 'var(--shadow-md)',
                position: 'relative'
              }}>
                <div style={{ color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '1rem' }}>
                  {'★'.repeat(testimonial.rating)}
                </div>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '2rem' }}>
                  "{testimonial.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.2)', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '1.2rem' }}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--color-secondary-dark)', fontWeight: 600, fontSize: '1rem' }}>{testimonial.name}</h4>
                    <p style={{ color: 'var(--color-text-light)', fontSize: '0.85rem' }}>{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section" style={{ backgroundColor: '#FFFFFF', padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-secondary-dark)', marginBottom: '1rem' }}>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--color-text-light)', fontSize: '1.1rem' }}>Got questions? We've got answers.</p>
          </div>
          
            <FaqAccordion faqs={faqs || []} />
        </div>
      </section>

    </div>
  );
}
