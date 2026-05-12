import { prisma, dbFetch } from "@/lib/prisma";
import SectionTestimonialForm from "../SectionTestimonialForm";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditSectionTestimonialPage({ params }: { params: Promise<{ id: string, testimonialId: string }> }) {
  const resolvedParams = await params;
  const sectionId = parseInt(resolvedParams.id);
  const testimonialId = parseInt(resolvedParams.testimonialId);

  const testimonials = await dbFetch(
    () => prisma.$queryRaw`SELECT * FROM Testimonial WHERE id = ${testimonialId}` as any,
    []
  );

  if (!testimonials || testimonials.length === 0) {
    notFound();
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Link href={`/admin/home-sections/${sectionId}/testimonials`} style={{ color: 'var(--color-primary-dark)', textDecoration: 'none', fontSize: '0.9rem' }}>
        ← Back to Testimonials
      </Link>
      <h1 style={{ fontSize: '1.75rem', marginTop: '1rem', marginBottom: '2rem', color: 'var(--color-secondary-dark)' }}>Edit Testimonial</h1>
      <SectionTestimonialForm sectionId={sectionId} initialData={testimonials[0]} />
    </div>
  );
}
