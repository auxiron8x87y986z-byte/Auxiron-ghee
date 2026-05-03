import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair)', color: 'var(--color-secondary-dark)', fontSize: '1.5rem' }}>Auxiron Admin</h2>
        </div>
        
        <nav style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <Link href="/admin" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-text)', display: 'block', fontWeight: 500 }}>
            Dashboard
          </Link>
          <Link href="/admin/orders" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-text)', display: 'block', fontWeight: 500 }}>
            Orders
          </Link>
          <Link href="/admin/products" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-text)', display: 'block', fontWeight: 500 }}>
            Products
          </Link>
          <Link href="/admin/blog" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-text)', display: 'block', fontWeight: 500 }}>
            Blog Posts
          </Link>
          <Link href="/admin/content" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-text)', display: 'block', fontWeight: 500 }}>
            Site Content
          </Link>
          <Link href="/admin/faq" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-text)', display: 'block', fontWeight: 500 }}>
            ❓ FAQs
          </Link>
          <Link href="/admin/users" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-text)', display: 'block', fontWeight: 500 }}>
            👥 Admin Users
          </Link>
          <div style={{ padding: '0.5rem 1.5rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            Settings
          </div>
          <Link href="/admin/settings/general" style={{ display: 'block', padding: '0.75rem 1.5rem', color: 'var(--color-text)', textDecoration: 'none', fontWeight: 500 }}>
            ⛭ General Settings
          </Link>
          <Link href="/admin/settings/account" style={{ display: 'block', padding: '0.75rem 1.5rem', color: 'var(--color-text)', textDecoration: 'none', fontWeight: 500 }}>
            👤 Account Settings
          </Link>
          <Link href="/admin/settings/contact" style={{ display: 'block', padding: '0.75rem 1.5rem', color: 'var(--color-text)', textDecoration: 'none', fontWeight: 500 }}>
            📞 Contact Settings
          </Link>
          <Link href="/admin/settings/payments" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-text)', display: 'block', fontWeight: 500 }}>
            💳 Payment Settings
          </Link>
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
          <Link href="/" target="_blank" style={{ color: 'var(--color-primary-dark)', fontSize: '0.9rem', fontWeight: 500, display: 'block', marginBottom: '1rem' }}>
            ↗ View Live Site
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
