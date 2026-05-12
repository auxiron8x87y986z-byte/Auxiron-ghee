import { prisma, dbFetch } from "@/lib/prisma";
import FeatureForm from "../FeatureForm";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditFeaturePage({ params }: { params: Promise<{ id: string, featureId: string }> }) {
  const resolvedParams = await params;
  const sectionId = parseInt(resolvedParams.id);
  const featureId = parseInt(resolvedParams.featureId);

  const features = await dbFetch(
    () => prisma.$queryRaw`SELECT * FROM HomeFeature WHERE id = ${featureId}` as any,
    []
  );

  if (!features || features.length === 0) {
    notFound();
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Link href={`/admin/home-sections/${sectionId}/features`} style={{ color: 'var(--color-primary-dark)', textDecoration: 'none', fontSize: '0.9rem' }}>
        ← Back to Features
      </Link>
      <h1 style={{ fontSize: '1.75rem', marginTop: '1rem', marginBottom: '2rem', color: 'var(--color-secondary-dark)' }}>Edit Feature Box</h1>
      <FeatureForm sectionId={sectionId} initialData={features[0]} />
    </div>
  );
}
