import { getFAQs } from "@/app/actions/faq";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata = {
  title: "FAQ | Auxiron",
  description: "Frequently Asked Questions about our Shuddh Deshi Bilona Ghee.",
};

export default async function FAQPage() {
  // Fetch from the DB
  const { faqs } = await getFAQs();

  return (
    <div className="faq-page">
      <section className="section" style={{ minHeight: '80vh', backgroundColor: '#FFFDF7' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-secondary-dark)' }}>Frequently Asked Questions</h1>
            <p style={{ color: 'var(--color-text-light)', fontSize: '1.2rem' }}>Everything you need to know about Auxiron and our Ghee.</p>
          </div>

          <FaqAccordion faqs={faqs || []} />
        </div>
      </section>
    </div>
  );
}
