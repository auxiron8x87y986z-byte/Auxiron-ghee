import { prisma, dbFetch } from "@/lib/prisma";
import HomeSectionForm from "../HomeSectionForm";
import { notFound } from "next/navigation";

export default async function EditHomeSectionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const sections = await dbFetch(
    () => prisma.$queryRaw`SELECT * FROM homesection WHERE id = ${id}` as any,
    []
  );

  if (!sections || sections.length === 0) {
    notFound();
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--color-secondary-dark)' }}>Edit Home Section</h1>
      <HomeSectionForm initialData={sections[0]} />
    </div>
  );
}
