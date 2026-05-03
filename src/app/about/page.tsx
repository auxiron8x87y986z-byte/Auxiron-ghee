import Image from "next/image";

export const metadata = {
  title: "About Us | Auxiron",
  description: "Learn about the tradition and purity behind Auxiron's Shuddh Deshi Bilona Ghee.",
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="section" style={{ backgroundColor: '#FFFDF7' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', marginBottom: '4rem' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--color-secondary-dark)' }}>
              The Identity of Purity
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--color-text-light)', lineHeight: 1.8 }}>
              At Auxiron, we believe that true health comes from nature. Born in the vibrant lands of Rajasthan, 
              we are on a mission to bring back the lost authenticity of Indian culinary traditions, starting with 
              our golden elixir: Shuddh Deshi Bilona Ghee.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '5rem' }}>
            <div style={{ flex: '1 1 400px', order: 2 }}>
              <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'var(--color-text-light)' }}>[Farm/Tradition Image]</span>
                </div>
              </div>
            </div>
            <div style={{ flex: '1 1 400px', order: 1 }}>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>The Bilona Method</h2>
              <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8, marginBottom: '1rem' }}>
                Unlike commercial ghee which is made directly from milk cream using machines, our ghee is crafted 
                the ancient way. Fresh milk from indigenous cows is boiled over slow wood fire and naturally cooled. 
              </p>
              <p style={{ color: 'var(--color-text-light)', lineHeight: 1.8 }}>
                The milk is then converted into curd in earthen pots. This curd is hand-churned (Bilona) using a 
                wooden churner in a bi-directional motion to extract the purest butter (Makkhan). Finally, this 
                butter is slowly heated to separate the pure, aromatic ghee.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'var(--color-text-light)' }}>[Purity Image]</span>
                </div>
              </div>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>Our Promise</h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  '100% pure and organic, with no added preservatives or colors.',
                  'Made strictly from A2 milk of grass-fed indigenous cows.',
                  'Crafted in small batches to ensure premium quality.',
                  'Delivered fresh locally in Jaipur & Jodhpur.'
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--color-primary)', fontSize: '1.5rem' }}>✓</span>
                    <span style={{ color: 'var(--color-text-light)', lineHeight: 1.6, marginTop: '0.2rem' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
