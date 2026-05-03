export const metadata = {
  title: "Return Policy | Auxiron",
  description: "Return Policy for Auxiron.",
};

export default function ReturnPage() {
  return (
    <div className="return-page">
      <section className="section" style={{ minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '800px', backgroundColor: 'var(--color-surface)', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--color-secondary-dark)', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
            Return & Refund Policy
          </h1>
          
          <div className="content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--color-text-light)', lineHeight: 1.7 }}>
            <p><strong>Last updated:</strong> May 1, 2026</p>
            
            <p>Thank you for shopping at Auxiron.</p>
            
            <h2 style={{ color: 'var(--color-text)', marginTop: '1rem' }}>No Returns on Food Items</h2>
            <p>Due to the consumable nature of our products (Shuddh Deshi Bilona Ghee), <strong>we do not accept returns or exchanges</strong> once the order has been delivered.</p>
            <p>We maintain strict hygiene and quality standards at our farms and packaging facility, and taking food items back compromises our quality control process.</p>

            <h2 style={{ color: 'var(--color-text)', marginTop: '1rem' }}>Damaged or Incorrect Items</h2>
            <p>If you receive a damaged product or an incorrect item, please notify us within 24 hours of delivery. We will require photographic evidence of the damaged or incorrect product.</p>
            <p>Upon verification, we will issue a replacement for the damaged/incorrect item at no additional cost to you.</p>

            <h2 style={{ color: 'var(--color-text)', marginTop: '1rem' }}>Cancellations</h2>
            <p>Orders can only be cancelled before they are dispatched. Once an order is shipped, it cannot be cancelled.</p>

            <h2 style={{ color: 'var(--color-text)', marginTop: '1rem' }}>Contact Us</h2>
            <p>If you have any questions about our Returns and Refunds Policy, please contact us:</p>
            <ul style={{ paddingLeft: '2rem' }}>
              <li>By email: support@auxiron.com</li>
              <li>By WhatsApp: +91 00000 00000</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
