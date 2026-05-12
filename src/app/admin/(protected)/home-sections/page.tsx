import Link from "next/link";
import { prisma, dbFetch } from "@/lib/prisma";
import DeleteSectionButton from "./DeleteSectionButton";

export const dynamic = "force-dynamic";

export default async function HomeSectionsAdminPage() {
  const sections = await dbFetch(
    () => prisma.$queryRaw`SELECT * FROM homesection ORDER BY displayOrder ASC` as any,
    []
  );

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--color-secondary-dark)' }}>Manage Home Sections</h1>
        <Link href="/admin/home-sections/new" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none' }}>
          + Add New Section
        </Link>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '1rem' }}>Title</th>
              <th style={{ padding: '1rem' }}>Type</th>
              <th style={{ padding: '1rem' }}>Order</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(sections) && sections.length > 0 ? (
              sections.map((s: any) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{s.title}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                      {s.sectionType}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{s.displayOrder}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      backgroundColor: s.isActive ? '#e8f5e9' : '#ffebee', 
                      color: s.isActive ? '#2e7d32' : '#c62828' 
                    }}>
                      {s.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Link href={`/admin/home-sections/${s.id}`} style={{ color: 'var(--color-primary-dark)', marginRight: '1rem', textDecoration: 'none', fontWeight: 500 }}>Edit</Link>
                    <DeleteSectionButton id={s.id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No sections found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
