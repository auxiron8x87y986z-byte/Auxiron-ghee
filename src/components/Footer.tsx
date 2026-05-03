import Link from 'next/link';

export default function Footer({ logoUrl, tagline }: { logoUrl?: string, tagline?: string }) {
  return (
    <footer style={{
      backgroundColor: 'var(--color-secondary-dark)',
      color: 'var(--color-surface)',
      padding: '4rem 0 2rem 0',
      marginTop: 'auto'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <div>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '1.2rem' }}>
            {logoUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={logoUrl} alt="Auxiron Logo" style={{ maxHeight: '45px', width: 'auto', objectFit: 'contain' }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ color: 'var(--color-primary)', fontSize: '1.75rem', fontFamily: 'var(--font-playfair)', fontWeight: 700, lineHeight: 1 }}>
                Auxiron
              </span>
            </div>
          </Link>
          {tagline && (
            <p style={{ color: '#E8E2D2', lineHeight: 1.6, maxWidth: '300px', fontSize: '0.95rem' }}>
              {tagline}
            </p>
          )}
        </div>
        
        <div>
          <h4 style={{ color: 'var(--color-surface)', marginBottom: '1rem', fontFamily: 'var(--font-inter)' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#E8E2D2' }}>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/product">Buy Ghee</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'var(--color-surface)', marginBottom: '1rem', fontFamily: 'var(--font-inter)' }}>Policies</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#E8E2D2' }}>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/return">Return Policy</Link></li>
            <li><Link href="/contact">Contact Support</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container" style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '2rem',
        textAlign: 'center',
        color: '#E8E2D2',
        fontSize: '0.9rem'
      }}>
        <p>&copy; {new Date().getFullYear()} Auxiron. All rights reserved.</p>
      </div>
    </footer>
  );
}
