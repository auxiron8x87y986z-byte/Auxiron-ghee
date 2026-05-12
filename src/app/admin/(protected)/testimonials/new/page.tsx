import TestimonialForm from "../TestimonialForm";

export default function NewTestimonialPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--color-secondary-dark)' }}>Add New Testimonial</h1>
      <TestimonialForm />
    </div>
  );
}
