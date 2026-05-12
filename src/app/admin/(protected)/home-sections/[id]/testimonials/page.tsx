import Link from "next/link";
import { prisma, dbFetch } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SectionTestimonialsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const sectionId = parseInt(resolvedParams.id);

  const section = await dbFetch(
    () => prisma.$queryRaw`SELECT title FROM homesection WHERE id = ${sectionId}` as any,
    [] as any[]
  );

  const testimonials = await dbFetch(
    () => prisma.$queryRaw`SELECT * FROM testimonial WHERE sectionId = ${sectionId} ORDER BY displayOrder ASC` as any,
    [] as any[]
  );

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href={`/admin/home-sections/${sectionId}`} style={{ color: 'var(--color-primary-dark)', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Back to Section
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--color-secondary-dark)' }}>
            Testimonials for: {section?.[0]?.title}
          </h1>
          <Link href={`/admin/home-sections/${sectionId}/testimonials/new`} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none' }}>
            + Add New Testimonial
          </Link>
        </div>
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
                    <Link href={`/admin/home-sections/${sectionId}/testimonials/${t.id}`} style={{ color: 'var(--color-primary-dark)', marginRight: '1rem', textDecoration: 'none', fontWeight: 500 }}>Edit</Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No testimonials found for this section.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
