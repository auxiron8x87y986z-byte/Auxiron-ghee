export const metadata = {
  title: "Privacy Policy | Auxiron",
  description: "Privacy Policy for Auxiron.",
};

export default function PrivacyPage() {
  return (
    <div className="privacy-page">
      <section className="section" style={{ minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '800px', backgroundColor: 'var(--color-surface)', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--color-secondary-dark)', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
            Privacy Policy
          </h1>
          
          <div className="content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--color-text-light)', lineHeight: 1.7 }}>
            <p><strong>Last updated:</strong> May 1, 2026</p>
            
            <p>At Auxiron, accessible from auxiron.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Auxiron and how we use it.</p>
            
            <h2 style={{ color: 'var(--color-text)', marginTop: '1rem' }}>Information We Collect</h2>
            <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
            <p>If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.</p>
            <p>When you register for an Account or place an order, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.</p>

            <h2 style={{ color: 'var(--color-text)', marginTop: '1rem' }}>How We Use Your Information</h2>
            <ul style={{ paddingLeft: '2rem' }}>
              <li>Provide, operate, and maintain our website</li>
              <li>Improve, personalize, and expand our website</li>
              <li>Understand and analyze how you use our website</li>
              <li>Process your orders and manage your account</li>
              <li>Communicate with you for customer service and updates</li>
            </ul>

            <h2 style={{ color: 'var(--color-text)', marginTop: '1rem' }}>Contact Us</h2>
            <p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at support@auxiron.com.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
