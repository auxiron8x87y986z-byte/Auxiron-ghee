import SectionTestimonialForm from "../SectionTestimonialForm";
import Link from "next/link";

export default async function NewSectionTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const sectionId = parseInt(resolvedParams.id);

  return (
    <div style={{ padding: '2rem' }}>
      <Link href={`/admin/home-sections/${sectionId}/testimonials`} style={{ color: 'var(--color-primary-dark)', textDecoration: 'none', fontSize: '0.9rem' }}>
        ← Back to Testimonials
      </Link>
      <h1 style={{ fontSize: '1.75rem', marginTop: '1rem', marginBottom: '2rem', color: 'var(--color-secondary-dark)' }}>Add New Testimonial</h1>
      <SectionTestimonialForm sectionId={sectionId} />
    </div>
  );
}
