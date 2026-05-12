import { prisma, dbFetch } from "@/lib/prisma";
import TestimonialForm from "../TestimonialForm";
import { notFound } from "next/navigation";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const testimonials = await dbFetch(
    () => prisma.$queryRaw`SELECT * FROM Testimonial WHERE id = ${id}` as any,
    []
  );

  if (!testimonials || testimonials.length === 0) {
    notFound();
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--color-secondary-dark)' }}>Edit Testimonial</h1>
      <TestimonialForm initialData={testimonials[0]} />
    </div>
  );
}
