import HomeSectionForm from "../HomeSectionForm";

export default function NewHomeSectionPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--color-secondary-dark)' }}>Add Home Section</h1>
      <HomeSectionForm />
    </div>
  );
}
