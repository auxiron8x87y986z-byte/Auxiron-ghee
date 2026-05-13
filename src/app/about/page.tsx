import Image from "next/image";
import { dbFetch, prisma } from "@/lib/prisma";
import { normalizeImageUrl } from "@/lib/image-utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "About Us | Auxiron",
  description: "Learn about the tradition and purity behind Auxiron's Shuddh Deshi Bilona Ghee.",
};

export default async function AboutPage() {
  const keys = ["about_heading", "about_intro", "about_hero_image", "about_method_heading", "about_method_text", "about_farm_image", "about_promise_heading", "about_purity_image", "about_promise_items", "about_extra_sections"];
  
  const blocks = await dbFetch(
    () => prisma.$queryRaw`SELECT \`key\`, \`value\` FROM contentblock WHERE \`key\` IN (${keys.join(',')})` as Promise<Array<{ key: string; value: string }>>,
    []
  );

  const getVal = (key: string, def: string) => {
    const block = blocks.find(b => b.key === key);
    return block ? block.value : def;
  };

  const heading = getVal("about_heading", "The Identity of Purity");
  const intro = getVal("about_intro", "At Auxiron, we believe that true health comes from nature. Born in the vibrant lands of Rajasthan, we are on a mission to bring back the lost authenticity of Indian culinary traditions, starting with our golden elixir: Shuddh Deshi Bilona Ghee.");
  const heroImage = getVal("about_hero_image", "");

  const methodHeading = getVal("about_method_heading", "The Bilona Method");
  const methodText = getVal("about_method_text", "Unlike commercial ghee which is made directly from milk cream using machines, our ghee is crafted the ancient way. Fresh milk from indigenous cows is boiled over slow wood fire and naturally cooled.\n\nThe milk is then converted into curd in earthen pots. This curd is hand-churned (Bilona) using a wooden churner in a bi-directional motion to extract the purest butter (Makkhan). Finally, this butter is slowly heated to separate the pure, aromatic ghee.");
  const farmImage = getVal("about_farm_image", "");

  const promiseHeading = getVal("about_promise_heading", "Our Promise");
  const purityImage = getVal("about_purity_image", "");

  const defaultPromises = [
    '100% pure and organic, with no added preservatives or colors.',
    'Made strictly from A2 milk of grass-fed indigenous cows.',
    'Crafted in small batches to ensure premium quality.',
    'Delivered fresh locally in Jaipur & Jodhpur.'
  ];
  let promises = defaultPromises;
  try {
    const raw = getVal("about_promise_items", "");
    if (raw) promises = JSON.parse(raw);
  } catch(e) {}

  let extraSections: { heading: string, content: string, imageUrl: string }[] = [];
  try {
    const raw = getVal("about_extra_sections", "");
    if (raw) extraSections = JSON.parse(raw);
  } catch(e) {}

  return (
    <div className="about-page">
      <section className="section" style={{ backgroundColor: '#FFFDF7' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', marginBottom: heroImage ? '3rem' : '4rem' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--color-secondary-dark)' }}>
              {heading}
            </h1>
            <div style={{ fontSize: '1.2rem', color: 'var(--color-text-light)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {intro}
            </div>
          </div>

          {heroImage && (
            <div style={{ width: '100%', height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '5rem', boxShadow: 'var(--shadow-md)' }}>
              <img src={normalizeImageUrl(heroImage)} alt={heading} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          <div style={{ display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '5rem' }}>
            <div style={{ flex: '1 1 400px', order: 2 }}>
              <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                {farmImage ? (
                  <img src={normalizeImageUrl(farmImage)} alt="Farm Tradition" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'var(--color-text-light)' }}>[Farm/Tradition Image]</span>
                  </div>
                )}
              </div>
            </div>
            <div style={{ flex: '1 1 400px', order: 1 }}>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>{methodHeading}</h2>
              <div style={{ color: 'var(--color-text-light)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {methodText}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                {purityImage ? (
                  <img src={normalizeImageUrl(purityImage)} alt="Purity" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'var(--color-text-light)' }}>[Purity Image]</span>
                  </div>
                )}
              </div>
            </div>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>{promiseHeading}</h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {promises.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--color-primary)', fontSize: '1.5rem' }}>✓</span>
                    <span style={{ color: 'var(--color-text-light)', lineHeight: 1.6, marginTop: '0.2rem' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Render Extra Sections */}
          {extraSections.map((sec, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={i} style={{ display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '5rem' }}>
                <div style={{ flex: '1 1 400px', order: isEven ? 2 : 1 }}>
                  <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                    {sec.imageUrl ? (
                      <img src={normalizeImageUrl(sec.imageUrl)} alt={sec.heading} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'var(--color-text-light)' }}>[Section Image]</span>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ flex: '1 1 400px', order: isEven ? 1 : 2 }}>
                  <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>{sec.heading}</h2>
                  <div style={{ color: 'var(--color-text-light)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                    {sec.content}
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </section>
    </div>
  );
}
