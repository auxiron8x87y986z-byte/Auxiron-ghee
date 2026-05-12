import Link from "next/link";
import { prisma, dbFetch } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomeFeaturesAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const sectionId = parseInt(resolvedParams.id);

  const section = await dbFetch(
    () => prisma.$queryRaw`SELECT title FROM HomeSection WHERE id = ${sectionId}` as any,
    [] as any[]
  );

  const features = await dbFetch(
    () => prisma.$queryRaw`SELECT * FROM HomeFeature WHERE sectionId = ${sectionId} ORDER BY displayOrder ASC` as any,
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
            Boxes / Features for: {section?.[0]?.title}
          </h1>
          <Link href={`/admin/home-sections/${sectionId}/features/new`} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none' }}>
            + Add New Box
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {Array.isArray(features) && features.length > 0 ? (
          features.map((f: any) => (
            <div key={f.id} style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>{f.icon}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href={`/admin/home-sections/${sectionId}/features/${f.id}`} style={{ fontSize: '0.85rem', color: 'var(--color-primary-dark)', fontWeight: 600, textDecoration: 'none' }}>Edit</Link>
                </div>
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--color-secondary-dark)' }}>{f.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.5, marginBottom: '1rem' }}>{f.description}</p>
              <div style={{ fontSize: '0.8rem', color: '#999', display: 'flex', justifyContent: 'space-between' }}>
                <span>Order: {f.displayOrder}</span>
                <span style={{ color: f.isActive ? '#2e7d32' : '#c62828' }}>{f.isActive ? "Active" : "Inactive"}</span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', backgroundColor: '#fff', borderRadius: '12px', border: '1px dashed #ccc' }}>
            No boxes found for this section. Click "+ Add New Box" to start.
          </div>
        )}
      </div>
    </div>
  );
}
