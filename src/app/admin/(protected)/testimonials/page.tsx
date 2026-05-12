import Link from "next/link";
import { prisma, dbFetch } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  const testimonials = await dbFetch(
    () => prisma.$queryRaw`SELECT * FROM Testimonial ORDER BY displayOrder ASC` as any,
    []
  );

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--color-secondary-dark)' }}>Manage Testimonials</h1>
        <Link href="/admin/testimonials/new" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none' }}>
          + Add New Testimonial
        </Link>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Location</th>
              <th style={{ padding: '1rem' }}>Rating</th>
              <th style={{ padding: '1rem' }}>Order</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(testimonials) && testimonials.length > 0 ? (
              testimonials.map((t: any) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{t.name}</td>
                  <td style={{ padding: '1rem' }}>{t.location}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-primary)' }}>{'★'.repeat(t.rating)}</td>
                  <td style={{ padding: '1rem' }}>{t.displayOrder}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      backgroundColor: t.isActive ? '#e8f5e9' : '#ffebee', 
                      color: t.isActive ? '#2e7d32' : '#c62828' 
                    }}>
                      {t.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Link href={`/admin/testimonials/${t.id}`} style={{ color: 'var(--color-primary-dark)', marginRight: '1rem', textDecoration: 'none', fontWeight: 500 }}>Edit</Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No testimonials found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
